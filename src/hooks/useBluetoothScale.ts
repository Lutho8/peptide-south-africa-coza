import { useState, useCallback, useRef } from 'react';
import { saveBodyCompositionEntry, BodyComposition } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Standard Bluetooth SIG Weight Scale Service UUIDs
const WEIGHT_SCALE_SERVICE = '0000181d-0000-1000-8000-00805f9b34fb';
const BODY_COMPOSITION_SERVICE = '0000181b-0000-1000-8000-00805f9b34fb';
const WEIGHT_MEASUREMENT_CHAR = '00002a9d-0000-1000-8000-00805f9b34fb';
const BODY_COMPOSITION_CHAR = '00002a9c-0000-1000-8000-00805f9b34fb';

// Xiaomi Mi Scale 2 / Mi Body Composition Scale
const XIAOMI_BODY_COMPOSITION_SERVICE = '00001530-0000-3512-2118-0009af100700';
const XIAOMI_SCALE_CHAR = '00002a9d-0000-1000-8000-00805f9b34fb';

// Eufy Smart Scale
const EUFY_SCALE_SERVICE = '0000fff0-0000-1000-8000-00805f9b34fb';
const EUFY_SCALE_CHAR = '0000fff4-0000-1000-8000-00805f9b34fb';

// Renpho Smart Scale
const RENPHO_SCALE_SERVICE = '0000fff0-0000-1000-8000-00805f9b34fb';
const RENPHO_SCALE_CHAR = '0000fff1-0000-1000-8000-00805f9b34fb';

// Withings / Nokia Body+ Scale
const WITHINGS_SCALE_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';

// Fitbit Aria
const FITBIT_ARIA_SERVICE = 'adabfb00-6e7d-4601-bda2-bffaa68956ba';

// 1byone / Etekcity / Generic scales using User Data Service
const USER_DATA_SERVICE = '0000181c-0000-1000-8000-00805f9b34fb';

// Yunmai scale
const YUNMAI_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
const YUNMAI_CHAR = '0000ffe4-0000-1000-8000-00805f9b34fb';

// All supported services for device discovery
const ALL_SCALE_SERVICES = [
  WEIGHT_SCALE_SERVICE,
  BODY_COMPOSITION_SERVICE,
  XIAOMI_BODY_COMPOSITION_SERVICE,
  EUFY_SCALE_SERVICE,
  RENPHO_SCALE_SERVICE,
  WITHINGS_SCALE_SERVICE,
  FITBIT_ARIA_SERVICE,
  USER_DATA_SERVICE,
  YUNMAI_SERVICE,
];

export type ScaleBrand =
  | 'renpho'
  | 'xiaomi'
  | 'eufy'
  | 'yunmai'
  | 'withings'
  | 'fitbit'
  | 'generic';

interface BluetoothScaleState {
  isConnecting: boolean;
  isConnected: boolean;
  deviceName: string | null;
  lastReading: Date | null;
  error: string | null;
  scaleBrand: ScaleBrand | null;
  isSyncing: boolean;
}

interface ScaleMeasurement {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bodyWater?: number;
  boneMass?: number;
  bmi?: number;
  visceralFat?: number;
  metabolicAge?: number;
  bmr?: number;
}

// Extend Navigator type for Web Bluetooth
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }

  interface RequestDeviceOptions {
    filters?: Array<{ services?: string[]; name?: string; namePrefix?: string }>;
    optionalServices?: string[];
    acceptAllDevices?: boolean;
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: 'gattserverdisconnected', listener: () => void): void;
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    value?: DataView;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    readValue(): Promise<DataView>;
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  }
}

// Infer scale brand from the device name as a fallback when the service UUID
// alone is ambiguous (e.g. shared 0xfff0 service across vendors).
function inferBrandFromName(name: string | undefined | null): ScaleBrand | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('renpho')) return 'renpho';
  if (n.includes('mi ') || n.includes('mibcs') || n.includes('xiaomi') || n.includes('mi body')) return 'xiaomi';
  if (n.includes('eufy')) return 'eufy';
  if (n.includes('yunmai')) return 'yunmai';
  if (n.includes('withings') || n.includes('body+') || n.includes('nokia')) return 'withings';
  if (n.includes('aria') || n.includes('fitbit')) return 'fitbit';
  return null;
}

export function useBluetoothScale() {
  const { user } = useAuth();
  const [state, setState] = useState<BluetoothScaleState>({
    isConnecting: false,
    isConnected: false,
    deviceName: null,
    lastReading: null,
    error: null,
    scaleBrand: null,
    isSyncing: false,
  });
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const isBodyCompositionRef = useRef<boolean>(false);
  const scaleBrandRef = useRef<ScaleBrand>('generic');

  // Check if Web Bluetooth is supported
  const isSupported = useCallback(() => {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }, []);

  // Parse weight measurement from Bluetooth data
  const parseWeightMeasurement = useCallback((dataView: DataView): number => {
    const flags = dataView.getUint8(0);
    const isKg = (flags & 0x01) === 0;

    // Weight is in 0.005 kg or 0.01 lb resolution
    const rawWeight = dataView.getUint16(1, true);
    const weight = isKg ? rawWeight * 0.005 : rawWeight * 0.01 * 0.453592;

    return Math.round(weight * 10) / 10;
  }, []);

  // Parse body composition measurement
  const parseBodyComposition = useCallback((dataView: DataView): Partial<ScaleMeasurement> => {
    const result: Partial<ScaleMeasurement> = {};

    try {
      const flags = dataView.getUint16(0, true);
      let offset = 2;

      // Weight (always present after flags)
      if (dataView.byteLength >= offset + 2) {
        result.weight = dataView.getUint16(offset, true) * 0.005;
        offset += 2;
      }

      // Body fat percentage (if flag set)
      if ((flags & 0x0002) && dataView.byteLength >= offset + 2) {
        result.bodyFat = dataView.getUint16(offset, true) * 0.1;
        offset += 2;
      }

      // Muscle mass (if flag set)
      if ((flags & 0x0008) && dataView.byteLength >= offset + 2) {
        result.muscleMass = dataView.getUint16(offset, true) * 0.005;
        offset += 2;
      }

      // Body water (if flag set)
      if ((flags & 0x0010) && dataView.byteLength >= offset + 2) {
        result.bodyWater = dataView.getUint16(offset, true) * 0.1;
        offset += 2;
      }
    } catch (e) {
      console.warn('Error parsing body composition data:', e);
    }

    return result;
  }, []);

  // Save measurement to storage and database — stamps the detected scale brand
  // into `source` so the UI can show "Connected to {Brand}" accurately.
  const saveMeasurement = useCallback(async (measurement: ScaleMeasurement, brand: ScaleBrand) => {
    const date = new Date().toISOString().split('T')[0];
    const weight = measurement.weight;

    const fatFreeWeight = measurement.bodyFat
      ? weight * (1 - measurement.bodyFat / 100)
      : undefined;

    const entry: BodyComposition = {
      date,
      weight,
      bodyFat: measurement.bodyFat,
      fatFreeWeight,
      muscleMass: measurement.muscleMass,
      skeletalMuscle: undefined,
      bodyWater: measurement.bodyWater,
      subcutaneousFat: undefined,
      boneMass: measurement.boneMass,
      protein: undefined,
      bmi: measurement.bmi,
      visceralFat: measurement.visceralFat,
      metabolicAge: measurement.metabolicAge,
      bmr: measurement.bmr,
      source: brand,
    };

    saveBodyCompositionEntry(entry);

    if (user) {
      try {
        await supabase.from('body_composition').upsert({
          user_id: user.id,
          date: entry.date,
          weight: entry.weight,
          body_fat: entry.bodyFat,
          fat_free_weight: entry.fatFreeWeight,
          muscle_mass: entry.muscleMass,
          skeletal_muscle: entry.skeletalMuscle,
          body_water: entry.bodyWater,
          subcutaneous_fat: entry.subcutaneousFat,
          bone_mass: entry.boneMass,
          protein: entry.protein,
          bmi: entry.bmi,
          visceral_fat: entry.visceralFat,
          metabolic_age: entry.metabolicAge,
          bmr: entry.bmr,
          source: brand,
        }, { onConflict: 'user_id,date' });
      } catch (err) {
        console.error('Error saving to cloud:', err);
      }
    }

    setState(prev => ({ ...prev, lastReading: new Date() }));
    toast.success(`Weight recorded: ${measurement.weight} kg`);
  }, [user]);

  // Connect to a Bluetooth scale
  const connectScale = useCallback(async () => {
    if (!isSupported()) {
      toast.error('Bluetooth is not supported on this device');
      return false;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const bluetoothDevice = await navigator.bluetooth!.requestDevice({
        acceptAllDevices: true,
        optionalServices: ALL_SCALE_SERVICES,
      });

      if (!bluetoothDevice.gatt) {
        throw new Error('GATT not available');
      }

      const server = await bluetoothDevice.gatt.connect();

      let service: BluetoothRemoteGATTService | null = null;
      let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
      let isBodyComposition = false;
      let detectedBrand: ScaleBrand = 'generic';

      // Service/characteristic pairs — order matters for brand detection.
      // Prefer brand-specific services BEFORE generic standard services so that
      // e.g. a Renpho with the 0xfff0 service is detected as 'renpho', not generic.
      const serviceAttempts = [
        { service: XIAOMI_BODY_COMPOSITION_SERVICE, char: XIAOMI_SCALE_CHAR, brand: 'xiaomi' as ScaleBrand, isBody: true },
        { service: RENPHO_SCALE_SERVICE, char: RENPHO_SCALE_CHAR, brand: 'renpho' as ScaleBrand, isBody: false },
        { service: EUFY_SCALE_SERVICE, char: EUFY_SCALE_CHAR, brand: 'eufy' as ScaleBrand, isBody: false },
        { service: YUNMAI_SERVICE, char: YUNMAI_CHAR, brand: 'yunmai' as ScaleBrand, isBody: false },
        { service: BODY_COMPOSITION_SERVICE, char: BODY_COMPOSITION_CHAR, brand: 'generic' as ScaleBrand, isBody: true },
        { service: WEIGHT_SCALE_SERVICE, char: WEIGHT_MEASUREMENT_CHAR, brand: 'generic' as ScaleBrand, isBody: false },
      ];

      // Always allow device-name override (e.g. "Renpho ES-CS20" wins over generic)
      const nameBrand = inferBrandFromName(bluetoothDevice.name);

      for (const attempt of serviceAttempts) {
        try {
          service = await server.getPrimaryService(attempt.service);
          characteristic = await service.getCharacteristic(attempt.char);
          isBodyComposition = attempt.isBody;
          detectedBrand = attempt.brand;
          console.log(`Connected via ${detectedBrand} service`);
          break;
        } catch {
          continue;
        }
      }

      if (!service || !characteristic) {
        throw new Error('No compatible scale service found. Please ensure your scale is turned on and in pairing mode.');
      }

      // Device name takes precedence when generic service was matched.
      const finalBrand: ScaleBrand =
        detectedBrand === 'generic' && nameBrand ? nameBrand : (nameBrand ?? detectedBrand);

      // Persist refs for later (Sync Now)
      characteristicRef.current = characteristic;
      isBodyCompositionRef.current = isBodyComposition;
      scaleBrandRef.current = finalBrand;

      // Listen for measurements
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
        const value = target.value;

        if (!value) return;

        let measurement: ScaleMeasurement;

        if (isBodyCompositionRef.current) {
          const parsed = parseBodyComposition(value);
          measurement = { weight: parsed.weight || 0, ...parsed };
        } else {
          measurement = { weight: parseWeightMeasurement(value) };
        }

        if (measurement.weight > 0) {
          saveMeasurement(measurement, scaleBrandRef.current);
        }
      });

      await characteristic.startNotifications();

      // Handle disconnection
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        characteristicRef.current = null;
        setState(prev => ({
          ...prev,
          isConnected: false,
          deviceName: null,
          scaleBrand: null,
        }));
        toast.info('Scale disconnected');
      });

      setDevice(bluetoothDevice);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        deviceName: bluetoothDevice.name || 'Unknown Scale',
        scaleBrand: finalBrand,
        error: null,
      }));

      toast.success(`Connected to ${bluetoothDevice.name || finalBrand}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';

      if (message.includes('cancelled') || message.includes('canceled')) {
        setState(prev => ({ ...prev, isConnecting: false }));
        return false;
      }

      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
      toast.error(message);
      return false;
    }
  }, [isSupported, parseWeightMeasurement, parseBodyComposition, saveMeasurement]);

  // Re-read the latest cached measurement from the connected scale.
  // Web Bluetooth has no remote-trigger command, so this fetches whatever
  // the scale last broadcast (works on most Renpho/Xiaomi/Yunmai models).
  const syncNow = useCallback(async () => {
    const characteristic = characteristicRef.current;
    if (!characteristic) {
      toast.error('Scale not connected');
      return false;
    }

    setState(prev => ({ ...prev, isSyncing: true }));
    try {
      const value = await characteristic.readValue();

      if (!value || value.byteLength === 0) {
        toast.info('No fresh reading available. Step on your scale to send a new measurement.');
        return false;
      }

      let measurement: ScaleMeasurement;
      if (isBodyCompositionRef.current) {
        const parsed = parseBodyComposition(value);
        measurement = { weight: parsed.weight || 0, ...parsed };
      } else {
        measurement = { weight: parseWeightMeasurement(value) };
      }

      if (measurement.weight > 0) {
        await saveMeasurement(measurement, scaleBrandRef.current);
        return true;
      }

      toast.info('No fresh reading available. Step on your scale to send a new measurement.');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      // Some characteristics don't support read; fall back to a friendly message.
      if (message.toLowerCase().includes('not supported') || message.toLowerCase().includes('not permitted')) {
        toast.info('This scale only sends data when you step on it. Step on the scale to sync.');
      } else {
        toast.error(message);
      }
      return false;
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [parseBodyComposition, parseWeightMeasurement, saveMeasurement]);

  // Disconnect from the scale
  const disconnectScale = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    characteristicRef.current = null;
    setDevice(null);
    setState({
      isConnecting: false,
      isConnected: false,
      deviceName: null,
      lastReading: null,
      error: null,
      scaleBrand: null,
      isSyncing: false,
    });
  }, [device]);

  return {
    ...state,
    isSupported: isSupported(),
    connectScale,
    disconnectScale,
    syncNow,
  };
}

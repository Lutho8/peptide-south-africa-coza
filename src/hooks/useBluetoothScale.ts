import { useState, useCallback } from 'react';
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
const XIAOMI_SCALE_SERVICE = '0000181d-0000-1000-8000-00805f9b34fb';
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

interface BluetoothScaleState {
  isConnecting: boolean;
  isConnected: boolean;
  deviceName: string | null;
  lastReading: Date | null;
  error: string | null;
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
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  }
}

export function useBluetoothScale() {
  const { user } = useAuth();
  const [state, setState] = useState<BluetoothScaleState>({
    isConnecting: false,
    isConnected: false,
    deviceName: null,
    lastReading: null,
    error: null,
  });
  const [device, setDevice] = useState<BluetoothDevice | null>(null);

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

  // Save measurement to storage and database
  const saveMeasurement = useCallback(async (measurement: ScaleMeasurement) => {
    const date = new Date().toISOString().split('T')[0];
    const weight = measurement.weight;
    
    // Calculate fat-free weight if we have body fat
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
    };

    // Save locally
    saveBodyCompositionEntry(entry);

    // Save to cloud if logged in
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
          source: 'bluetooth',
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
      // Use acceptAllDevices with optional services for broader compatibility
      // This allows connecting to scales that use non-standard service UUIDs
      const bluetoothDevice = await navigator.bluetooth!.requestDevice({
        acceptAllDevices: true,
        optionalServices: ALL_SCALE_SERVICES,
      });

      if (!bluetoothDevice.gatt) {
        throw new Error('GATT not available');
      }

      const server = await bluetoothDevice.gatt.connect();
      
      // Try multiple services in order of preference
      let service: BluetoothRemoteGATTService | null = null;
      let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
      let isBodyComposition = false;
      let scaleType = 'generic';

      // Service/characteristic pairs to try, in order of preference
      const serviceAttempts = [
        { service: BODY_COMPOSITION_SERVICE, char: BODY_COMPOSITION_CHAR, type: 'body-composition', isBody: true },
        { service: WEIGHT_SCALE_SERVICE, char: WEIGHT_MEASUREMENT_CHAR, type: 'weight-scale', isBody: false },
        { service: XIAOMI_BODY_COMPOSITION_SERVICE, char: XIAOMI_SCALE_CHAR, type: 'xiaomi', isBody: true },
        { service: EUFY_SCALE_SERVICE, char: EUFY_SCALE_CHAR, type: 'eufy', isBody: false },
        { service: RENPHO_SCALE_SERVICE, char: RENPHO_SCALE_CHAR, type: 'renpho', isBody: false },
        { service: YUNMAI_SERVICE, char: YUNMAI_CHAR, type: 'yunmai', isBody: false },
      ];

      for (const attempt of serviceAttempts) {
        try {
          service = await server.getPrimaryService(attempt.service);
          characteristic = await service.getCharacteristic(attempt.char);
          isBodyComposition = attempt.isBody;
          scaleType = attempt.type;
          console.log(`Connected via ${scaleType} service`);
          break;
        } catch {
          // Try next service
          continue;
        }
      }

      if (!service || !characteristic) {
        throw new Error('No compatible scale service found. Please ensure your scale is turned on and in pairing mode.');
      }

      // Listen for measurements
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        
        if (!value) return;

        let measurement: ScaleMeasurement;
        
        if (isBodyComposition) {
          const parsed = parseBodyComposition(value);
          measurement = { weight: parsed.weight || 0, ...parsed };
        } else {
          measurement = { weight: parseWeightMeasurement(value) };
        }

        if (measurement.weight > 0) {
          saveMeasurement(measurement);
        }
      });

      await characteristic.startNotifications();

      // Handle disconnection
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          deviceName: null,
        }));
        toast.info('Scale disconnected');
      });

      setDevice(bluetoothDevice);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        deviceName: bluetoothDevice.name || 'Unknown Scale',
        error: null,
      }));

      toast.success(`Connected to ${bluetoothDevice.name || 'scale'}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      
      // User cancelled is not an error
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

  // Disconnect from the scale
  const disconnectScale = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setState({
      isConnecting: false,
      isConnected: false,
      deviceName: null,
      lastReading: null,
      error: null,
    });
  }, [device]);

  return {
    ...state,
    isSupported: isSupported(),
    connectScale,
    disconnectScale,
  };
}

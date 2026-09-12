import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MeasurementToolScreen } from '@/screens/MeasurementToolScreen';
export function ReconstitutionCalculator({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}>
    <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
      <DialogHeader><DialogTitle>Reconstitution and syringe conversion</DialogTitle></DialogHeader>
      <MeasurementToolScreen calculatorOnly />
    </DialogContent>
  </Dialog>;
}

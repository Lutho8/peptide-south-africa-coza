import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, Calculator, FileDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTeaserMode } from '@/hooks/useTeaserMode';
import { useDailyLimit } from '@/hooks/useDailyLimit';
import { startCheckout } from '@/lib/billing';
import { toast } from '@/hooks/use-toast';

interface PreviewPeptide {
  id: string;
  name: string;
  tagline: string;
  category: string;
  highlights: string[];
}

const PREVIEW_PEPTIDES: PreviewPeptide[] = [
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    tagline: 'Triple-agonist GLP-1 / GIP / Glucagon',
    category: 'Weight Loss',
    highlights: ['Up to ~24% body weight reduction (Phase 2)', 'Weekly subcutaneous', 'Strong appetite suppression'],
  },
  {
    id: 'klow',
    name: 'KLOW Blend',
    tagline: 'KPV + Larazotide + Oxytocin + Wolverine',
    category: 'Healing & Gut',
    highlights: ['Gut barrier repair', 'Anti-inflammatory stack', 'High-mass blend (80mg / 3mL standard)'],
  },
  {
    id: 'tesamorellin',
    name: 'Tesamorellin',
    tagline: 'GHRH analog — visceral fat reduction',
    category: 'GH Secretagogue',
    highlights: ['FDA-approved (HIV lipodystrophy)', 'Reduces VAT', 'Improves IGF-1'],
  },
];

const TOTAL_PEPTIDES = 98;

export function TeaserMode() {
  const { exitTeaser } = useTeaserMode();
  const calcLimit = useDailyLimit('teaser_calculator', 1);
  const [openPeptide, setOpenPeptide] = useState<PreviewPeptide | null>(null);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await startCheckout('monthly');
    } catch {
      exitTeaser(); // route back to PaywallScreen
    } finally {
      setUnlocking(false);
    }
  };

  const handleCalculator = () => {
    if (calcLimit.limitReached) {
      toast({
        title: 'Daily limit reached',
        description: 'Free tier allows 1 calculator use per day. Unlock Premium for unlimited use.',
        variant: 'destructive',
      });
      return;
    }
    if (calcLimit.consume()) {
      setCalcOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top banner */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">Unlock all {TOTAL_PEPTIDES}+ peptides — R4.99/month</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleUnlock}
            disabled={unlocking}
            className="shrink-0 h-8"
          >
            Unlock
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Free Preview</h1>
          <p className="text-muted-foreground">
            Showing 3 of {TOTAL_PEPTIDES}+ peptides. Upgrade to unlock the full library.
          </p>
        </div>

        {/* Free actions row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Button
            variant="outline"
            onClick={handleCalculator}
            disabled={calcLimit.limitReached}
            className="h-auto py-4 flex-col gap-1"
          >
            <Calculator className="w-5 h-5" />
            <span className="text-sm font-medium">Reconstitution Calculator</span>
            <span className="text-xs text-muted-foreground">
              {calcLimit.limitReached ? 'Used today (1/1)' : `${calcLimit.remaining} use left today`}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setLockedDialogOpen(true)}
            className="h-auto py-4 flex-col gap-1 opacity-80"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Create Protocol</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> Unlock to create protocols
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setLockedDialogOpen(true)}
            className="h-auto py-4 flex-col gap-1 opacity-80"
          >
            <FileDown className="w-5 h-5" />
            <span className="text-sm font-medium">Export</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> Unlock to export
            </span>
          </Button>
        </div>

        {/* Preview peptides */}
        <h2 className="text-lg font-semibold mb-4">Available in Free Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {PREVIEW_PEPTIDES.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card
                onClick={() => setOpenPeptide(p)}
                className="p-5 cursor-pointer hover:border-primary/50 transition-colors h-full"
              >
                <div className="text-xs text-primary font-medium mb-1">{p.category}</div>
                <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{p.tagline}</p>
                <ul className="space-y-1.5">
                  {p.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Locked teaser grid */}
        <h2 className="text-lg font-semibold mb-4">Locked ({TOTAL_PEPTIDES - 3}+ peptides)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setLockedDialogOpen(true)}
              className="relative aspect-square rounded-lg border border-border bg-card/40 backdrop-blur-sm flex items-center justify-center group hover:border-primary/50 transition-colors"
            >
              <Lock className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/40 rounded-lg" />
            </button>
          ))}
        </div>
      </main>

      {/* Persistent bottom banner */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3 max-w-4xl">
          <div className="min-w-0">
            <div className="text-base font-bold">R3499/month</div>
            <div className="text-xs text-muted-foreground truncate">
              Unlimited access • Cancel anytime
            </div>
          </div>
          <Button onClick={handleUnlock} disabled={unlocking} size="lg" className="shrink-0">
            {unlocking ? 'Loading…' : 'Unlock'}
          </Button>
        </div>
      </motion.div>

      {/* Preview peptide modal */}
      <Dialog open={!!openPeptide} onOpenChange={(o) => !o && setOpenPeptide(null)}>
        <DialogContent className="max-w-md">
          {openPeptide && (
            <>
              <DialogHeader>
                <div className="text-xs text-primary font-medium mb-1">{openPeptide.category}</div>
                <DialogTitle className="text-2xl">{openPeptide.name}</DialogTitle>
                <DialogDescription>{openPeptide.tagline}</DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 mt-2">
                {openPeptide.highlights.map((h, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-md bg-muted/50 text-xs text-muted-foreground">
                Full dosing protocols, stacking matrix, and bloodwork tracking are unlocked with Premium.
              </div>
              <Button onClick={handleUnlock} disabled={unlocking} className="w-full mt-2">
                Unlock Premium — R4.99/month
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Locked peptide / locked feature dialog */}
      <Dialog open={lockedDialogOpen} onOpenChange={setLockedDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center">This peptide is Premium</DialogTitle>
            <DialogDescription className="text-center">
              Unlock to browse all {TOTAL_PEPTIDES}+ peptides, create protocols, and export your data.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleUnlock} disabled={unlocking} className="w-full">
            Unlock Premium — R4.99/month
          </Button>
          <Button variant="ghost" onClick={() => setLockedDialogOpen(false)} className="w-full">
            Maybe later
          </Button>
        </DialogContent>
      </Dialog>

      {/* Free calculator (used 1×/day) */}
      <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reconstitution Calculator</DialogTitle>
            <DialogDescription>
              Free tier: 1 use per day. Unlock Premium for unlimited use.
            </DialogDescription>
          </DialogHeader>
          <FreeCalculator />
          <Button onClick={handleUnlock} disabled={unlocking} variant="outline" className="w-full">
            Unlock unlimited use
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Tiny self-contained calculator for the free tier. Avoids loading the full premium calculator. */
function FreeCalculator() {
  const [vialMg, setVialMg] = useState('5');
  const [bacMl, setBacMl] = useState('2');
  const [doseMg, setDoseMg] = useState('0.25');

  const mg = parseFloat(vialMg) || 0;
  const ml = parseFloat(bacMl) || 0;
  const dose = parseFloat(doseMg) || 0;
  const concentration = ml > 0 ? mg / ml : 0;
  const mlPerDose = concentration > 0 ? dose / concentration : 0;
  const unitsU100 = mlPerDose * 100;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <label className="text-xs">
          <span className="text-muted-foreground">Vial (mg)</span>
          <input
            type="number"
            value={vialMg}
            onChange={(e) => setVialMg(e.target.value)}
            className="w-full mt-1 px-2 py-1.5 rounded-md bg-background border border-border text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted-foreground">BAC water (mL)</span>
          <input
            type="number"
            value={bacMl}
            onChange={(e) => setBacMl(e.target.value)}
            className="w-full mt-1 px-2 py-1.5 rounded-md bg-background border border-border text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="text-muted-foreground">Dose (mg)</span>
          <input
            type="number"
            value={doseMg}
            onChange={(e) => setDoseMg(e.target.value)}
            className="w-full mt-1 px-2 py-1.5 rounded-md bg-background border border-border text-sm"
          />
        </label>
      </div>
      <div className="rounded-md bg-muted/50 p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Concentration</span>
          <span className="font-medium">{concentration.toFixed(2)} mg/mL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Volume per dose</span>
          <span className="font-medium">{mlPerDose.toFixed(3)} mL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">U-100 units</span>
          <span className="font-bold text-primary">{unitsU100.toFixed(0)} units</span>
        </div>
      </div>
    </div>
  );
}

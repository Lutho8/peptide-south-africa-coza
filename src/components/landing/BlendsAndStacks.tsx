import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PeptideBlends } from './PeptideBlends';
import { StackBuilder } from './StackBuilder';

interface BlendsAndStacksProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'blends' | 'stacks';

export function BlendsAndStacks({ open, onClose }: BlendsAndStacksProps) {
  const [tab, setTab] = useState<Tab>('blends');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col">
      <div className="border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex items-center gap-2 mr-auto">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold leading-tight">Blends &amp; Stacks</h1>
              <p className="text-[11px] text-muted-foreground">Pre-made blends and your own combinations</p>
            </div>
          </div>
          <div className="flex bg-muted rounded-full p-0.5">
            <button
              onClick={() => setTab('blends')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px]',
                tab === 'blends'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-muted-foreground'
              )}
            >
              <FlaskConical className="w-3.5 h-3.5 inline mr-1" /> Blends
            </button>
            <button
              onClick={() => setTab('stacks')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px]',
                tab === 'stacks'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-muted-foreground'
              )}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" /> Build Stack
            </button>
          </div>
        </div>
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-hidden relative"
      >
        {/* Render the existing modals inline (they manage their own close button) */}
        {tab === 'blends' ? (
          <PeptideBlends open onClose={onClose} />
        ) : (
          <StackBuilder open onClose={onClose} />
        )}
      </motion.div>
    </div>
  );
}

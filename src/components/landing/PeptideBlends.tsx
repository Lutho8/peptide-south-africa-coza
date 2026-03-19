import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Layers, X, Search, ChevronRight, BookOpen, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { peptideBlends, peptideStacks, PeptideBlend } from '@/data/peptideBlends';
import { BlendDetailModal } from './BlendDetailModal';
import { cn } from '@/lib/utils';

interface PeptideBlendsProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'blends' | 'stacks';

function BlendCard({ blend, onClick }: { blend: PeptideBlend; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:border-accent/50 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              blend.type === 'blend' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
            )}>
              {blend.type === 'blend' ? <FlaskConical className="w-4 h-4 text-purple-400" /> : <Layers className="w-4 h-4 text-blue-400" />}
            </div>
            <h3 className="font-semibold text-sm truncate">{blend.shortName}</h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{blend.description.slice(0, 120)}...</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px]">{blend.vialSize}</Badge>
            <Badge variant="secondary" className="text-[10px]">{blend.category}</Badge>
            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
              <BookOpen className="w-2.5 h-2.5 mr-1" />{blend.references.length} refs
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {blend.components.slice(0, 3).map((c, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">{c}</span>
            ))}
            {blend.components.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">+{blend.components.length - 3} more</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
      </div>
    </motion.button>
  );
}

export function PeptideBlends({ open, onClose }: PeptideBlendsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('blends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlend, setSelectedBlend] = useState<PeptideBlend | null>(null);

  const items = activeTab === 'blends' ? peptideBlends : peptideStacks;

  const filtered = items.filter(item =>
    !searchQuery ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.components.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!open) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Peptide Blends & Stacks</h1>
                  <p className="text-xs text-muted-foreground">{peptideBlends.length} blends • {peptideStacks.length} stacks • Research-grade protocols</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="gap-1.5">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
              </div>
            </div>
          </div>

          {/* Tabs + Search */}
          <div className="px-4 pt-4 pb-2">
            <div className="container mx-auto space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('blends')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px]',
                    activeTab === 'blends' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <FlaskConical className="w-4 h-4 inline mr-1.5" />Blends ({peptideBlends.length})
                </button>
                <button
                  onClick={() => setActiveTab('stacks')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[40px]',
                    activeTab === 'stacks' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Layers className="w-4 h-4 inline mr-1.5" />Stacks ({peptideStacks.length})
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, component, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="container mx-auto p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(item => (
                  <BlendCard key={item.id} blend={item} onClick={() => setSelectedBlend(item)} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No {activeTab} found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </motion.div>

      <BlendDetailModal blend={selectedBlend} open={!!selectedBlend} onClose={() => setSelectedBlend(null)} />
    </>
  );
}

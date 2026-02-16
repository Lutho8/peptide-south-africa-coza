import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function FreeCourseBanner() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-8 max-w-2xl mx-auto"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 p-6 cursor-pointer hover:border-primary/40 transition-all group"
        onClick={() => navigate('/free-course')}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <GraduationCap className="text-primary" size={28} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Free Starter Course</p>
            <h3 className="text-lg font-bold text-foreground">Introduction to Peptide Therapy</h3>
            <p className="text-sm text-muted-foreground">Learn dosing, protocols & clinical strategies — 100% free, on-demand.</p>
          </div>
          <Button size="sm" className="rounded-full gap-1 shrink-0 group-hover:shadow-lg transition-shadow">
            Enroll Free <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

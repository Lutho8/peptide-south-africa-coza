import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function LiveQnAPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('qna-popup-dismissed')) {
      setDismissed(true);
      return;
    }

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let hasScrolled = false;

    const handleScroll = () => {
      if (hasScrolled) return;
      hasScrolled = true;
      scrollTimeout = setTimeout(() => {
        setVisible(true);
      }, 15000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, once: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('qna-popup-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="relative rounded-xl border border-accent/40 bg-card/95 backdrop-blur-md shadow-2xl p-5">
            <button onClick={dismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm">Free Live Peptide Q&A</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> Monthly on Zoom · Limited Spots
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get free consultation on dosage, stacking, cycles & more from an expert — live every month.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => { dismiss(); navigate('/live-qna'); }}>
                Reserve My Spot
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                Not Now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

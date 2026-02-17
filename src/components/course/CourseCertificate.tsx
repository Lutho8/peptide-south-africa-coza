import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Share2, PartyPopper, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

interface CourseCertificateProps {
  studentName?: string;
  completionDate: Date;
  onDismiss?: () => void;
}

const confettiColors = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  '#FFD700',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
];

function ConfettiPiece({ index }: { index: number }) {
  const color = confettiColors[index % confettiColors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.8;
  const duration = 2 + Math.random() * 2;
  const rotation = Math.random() * 720 - 360;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: '-5%',
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
      initial={{ y: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: '110vh',
        opacity: [1, 1, 0.8, 0],
        rotate: rotation,
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
      }}
    />
  );
}

export function CourseCertificate({ studentName, completionDate, onDismiss }: CourseCertificateProps) {
  const [showCertificate, setShowCertificate] = useState(true);
  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShare = async () => {
    const shareData = {
      title: 'Peptide Therapy Course - Certificate of Completion',
      text: `I just completed the Introduction to Peptide Therapy Starter Course! 🎓🧬`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      toast('Copied to clipboard!', {
        description: 'Share your achievement with friends and colleagues.',
      });
    }
  };

  if (!showCertificate) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
      >
        {/* Confetti */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
          {Array.from({ length: 60 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          className="relative w-full max-w-lg z-50"
        >
          {/* Dismiss */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 z-10 rounded-full bg-background/50 backdrop-blur"
            onClick={() => {
              setShowCertificate(false);
              onDismiss?.();
            }}
          >
            <X size={18} />
          </Button>

          <Card className="overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.6 }}
              >
                <PartyPopper className="mx-auto text-primary-foreground mb-2" size={36} />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-2xl md:text-3xl font-bold text-primary-foreground"
              >
                Congratulations!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-primary-foreground/80 text-sm mt-1"
              >
                You've completed the course! 🎉
              </motion.p>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Certificate Body */}
              <div className="text-center space-y-4 border border-border rounded-xl p-6 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Award size={24} />
                  <span className="text-xs uppercase tracking-widest font-bold">Certificate of Completion</span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">This certifies that</p>
                  <p className="text-xl font-bold text-foreground">
                    {studentName || 'Dedicated Learner'}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  has successfully completed the{' '}
                  <strong className="text-foreground">Introduction to Peptide Therapy Starter Course</strong>,
                  including all 6 modules, 11 video lessons, and 6 knowledge-check quizzes.
                </p>

                <div className="pt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">{formattedDate}</p>
                  <div className="flex items-center justify-center gap-1 text-green-500 text-sm font-medium">
                    <CheckCircle2 size={14} />
                    All Modules Passed
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleShare}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  <Share2 size={16} />
                  Share Achievement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCertificate(false);
                    onDismiss?.();
                  }}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Continue Exploring
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

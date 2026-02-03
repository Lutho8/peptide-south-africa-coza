import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onSignInClick: () => void;
}

const benefits = [
  'Track your peptide protocols',
  'Log body composition data',
  'Set dose reminders',
  'Access research library',
  'Export detailed reports',
];

export function CTASection({ onSignInClick }: CTASectionProps) {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Research?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join PeptidePro for personalized tracking, dose management, and comprehensive research tools.
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={onSignInClick}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity group"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free forever. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

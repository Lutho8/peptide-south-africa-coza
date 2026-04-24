import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    role: 'Online Coach',
    quote:
      'I use Ride The Tide with clients new to peptides. Being able to show them clean, research-backed protocols makes all the difference.',
    initials: 'OC',
  },
  {
    role: 'TRT Patient',
    quote:
      'Finally, a structured way to manage my peptide cycles. The calculator is dead accurate — I don’t second-guess dosing anymore.',
    initials: 'TP',
  },
  {
    role: 'Fitness Coach',
    quote:
      'Tried spreadsheets and notebooks. This is the first tool that actually made my daily routine feel effortless.',
    initials: 'FC',
  },
  {
    role: 'Biohacker',
    quote:
      'Running multiple stacks right now. The protocol templates and reminder system have been game-changers.',
    initials: 'BH',
  },
  {
    role: 'Men’s Health Consultant',
    quote:
      'The Premium monthly Q&A alone is worth the upgrade. Getting expert feedback on protocol stacks has sharpened my recommendations.',
    initials: 'MH',
  },
  {
    role: 'Wellness Practitioner',
    quote:
      'I recommend Ride The Tide to anyone who wants to understand peptides beyond the hype. The research database is exceptional.',
    initials: 'WP',
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-accent/90 py-20 text-primary-foreground md:py-28">
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">
            Testimonials
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Trusted by researchers, biohackers, and coaches worldwide
          </h2>
          <p className="mt-4 text-base text-primary-foreground/80 md:text-lg">
            Real users. Real protocols. Real results.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl bg-background/95 p-6 text-foreground shadow-xl shadow-primary/20 backdrop-blur-sm"
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-accent/30" />

              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <blockquote className="text-sm leading-relaxed text-foreground/85 md:text-[15px]">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">Verified user</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

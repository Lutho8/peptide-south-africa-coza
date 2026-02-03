import { motion } from 'framer-motion';
import { 
  Scale, 
  Zap, 
  Heart, 
  Timer, 
  Brain, 
  Shield, 
  Dna, 
  Activity 
} from 'lucide-react';

const categories = [
  { name: 'Weight Loss', icon: Scale, count: 8, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'Growth Hormone', icon: Zap, count: 15, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { name: 'Healing & Recovery', icon: Heart, count: 12, color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'Anti-Aging', icon: Timer, count: 10, color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'Cognitive', icon: Brain, count: 8, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Immune Support', icon: Shield, count: 6, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { name: 'Longevity', icon: Dna, count: 7, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { name: 'Metabolic', icon: Activity, count: 9, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

export function PeptideCategories() {
  return (
    <section id="categories" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore peptides organized by their primary research applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${category.bg} border border-border/50 rounded-xl p-4 text-left hover:border-accent/50 transition-all group`}
            >
              <category.icon className={`w-8 h-8 ${category.color} mb-3 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count} peptides</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

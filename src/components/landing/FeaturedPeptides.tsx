import { motion } from 'framer-motion';
import { Shield, Sparkles, Activity, Scale } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const featuredPeptides = [
  {
    name: 'BPC-157',
    category: 'Healing',
    description: 'Body Protection Compound. Research indicates potential for tissue repair, gut healing, and anti-inflammatory effects.',
    icon: Shield,
    status: 'Research',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    name: 'TB-500',
    category: 'Healing',
    description: 'Thymosin Beta-4. Studies suggest roles in wound healing, tissue regeneration, and recovery enhancement.',
    icon: Activity,
    status: 'Research',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Semaglutide',
    category: 'Weight Loss',
    description: 'GLP-1 receptor agonist. FDA-approved for weight management and type 2 diabetes treatment.',
    icon: Scale,
    status: 'FDA Approved',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Tirzepatide',
    category: 'Weight Loss',
    description: 'Dual GIP and GLP-1 receptor agonist. FDA-approved for diabetes and weight management.',
    icon: Sparkles,
    status: 'FDA Approved',
    gradient: 'from-orange-500 to-red-600',
  },
];

export function FeaturedPeptides() {
  return (
    <section id="browse" className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Peptides</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our most researched peptides with comprehensive scientific data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {featuredPeptides.map((peptide, index) => (
            <motion.div
              key={peptide.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-accent/50 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${peptide.gradient}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${peptide.gradient} flex items-center justify-center`}>
                        <peptide.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{peptide.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{peptide.category}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={peptide.status === 'FDA Approved' ? 'default' : 'secondary'}
                      className={peptide.status === 'FDA Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                    >
                      {peptide.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {peptide.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

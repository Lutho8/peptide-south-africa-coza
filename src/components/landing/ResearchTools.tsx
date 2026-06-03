import { motion } from 'framer-motion';
import { FlaskConical, Calculator, HelpCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ResearchToolsProps {
  onBlendsClick?: () => void;
  onQuizClick?: () => void;
  onSearchClick?: () => void;
  onStackClick?: () => void;
  onCalculatorClick?: () => void;
}

export function ResearchTools({ onBlendsClick, onQuizClick, onSearchClick, onCalculatorClick }: ResearchToolsProps) {
  const tools = [
    {
      icon: Search,
      title: 'Browse',
      description: 'Predictive search across our peptide and blend database — instant results as you type.',
      color: 'from-cyan-500 to-teal-500',
      onClick: onSearchClick,
    },
    {
      icon: FlaskConical,
      title: 'Blends & Stacks',
      description: 'Pre-formulated blends and a builder for your own stacks with full compatibility analysis.',
      color: 'from-purple-500 to-pink-500',
      onClick: onBlendsClick,
    },
    {
      icon: Calculator,
      title: 'Calculator',
      description: 'Reconstitution and dosing calculator with multiple syringe types.',
      color: 'from-green-500 to-emerald-500',
      onClick: onCalculatorClick,
    },
    {
      icon: HelpCircle,
      title: 'Peptide Quiz',
      description: 'Guided questionnaire to find your ideal peptide for research.',
      color: 'from-orange-500 to-amber-500',
      onClick: onQuizClick,
    },
  ];

  return (
    <section id="tools" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to enhance your peptide research and decision-making process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="h-full group hover:border-accent/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm"
                onClick={tool.onClick}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

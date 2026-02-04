import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: 'Complete Guide to GLP-1 Agonists: Semaglutide vs Tirzepatide',
    excerpt: 'A comprehensive comparison of the two most popular weight loss peptides, their mechanisms, dosing protocols, and clinical outcomes.',
    category: 'Weight Loss',
    author: 'Dr. Research Team',
    date: '2025-01-15',
    readTime: '12 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'BPC-157 and TB-500: The Ultimate Healing Stack',
    excerpt: 'Explore the synergistic effects of combining these two powerful healing peptides for accelerated tissue repair and recovery.',
    category: 'Healing',
    author: 'Peptide Research Lab',
    date: '2025-01-10',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Understanding Growth Hormone Secretagogues',
    excerpt: 'Deep dive into Ipamorelin, CJC-1295, and other GH-releasing peptides - mechanisms, benefits, and optimal protocols.',
    category: 'Growth Hormone',
    author: 'Dr. Research Team',
    date: '2025-01-05',
    readTime: '15 min read',
  },
  {
    id: 4,
    title: 'Telomere Extension with Epitalon: The Science',
    excerpt: 'Review of clinical evidence for Epitalon\'s telomerase activation and its implications for longevity research.',
    category: 'Anti-Aging',
    author: 'Longevity Institute',
    date: '2024-12-28',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'Reconstitution Best Practices: A Complete Guide',
    excerpt: 'Step-by-step instructions for properly reconstituting peptides, storage guidelines, and common mistakes to avoid.',
    category: 'Education',
    author: 'Peptide Research Lab',
    date: '2024-12-20',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Cognitive Enhancement with Semax and Selank',
    excerpt: 'Exploring nootropic peptides for focus, memory, and neuroprotection - what the research shows.',
    category: 'Cognitive',
    author: 'Neuro Research Team',
    date: '2024-12-15',
    readTime: '9 min read',
  },
  {
    id: 7,
    title: 'Thymosin Alpha-1: Immune System Optimization',
    excerpt: 'How this naturally occurring thymic peptide modulates immune function and supports overall health.',
    category: 'Immune',
    author: 'Immunology Insights',
    date: '2024-12-10',
    readTime: '7 min read',
  },
  {
    id: 8,
    title: 'Melanotan II Research: Beyond Tanning',
    excerpt: 'Understanding melanocortin receptor agonists, their mechanisms, and the full spectrum of MT-2 effects.',
    category: 'Skin & Hair',
    author: 'Dermatology Research',
    date: '2024-12-05',
    readTime: '8 min read',
  },
  {
    id: 9,
    title: 'GHK-Cu: The Copper Peptide Revolution',
    excerpt: 'How this tripeptide-copper complex promotes collagen synthesis, wound healing, and anti-aging effects.',
    category: 'Skin & Hair',
    author: 'Aesthetic Science',
    date: '2024-11-28',
    readTime: '6 min read',
  },
  {
    id: 10,
    title: 'DSIP: Delta Sleep Inducing Peptide Research',
    excerpt: 'Exploring the neuropeptide that promotes natural sleep patterns and recovery enhancement.',
    category: 'Cognitive',
    author: 'Sleep Research Lab',
    date: '2024-11-20',
    readTime: '7 min read',
  },
  {
    id: 11,
    title: 'Peptide Stacking: Synergy and Safety Protocols',
    excerpt: 'How to combine peptides effectively, understanding half-lives, timing, and avoiding negative interactions.',
    category: 'Education',
    author: 'Stack Protocols',
    date: '2024-11-15',
    readTime: '14 min read',
  },
  {
    id: 12,
    title: 'PT-141 (Bremelanotide): Mechanism and Research',
    excerpt: 'Understanding the melanocortin-based peptide for libido and its unique central nervous system effects.',
    category: 'Hormonal',
    author: 'Hormonal Research',
    date: '2024-11-10',
    readTime: '8 min read',
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Weight Loss': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Healing': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Growth Hormone': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Anti-Aging': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Education': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Cognitive': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Immune': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Skin & Hair': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Hormonal': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };
  return colors[category] || 'bg-secondary text-secondary-foreground';
};

export function BlogSection() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section id="blog" className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-secondary/10 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Research & Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest peptide research, protocols, and scientific discoveries.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="overflow-hidden group hover:border-accent/50 transition-all duration-300 cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-8 flex items-center justify-center min-h-[200px]">
                  <div className="text-6xl opacity-50">📊</div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                      Featured
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(featuredPost.category)}>
                      {featuredPost.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-sm mb-4 line-clamp-2">
                    {featuredPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {regularPosts.slice(0, 6).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-accent/50 transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className={`w-fit ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" className="group">
            View All Articles
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

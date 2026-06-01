import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

const CATEGORY_COLORS: Record<string, string> = {
  'Science & Research': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Safety & Best Practices': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Protocols': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Peptide Profiles': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'Peptide Science': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Peptide Basics': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'Clinical Research': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'Tools & Calculators': 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  'Research': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'recovery': 'bg-red-500/15 text-red-300 border-red-500/30',
  'metabolic': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'longevity': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'performance': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
};

const getCategoryColor = (c: string) =>
  CATEGORY_COLORS[c] || 'bg-secondary text-secondary-foreground border-border';

const formatDate = (iso: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

const PAGE = 9;

export function BlogSection() {
  const featured = useMemo(() => blogPosts.filter(p => p.featured).slice(0, 3), []);
  const rest = useMemo(() => blogPosts.filter(p => !p.featured), []);
  const [visible, setVisible] = useState(PAGE);

  return (
    <section id="blogs" className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-secondary/10 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/30">
            Blogs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Latest peptide research, distilled
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {blogPosts.length}+ articles on protocols, safety, clinical data, and peptide science — curated by the Peptiq research team.
          </p>
        </motion.div>

        {/* Featured row */}
        {featured.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featured.map((post, i) => (
              <motion.a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group block"
              >
                <Card className="h-full overflow-hidden hover:border-primary/40 transition-all duration-300">
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden bg-secondary/40">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-accent/15 text-accent border-accent/30">Featured</Badge>
                      <Badge variant="outline" className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-3 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rest.slice(0, visible).map((post, i) => (
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % PAGE) * 0.05 }}
              className="group block"
            >
              <Card className="h-full hover:border-primary/40 transition-all duration-300">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className={`w-fit ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </Badge>
                  <CardTitle className="text-base md:text-lg mt-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {visible < rest.length && (
            <Button variant="outline" onClick={() => setVisible(v => v + PAGE)} className="group">
              Load more
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
          <a href="https://peptiq.io/blog" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
              Browse all on Peptiq <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

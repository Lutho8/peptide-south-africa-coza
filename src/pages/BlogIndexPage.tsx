import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEOHead } from '@/components/seo/SEOHead';
import { buildBreadcrumbSchema } from '@/components/seo/JsonLd';
import { blogPosts } from '@/data/blogPosts';

const PAGE = 12;

const formatDate = (iso: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

export default function BlogIndexPage() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map(p => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter(p => {
      if (activeCat && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Ride The Tide Blog',
    url: 'https://ridethetide.info/blog',
    description: 'Peptide research, protocols, safety guidance, and clinical evidence.',
    blogPost: blogPosts.slice(0, 20).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://ridethetide.info/blog/${p.slug}`,
      datePublished: p.date,
      image: p.image,
    })),
  };

  return (
    <>
      <SEOHead
        title={`Peptide Research Blog — ${blogPosts.length}+ articles | Ride The Tide`}
        description="Evidence-based peptide research, protocols, safety, and clinical guidance. Browse 150+ articles on BPC-157, retatrutide, tirzepatide, ipamorelin, and more."
        canonical="https://ridethetide.info/blog"
        ogType="website"
        keywords="peptide research, peptide protocols, BPC-157, retatrutide, tirzepatide, peptide safety, peptide blog"
        jsonLd={[
          blogSchema,
          buildBreadcrumbSchema([
            { name: 'Home', url: 'https://ridethetide.info/' },
            { name: 'Blog', url: 'https://ridethetide.info/blog' },
          ]),
        ]}
      />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to home
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Badge variant="outline" className="mb-3 bg-primary/10 text-primary border-primary/30">Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Peptide Research & Protocols</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {blogPosts.length} articles on protocols, safety, clinical data, and peptide science.
            </p>
          </motion.div>

          {/* Search + categories */}
          <div className="mt-8 space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisible(PAGE); }}
                placeholder="Search articles…"
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={activeCat === null ? 'default' : 'outline'}
                onClick={() => { setActiveCat(null); setVisible(PAGE); }}
              >
                All ({blogPosts.length})
              </Button>
              {categories.map(cat => {
                const count = blogPosts.filter(p => p.category === cat).length;
                return (
                  <Button
                    key={cat}
                    size="sm"
                    variant={activeCat === cat ? 'default' : 'outline'}
                    onClick={() => { setActiveCat(cat); setVisible(PAGE); }}
                  >
                    {cat} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="mt-12 text-center text-muted-foreground">No articles match your search.</p>
          ) : (
            <>
              <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(0, visible).map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (i % PAGE) * 0.04 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block h-full">
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
                          <Badge variant="outline" className="w-fit text-xs">{post.category}</Badge>
                          <CardTitle className="text-base md:text-lg mt-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.date)}</span>
                            {post.readTime && <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-10 text-center">
                  <Button variant="outline" onClick={() => setVisible(v => v + PAGE)}>
                    Load more ({filtered.length - visible} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

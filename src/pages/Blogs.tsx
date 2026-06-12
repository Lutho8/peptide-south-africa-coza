import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronDown } from 'lucide-react';

const categories = ['All', 'Weight Loss', 'Longevity', 'Recovery', 'Science'];

const blogPosts = [
  {
    slug: 'peptides-for-weight-loss-in-women',
    title: 'Peptides for Weight Loss in Women',
    excerpt: 'Discover how peptide therapy can support sustainable weight loss in women by targeting metabolic pathways, reducing appetite, and preserving lean muscle mass during caloric restriction.',
    category: 'Weight Loss',
    date: 'Mar 15, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'microdosing-semaglutide-smarter-approach',
    title: 'Microdosing Semaglutide: A Smarter Approach',
    excerpt: 'Learn why microdosing semaglutide is gaining traction among clinicians and patients alike for minimizing side effects while maintaining consistent weight loss outcomes.',
    category: 'Weight Loss',
    date: 'Mar 10, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'sermorelin-dosage-for-muscle-growth',
    title: 'Sermorelin Dosage for Muscle Growth',
    excerpt: 'Explore the optimal dosing protocols for sermorelin to maximize lean muscle gains, improve recovery, and support healthy growth hormone levels naturally.',
    category: 'Longevity',
    date: 'Feb 28, 2024',
    readTime: '7 min read',
  },
  {
    slug: 'nad-injections-vs-oral-pills',
    title: 'NAD Injections vs Oral Pills',
    excerpt: 'We break down the bioavailability differences between NAD+ injections and oral supplements, helping you understand which delivery method offers the best cellular rejuvenation.',
    category: 'Science',
    date: 'Feb 20, 2024',
    readTime: '8 min read',
  },
  {
    slug: 'what-are-glutathione-injections',
    title: 'What Are Glutathione Injections?',
    excerpt: 'Your complete guide to glutathione injections: what they are, how they support detoxification and immune health, and what to expect from a treatment protocol.',
    category: 'Recovery',
    date: 'Feb 14, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'compounded-tirzepatide-explained',
    title: 'Compounded Tirzepatide Explained',
    excerpt: 'Everything you need to know about compounded tirzepatide: how it works as a dual GLP-1/GIP agonist, its benefits, and how it compares to other weight-loss peptides.',
    category: 'Weight Loss',
    date: 'Feb 8, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'compounded-semaglutide-guide',
    title: 'Compounded Semaglutide Guide',
    excerpt: 'A comprehensive guide to compounded semaglutide: dosing strategies, administration tips, expected results, and how physician oversight ensures safe and effective treatment.',
    category: 'Weight Loss',
    date: 'Jan 30, 2024',
    readTime: '7 min read',
  },
  {
    slug: 'sermorelin-prescription-what-to-know',
    title: 'Sermorelin Prescription: What to Know',
    excerpt: 'Before starting sermorelin, here is what you should know about the prescription process, eligibility criteria, and how to prepare for your physician consultation.',
    category: 'Longevity',
    date: 'Jan 22, 2024',
    readTime: '5 min read',
  },
  {
    slug: 'nad-injection-benefits',
    title: 'NAD Injection Benefits',
    excerpt: 'From enhanced energy and cognitive clarity to DNA repair and anti-aging effects, discover the full spectrum of benefits NAD+ injections can offer.',
    category: 'Longevity',
    date: 'Jan 15, 2024',
    readTime: '6 min read',
  },
  {
    slug: 'best-time-to-take-glutathione',
    title: 'Best Time to Take Glutathione',
    excerpt: 'Timing matters. Learn the optimal time to administer glutathione for maximum antioxidant absorption, detox support, and overall wellness benefits.',
    category: 'Recovery',
    date: 'Jan 8, 2024',
    readTime: '4 min read',
  },
  {
    slug: 'microdosing-tirzepatide',
    title: 'Microdosing Tirzepatide',
    excerpt: 'Microdosing tirzepatide may offer a gentler entry point into GLP-1/GIP therapy. We explore the science, dosing protocols, and who might benefit most.',
    category: 'Weight Loss',
    date: 'Dec 28, 2023',
    readTime: '5 min read',
  },
];

const categoryColors: Record<string, string> = {
  'Weight Loss': 'bg-purple-100 text-purple-700',
  'Longevity': 'bg-emerald-100 text-emerald-700',
  'Recovery': 'bg-red-100 text-red-700',
  'Science': 'bg-blue-100 text-blue-700',
};

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">Get Your Dose of Science</h1>
            <p className="text-lg md:text-xl text-primary-100 leading-relaxed">Expert Insights on Health, Wellness & Peptides</p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-dark-100 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visible.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/blogs/${post.slug}`} className="group block bg-white rounded-2xl border border-dark-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Image placeholder */}
                  <div className="aspect-video w-full bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-dark-100 text-dark-700'}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark-500 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center"
            >
              <button
                onClick={() => setVisibleCount((c) => c + 3)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                Load More
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

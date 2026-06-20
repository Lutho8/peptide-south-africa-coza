import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowLeft, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { blogImages } from '../lib/assets';

const blogDatabase: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  template: 'weight-loss' | 'longevity' | 'recovery' | 'science';
  image: string;
}> = {
  'peptides-for-weight-loss-in-women': {
    title: 'Peptides for Weight Loss in Women',
    category: 'Weight Loss',
    date: 'Mar 15, 2024',
    readTime: '6 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'weight-loss',
    image: blogImages.peptidesWeightLossWomen,
  },
  'microdosing-semaglutide-smarter-approach': {
    title: 'Microdosing Semaglutide: A Smarter Approach',
    category: 'Weight Loss',
    date: 'Mar 10, 2024',
    readTime: '5 min read',
    author: 'Dr. James Molefe',
    template: 'weight-loss',
    image: blogImages.microdosingSemaglutide,
  },
  'sermorelin-dosage-for-muscle-growth': {
    title: 'Sermorelin Dosage for Muscle Growth',
    category: 'Longevity',
    date: 'Feb 28, 2024',
    readTime: '7 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'longevity',
    image: blogImages.sermorelinDosage,
  },
  'nad-injections-vs-oral-pills': {
    title: 'NAD Injections vs Oral Pills',
    category: 'Science',
    date: 'Feb 20, 2024',
    readTime: '8 min read',
    author: 'Dr. James Molefe',
    template: 'science',
    image: blogImages.nadInjectionsVsPills,
  },
  'what-are-glutathione-injections': {
    title: 'What Are Glutathione Injections?',
    category: 'Recovery',
    date: 'Feb 14, 2024',
    readTime: '5 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'recovery',
    image: blogImages.glutathioneInjections,
  },
  'compounded-tirzepatide-explained': {
    title: 'Compounded Tirzepatide Explained',
    category: 'Weight Loss',
    date: 'Feb 8, 2024',
    readTime: '6 min read',
    author: 'Dr. James Molefe',
    template: 'weight-loss',
    image: blogImages.compoundedTirzepatide,
  },
  'compounded-semaglutide-guide': {
    title: 'Compounded Semaglutide Guide',
    category: 'Weight Loss',
    date: 'Jan 30, 2024',
    readTime: '7 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'weight-loss',
    image: blogImages.compoundedSemaglutide,
  },
  'sermorelin-prescription-what-to-know': {
    title: 'Sermorelin Prescription: What to Know',
    category: 'Longevity',
    date: 'Jan 22, 2024',
    readTime: '5 min read',
    author: 'Dr. James Molefe',
    template: 'longevity',
    image: blogImages.sermorelinPrescription,
  },
  'nad-injection-benefits': {
    title: 'NAD Injection Benefits',
    category: 'Longevity',
    date: 'Jan 15, 2024',
    readTime: '6 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'longevity',
    image: blogImages.nadInjectionBenefits,
  },
  'best-time-to-take-glutathione': {
    title: 'Best Time to Take Glutathione',
    category: 'Recovery',
    date: 'Jan 8, 2024',
    readTime: '4 min read',
    author: 'Dr. James Molefe',
    template: 'recovery',
    image: blogImages.glutathioneTiming,
  },
  'microdosing-tirzepatide': {
    title: 'Microdosing Tirzepatide',
    category: 'Weight Loss',
    date: 'Dec 28, 2023',
    readTime: '5 min read',
    author: 'Dr. Sarah Nkosi',
    template: 'weight-loss',
    image: blogImages.microdosingTirzepatide,
  },
};

const categoryColors: Record<string, string> = {
  'Weight Loss': 'bg-purple-100 text-purple-700',
  'Longevity': 'bg-emerald-100 text-emerald-700',
  'Recovery': 'bg-red-100 text-red-700',
  'Science': 'bg-blue-100 text-blue-700',
};

function WeightLossTemplate({ image }: { image: string }) {
  return (
    <>
      <h2>Understanding the Science</h2>
      <p>
        Peptide-based weight loss therapies have transformed the landscape of metabolic health. By targeting specific hormone receptors—most notably GLP-1 and GIP receptors—these compounds help regulate appetite, slow gastric emptying, and improve insulin sensitivity in ways that traditional diet and exercise alone cannot achieve.
      </p>
      <p>
        For women, the benefits extend beyond the scale. Many peptide protocols help preserve lean muscle mass during caloric restriction, support hormonal balance, and reduce visceral fat that is linked to cardiovascular and metabolic disease.
      </p>

      <img src={image} alt="Weight Loss" className="my-8 aspect-video rounded-xl object-cover w-full" loading="lazy" />

      <h2>Why Women Respond Differently</h2>
      <p>
        Female physiology involves unique hormonal cycles, body composition patterns, and metabolic demands. Research suggests that women may experience more pronounced improvements in body fat percentage with peptide therapy compared to men, particularly when protocols are customized to individual hormonal profiles.
      </p>
      <ul>
        <li>Greater preservation of lean muscle during weight loss</li>
        <li>Reduced cravings and emotional eating patterns</li>
        <li>Improved energy levels and metabolic flexibility</li>
        <li>Support for post-menopausal weight management</li>
      </ul>

      <blockquote>
        "The most successful outcomes we see are when patients pair peptide therapy with sustainable lifestyle changes—not as a shortcut, but as a catalyst."
      </blockquote>

      <h2>Getting Started Safely</h2>
      <p>
        Every patient at Peptide South Africa begins with a comprehensive physician consultation. We review your medical history, current medications, and goals to design a protocol that is both safe and effective. All peptide therapies are prescribed and supervised by licensed South African physicians, with ongoing monitoring to ensure optimal outcomes.
      </p>
    </>
  );
}

function LongevityTemplate({ image }: { image: string }) {
  return (
    <>
      <h2>The Biology of Aging</h2>
      <p>
        Aging is not simply the passage of time—it is a biological process driven by cellular decline, DNA damage, mitochondrial dysfunction, and declining hormone levels. Peptide therapies target these root mechanisms, offering a proactive approach to extending healthspan, not just lifespan.
      </p>
      <p>
        Growth hormone secretagogues like sermorelin work by stimulating your pituitary gland to release its own growth hormone naturally. This avoids the risks of exogenous hormone replacement while supporting tissue repair, muscle maintenance, cognitive clarity, and metabolic health.
      </p>

      <img src={image} alt="Longevity" className="my-8 aspect-video rounded-xl object-cover w-full" loading="lazy" />

      <h2>Clinical Benefits</h2>
      <ul>
        <li>Improved sleep quality and recovery</li>
        <li>Enhanced skin elasticity and collagen production</li>
        <li>Increased bone density and joint health</li>
        <li>Better cognitive function and mental clarity</li>
        <li>Support for cardiovascular health markers</li>
      </ul>

      <blockquote>
        "Longevity medicine is about optimizing function at every age. The goal is not to live forever, but to feel vital for as long as possible."
      </blockquote>

      <h2>Your Personalized Protocol</h2>
      <p>
        At Peptide South Africa, longevity protocols are tailored to your biomarkers, lifestyle, and goals. We combine peptide therapy with nutritional guidance, exercise recommendations, and regular follow-ups to track progress and adjust dosing as needed.
      </p>
    </>
  );
}

function RecoveryTemplate({ image }: { image: string }) {
  return (
    <>
      <h2>The Role of Glutathione in Recovery</h2>
      <p>
        Glutathione is often called the body's "master antioxidant." It plays a central role in neutralizing free radicals, detoxifying the liver, and supporting immune function. For athletes, busy professionals, and anyone recovering from illness or stress, glutathione injections can accelerate recovery and restore vitality.
      </p>
      <p>
        Unlike oral supplements, which are broken down by digestive enzymes, injectable glutathione delivers the compound directly into your bloodstream for maximum bioavailability and rapid cellular uptake.
      </p>

      <img src={image} alt="Recovery" className="my-8 aspect-video rounded-xl object-cover w-full" loading="lazy" />

      <h2>Who Benefits Most?</h2>
      <ul>
        <li>High-intensity athletes seeking faster recovery</li>
        <li>Individuals with high oxidative stress or inflammation</li>
        <li>Those recovering from surgery or illness</li>
        <li>People with compromised immune function</li>
        <li>Anyone looking to optimize detoxification pathways</li>
      </ul>

      <h2>Administration and Timing</h2>
      <p>
        For best results, glutathione is typically administered in the morning on an empty stomach or as directed by your supervising physician. Consistency matters—many patients report noticeable improvements in energy, clarity, and recovery within 2–4 weeks of starting a regular protocol.
      </p>

      <blockquote>
        "Recovery is where the real gains happen. Glutathione gives your cells the tools they need to repair and rebuild."
      </blockquote>
    </>
  );
}

function ScienceTemplate({ image }: { image: string }) {
  return (
    <>
      <h2>Bioavailability: The Key Difference</h2>
      <p>
        When it comes to NAD+ supplementation, the delivery method determines the outcome. Oral NAD+ precursors like NMN and NR must pass through the digestive system and liver before reaching circulation, a process that significantly reduces their potency. Direct NAD+ injections bypass this entirely.
      </p>
      <p>
        Studies have shown that intravenous and subcutaneous NAD+ administration achieves serum concentrations orders of magnitude higher than oral equivalents, leading to more pronounced effects on cellular energy, DNA repair, and sirtuin activation.
      </p>

      <img src={image} alt="Science" className="my-8 aspect-video rounded-xl object-cover w-full" loading="lazy" />

      <h2>What the Research Says</h2>
      <ul>
        <li>Injections raise NAD+ levels rapidly and sustainably</li>
        <li>Oral pills require higher doses for comparable effects</li>
        <li>First-pass liver metabolism reduces oral bioavailability by up to 90%</li>
        <li>Subcutaneous injections offer a practical balance of efficacy and convenience</li>
      </ul>

      <h2>Practical Considerations</h2>
      <p>
        While injections are more effective, they are not for everyone. Some patients prefer oral supplements for convenience or cost reasons. At Peptide South Africa, our physicians help you weigh the evidence against your lifestyle, goals, and budget to make an informed choice.
      </p>

      <blockquote>
        "Science should guide your choices, but your individual needs should shape your protocol."
      </blockquote>
    </>
  );
}

function ArticleContent({ template, image }: { template: string; image: string }) {
  switch (template) {
    case 'weight-loss': return <WeightLossTemplate image={image} />;
    case 'longevity': return <LongevityTemplate image={image} />;
    case 'recovery': return <RecoveryTemplate image={image} />;
    case 'science': return <ScienceTemplate image={image} />;
    default: return <WeightLossTemplate image={image} />;
  }
}

const relatedSlugs = [
  'nad-injection-benefits',
  'compounded-semaglutide-guide',
  'what-are-glutathione-injections',
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogDatabase[slug] : undefined;

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Article Not Found</h1>
          <p className="text-dark-500 mb-6">The blog post you are looking for does not exist.</p>
          <Link to="/blogs" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const related = relatedSlugs
    .filter((s) => s !== slug && blogDatabase[s])
    .slice(0, 3)
    .map((s) => ({ slug: s, ...blogDatabase[s] }));

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="h-64 md:h-80 lg:h-96 w-full object-cover"
          loading="lazy"
        />
        <div className="container-main -mt-16 md:-mt-20 lg:-mt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-dark-100 shadow-lg p-6 md:p-8 lg:p-10"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || 'bg-dark-100 text-dark-700'}`}>
                {post.category}
              </span>
              <span className="text-xs text-dark-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="text-xs text-dark-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-3 leading-tight">{post.title}</h1>
            <p className="text-sm text-dark-500">By <span className="font-medium text-dark-700">{post.author}</span></p>
          </motion.div>
        </div>
      </section>

      {/* Article */}
      <section className="section-padding-sm">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-dark-900 prose-p:text-dark-500 prose-p:leading-relaxed prose-li:text-dark-500 prose-ul:my-4 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-dark-700 prose-blockquote:font-medium"
            >
              <ArticleContent template={post.template} image={post.image} />
            </motion.div>

            {/* Social Share */}
            <div className="mt-10 pt-8 border-t border-dark-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-dark-700">Share:</span>
                <button className="w-9 h-9 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-dark-50 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
            <p className="text-primary-100 mb-6">Get the latest peptide science, wellness tips, and exclusive offers delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="input-field flex-1 text-dark-900" />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-dark-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r, idx) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link to={`/blogs/${r.slug}`} className="group block bg-white rounded-2xl border border-dark-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-video w-full relative overflow-hidden">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[r.category] || 'bg-dark-100 text-dark-700'}`}>
                      {r.category}
                    </span>
                    <h3 className="font-bold text-dark-900 group-hover:text-primary-700 transition-colors line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/blogs" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

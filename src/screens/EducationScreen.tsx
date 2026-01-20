import { useState } from 'react';
import { GradientCard } from '@/components/ui/GradientCard';
import { 
  BookOpen, Shield, Syringe, Layers, FlaskConical, 
  Activity, ExternalLink, ChevronDown, ChevronUp, Scale
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EducationSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const educationSections: EducationSection[] = [
  {
    id: 'basics',
    title: 'Peptide Basics',
    icon: BookOpen,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Peptides are short chains of amino acids (typically 2-50) linked by peptide bonds. 
          They act as signaling molecules in the body, influencing various biological processes.
        </p>
        <h4 className="text-foreground font-medium">Key Concepts:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Smaller than proteins, more targeted in action</li>
          <li>Can cross cell membranes more easily</li>
          <li>Mimic natural hormones and growth factors</li>
          <li>Generally have fewer side effects than full proteins</li>
        </ul>
        <h4 className="text-foreground font-medium">Common Types:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Growth Hormone Secretagogues:</strong> Stimulate natural GH release</li>
          <li><strong>Healing Peptides:</strong> Accelerate tissue repair</li>
          <li><strong>Immune Modulators:</strong> Optimize immune function</li>
          <li><strong>Metabolic Peptides:</strong> Enhance fat burning and insulin sensitivity</li>
        </ul>
      </div>
    )
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    icon: Shield,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 font-medium">Critical Safety Rules:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-red-300/80">
            <li>Start with lowest effective dose</li>
            <li>Never share needles or vials</li>
            <li>Monitor bloodwork every 8-12 weeks</li>
            <li>Stop immediately if adverse reactions occur</li>
          </ul>
        </div>
        <h4 className="text-foreground font-medium">Bloodwork Markers to Monitor:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>IGF-1, GH levels (for GH-related peptides)</li>
          <li>Fasting glucose, HbA1c (metabolic peptides)</li>
          <li>Complete blood count (immune peptides)</li>
          <li>Liver and kidney function panels</li>
          <li>Lipid panel and inflammatory markers</li>
        </ul>
      </div>
    )
  },
  {
    id: 'administration',
    title: 'Administration Guide',
    icon: Syringe,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <h4 className="text-foreground font-medium">Subcutaneous Injection:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Wash hands thoroughly</li>
          <li>Clean injection site with alcohol swab</li>
          <li>Pinch skin and insert needle at 45-90° angle</li>
          <li>Inject slowly and steadily</li>
          <li>Wait 5 seconds before withdrawing needle</li>
          <li>Apply light pressure if bleeding occurs</li>
        </ol>
        <h4 className="text-foreground font-medium">Common Injection Sites:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Abdomen (most common, avoid navel area)</li>
          <li>Front of thighs</li>
          <li>Back of upper arms</li>
        </ul>
        <h4 className="text-foreground font-medium">Intranasal Administration:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Clear nasal passages before use</li>
          <li>Insert spray tip 1cm into nostril</li>
          <li>Spray while inhaling gently</li>
          <li>Alternate nostrils for repeated doses</li>
        </ul>
      </div>
    )
  },
  {
    id: 'categories',
    title: 'Peptide Categories',
    icon: Layers,
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="p-3 rounded-lg category-immune">
          <h4 className="text-white font-medium">Immune Modulators</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: TA1, Thymalin. Optimize immune response, enhance T-cell function.
          </p>
        </div>
        <div className="p-3 rounded-lg category-longevity">
          <h4 className="text-white font-medium">Longevity Peptides</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: Epitalon, SS-31, GHK-Cu. Target aging mechanisms, mitochondria, telomeres.
          </p>
        </div>
        <div className="p-3 rounded-lg category-cognitive">
          <h4 className="text-white font-medium">Cognitive Enhancers</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: Semax, Selank. Improve focus, memory, neuroprotection.
          </p>
        </div>
        <div className="p-3 rounded-lg category-metabolic">
          <h4 className="text-white font-medium">Metabolic Peptides</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: Retatrutide, Tirzepatide. Enhance fat loss, insulin sensitivity.
          </p>
        </div>
        <div className="p-3 rounded-lg category-healing">
          <h4 className="text-white font-medium">Healing Peptides</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: BPC-157, TB-500. Accelerate tissue repair, reduce inflammation.
          </p>
        </div>
        <div className="p-3 rounded-lg category-gh">
          <h4 className="text-white font-medium">GH Secretagogues</h4>
          <p className="text-white/80 text-xs mt-1">
            Examples: Ipamorelin, CJC-1295. Stimulate natural growth hormone release.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'stacking',
    title: 'Stacking Guidelines',
    icon: FlaskConical,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Stacking involves using multiple peptides together for synergistic effects. 
          Proper stacking can enhance results while minimizing side effects.
        </p>
        <h4 className="text-foreground font-medium">Common Stack Combinations:</h4>
        <ul className="space-y-2">
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">GH Stack:</strong> Ipamorelin + CJC-1295 (no DAC)
            <p className="text-xs mt-1">Synergistic GH release, take together before bed</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Healing Stack:</strong> BPC-157 + TB-500
            <p className="text-xs mt-1">Comprehensive tissue repair, systemic and local</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Longevity Stack:</strong> Epitalon + SS-31 + GHK-Cu
            <p className="text-xs mt-1">Multi-pathway anti-aging approach</p>
          </li>
        </ul>
        <h4 className="text-foreground font-medium">Stacking Rules:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Don't combine more than 3-4 peptides simultaneously</li>
          <li>Introduce one new peptide at a time</li>
          <li>Allow 2 weeks between adding new compounds</li>
          <li>Consider half-lives for timing optimization</li>
        </ul>
      </div>
    )
  },
  {
    id: 'bloodwork',
    title: 'Bloodwork Monitoring',
    icon: Activity,
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Regular bloodwork is essential for monitoring safety and optimizing protocols. 
          Test before starting, at 8 weeks, and every 12 weeks thereafter.
        </p>
        <h4 className="text-foreground font-medium">Essential Panels:</h4>
        <ul className="space-y-2">
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Complete Metabolic Panel</strong>
            <p className="text-xs mt-1">Liver enzymes, kidney function, electrolytes</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Complete Blood Count</strong>
            <p className="text-xs mt-1">Red/white blood cells, platelets, hemoglobin</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Hormone Panel</strong>
            <p className="text-xs mt-1">IGF-1, GH, testosterone, thyroid markers</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Lipid Panel</strong>
            <p className="text-xs mt-1">Total cholesterol, LDL, HDL, triglycerides</p>
          </li>
          <li className="p-2 rounded bg-muted/50">
            <strong className="text-foreground">Inflammatory Markers</strong>
            <p className="text-xs mt-1">CRP, ESR, homocysteine</p>
          </li>
        </ul>
      </div>
    )
  }
];

export function EducationScreen() {
  const [openSection, setOpenSection] = useState<string | null>('basics');

  return (
    <div className="pb-24 space-y-6 fade-in">
      <h1 className="text-2xl font-bold text-foreground">Education Hub</h1>

      {/* Educational Sections */}
      <div className="space-y-3">
        {educationSections.map((section) => {
          const Icon = section.icon;
          return (
            <Collapsible
              key={section.id}
              open={openSection === section.id}
              onOpenChange={(open) => setOpenSection(open ? section.id : null)}
            >
              <GradientCard>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                    </div>
                    {openSection === section.id ? (
                      <ChevronUp size={20} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={20} className="text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    {section.content}
                  </div>
                </CollapsibleContent>
              </GradientCard>
            </Collapsible>
          );
        })}
      </div>

      {/* Legal Info */}
      <GradientCard>
        <div className="flex items-center gap-2 mb-3">
          <Scale size={18} className="text-yellow-500" />
          <h3 className="font-semibold text-foreground">Legal & Regulatory</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Peptides discussed in this app are classified as research chemicals in most jurisdictions. 
          They are not approved by the FDA for human use. Laws vary by country and region. 
          It is the user's responsibility to understand and comply with local regulations.
        </p>
      </GradientCard>

      {/* External Resources */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Research Resources</h3>
        <div className="space-y-2">
          {[
            { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/', desc: 'Peer-reviewed research papers' },
            { name: 'Examine.com', url: 'https://examine.com/', desc: 'Evidence-based supplement info' },
            { name: 'Janoshik Analytical', url: 'https://janoshik.com/', desc: 'Third-party purity testing' }
          ].map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <GradientCard hover className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{resource.name}</h4>
                    <p className="text-xs text-muted-foreground">{resource.desc}</p>
                  </div>
                  <ExternalLink size={16} className="text-primary" />
                </div>
              </GradientCard>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

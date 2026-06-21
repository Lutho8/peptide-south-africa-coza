import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { corePeptides } from '@/data/peptides';
import { expandedPeptides } from '@/data/peptidesExpanded';
import { topPeptidesSlugs } from '@/data/entitySlugs';
import { SEOHead } from '@/components/seo/SEOHead';
import { JsonLd, buildCollectionSchema } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { GradientCard } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/badge';

const BASE_URL = 'https://peptide-south-africa.co.za';

export interface GoalPageConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  paragraphs: string[];
  peptideIds: string[];
  badge: string;
  badgeClass: string;
}

const allPeptides = [...corePeptides, ...expandedPeptides];

export default function GoalPage({ config }: { config: GoalPageConfig }) {
  const url = `${BASE_URL}/${config.slug}`;
  const peptides = config.peptideIds
    .map((id) => allPeptides.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const collectionItems = peptides.map((p) => {
    const pSlug = Object.entries(topPeptidesSlugs).find(([, v]) => v === p.id)?.[0];
    return { name: p.name, url: pSlug ? `${BASE_URL}/peptides/${pSlug}` : url };
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={config.title}
        description={config.description}
        canonical={url}
        jsonLd={buildCollectionSchema(config.title, config.description, url, collectionItems)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4 text-sm">
          <ArrowLeft size={16} /> Back to Research Platform
        </Link>

        <Breadcrumbs items={[{ label: config.h1, href: `/${config.slug}` }]} />

        <header className="mb-10">
          <Badge variant="outline" className={`${config.badgeClass} mb-3`}>
            {config.badge}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{config.h1}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{config.tagline}</p>
        </header>

        <section className="prose prose-invert max-w-none mb-10 space-y-4">
          {config.paragraphs.map((para, i) => (
            <p key={i} className="text-foreground/90 leading-relaxed">
              {para}
            </p>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-5">
            Research Peptides for This Goal ({peptides.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peptides.map((p) => {
              const pSlug = Object.entries(topPeptidesSlugs).find(([, v]) => v === p.id)?.[0];
              const CardBody = (
                <GradientCard hover className="p-4 h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    {p.janoshikTested && (
                      <Badge variant="secondary" className="text-xs text-green-400">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                    {p.mechanism.slice(0, 160)}…
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {p.halfLife && <span>Half-life: {p.halfLife}</span>}
                    <span>• {p.administration}</span>
                  </div>
                </GradientCard>
              );
              return pSlug ? (
                <Link key={p.id} to={`/peptides/${pSlug}`}>
                  {CardBody}
                </Link>
              ) : (
                <div key={p.id}>{CardBody}</div>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">Research Guides</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/peptide-storage-reconstitution-guide">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">Storage &amp; Reconstitution Guide →</p>
                <p className="text-xs text-muted-foreground mt-1">How to store lyophilised peptides and reconstitute safely with BAC water.</p>
              </GradientCard>
            </Link>
            <Link to="/bpc-157-dosage-guide-south-africa">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">BPC-157 Dosage Guide →</p>
                <p className="text-xs text-muted-foreground mt-1">Dose tables by goal, half-life, local vs systemic injection and the TB-500 stack.</p>
              </GradientCard>
            </Link>
            <Link to="/bpc-157-vs-tb-500">
              <GradientCard className="p-4 hover:ring-1 hover:ring-primary/40 transition-all cursor-pointer h-full">
                <p className="font-medium text-foreground text-sm">BPC-157 vs TB-500 Comparison →</p>
                <p className="text-xs text-muted-foreground mt-1">Side-by-side mechanism, dosing and use-case comparison.</p>
              </GradientCard>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4">South African Researchers</h2>
          <GradientCard className="p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Peptides are an unscheduled grey area under SAHPRA — they are not approved for human use and are
              sold strictly for research purposes. Always source HPLC-tested material with a verifiable
              Certificate of Analysis, store correctly (lyophilised in the fridge or freezer; reconstituted in the
              fridge for up to 30 days), and review baseline bloodwork before beginning any research protocol.
            </p>
          </GradientCard>
        </section>

        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
          <p>
            <strong>Research Disclaimer:</strong> Information provided for educational and research purposes only.
            Not FDA or SAHPRA approved for human use. Consult a qualified healthcare provider before starting any
            protocol.
          </p>
        </div>
      </div>
    </div>
  );
}

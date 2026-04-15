import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  const jsonLdId = id || `jsonld-${data['@type'] || 'default'}`;
  
  useEffect(() => {
    const existing = document.getElementById(jsonLdId);
    if (existing) existing.remove();
    
    const script = document.createElement('script');
    script.id = jsonLdId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    
    return () => {
      const el = document.getElementById(jsonLdId);
      if (el) el.remove();
    };
  }, [data, jsonLdId]);

  return null;
}

// Reusable schema builders
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ride The Tide',
    url: 'https://peptide-mastery.lovable.app',
    logo: 'https://peptide-mastery.lovable.app/logo-animated.png',
    description: 'Peptide research platform providing protocol tracking, dosage guidance, and biomarker analysis.',
    sameAs: [],
    knowsAbout: [
      'Peptide therapy', 'BPC-157', 'TB-500', 'Retatrutide', 'Tirzepatide',
      'Growth hormone secretagogues', 'Reconstitution', 'Biomarker analysis',
      'Peptide stacking', 'Peptide dosing protocols'
    ]
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ride The Tide – Peptide Research & Protocol Platform',
    url: 'https://peptide-mastery.lovable.app',
    description: 'Research-backed peptide database with protocol tracking, reconstitution calculators, and AI-powered biomarker analysis.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://peptide-mastery.lovable.app/peptides?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function buildHowToSchema(name: string, description: string, steps: Array<{ name: string; text: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text
    }))
  };
}

export function buildPeptideSchema(peptide: {
  name: string;
  slug: string;
  description: string;
  category: string;
  molecularWeight?: string;
  halfLife?: string;
  administration: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalEntity',
    name: peptide.name,
    url: `https://peptide-mastery.lovable.app/peptides/${peptide.slug}`,
    description: peptide.description,
    medicineSystem: 'WesternConventional',
    relevantSpecialty: ['Endocrinology', 'Sports Medicine', 'Anti-Aging Medicine'],
    additionalProperty: [
      peptide.molecularWeight && { '@type': 'PropertyValue', name: 'Molecular Weight', value: peptide.molecularWeight },
      peptide.halfLife && { '@type': 'PropertyValue', name: 'Half-Life', value: peptide.halfLife },
      { '@type': 'PropertyValue', name: 'Administration', value: peptide.administration },
      { '@type': 'PropertyValue', name: 'Category', value: peptide.category },
    ].filter(Boolean)
  };
}

export function buildCollectionSchema(name: string, description: string, url: string, items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    hasPart: items.map(item => ({
      '@type': 'MedicalEntity',
      name: item.name,
      url: item.url
    }))
  };
}

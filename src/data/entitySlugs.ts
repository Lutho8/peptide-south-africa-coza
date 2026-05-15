// Top 15 peptides that get dedicated public pages
// Maps slug → peptide ID from the main database
export const topPeptidesSlugs: Record<string, string> = {
  'bpc-157': 'bpc157',
  'tb-500': 'tb500',
  'retatrutide': 'retatrutide',
  'tirzepatide': 'tirzepatide',
  'ipamorelin': 'ipamorelin',
  'cjc-1295': 'cjc1295',
  'ghk-cu': 'ghkcu',
  'epitalon': 'epitalon',
  'ss-31': 'ss31',
  'semax': 'semax',
  'selank': 'selank',
  'thymosin-alpha-1': 'ta1',
  'pt-141': 'pt141',
  'dsip': 'dsip',
  'semaglutide': 'semaglutide',
};

// Category slug → PeptideCategory mapping
export const categorySlugs: Record<string, string> = {
  'healing': 'healing',
  'weight-loss': 'weight-loss',
  'longevity': 'longevity',
  'cognitive': 'cognitive',
  'immune': 'immune',
  'growth-hormone': 'gh-secretagogue',
  'skin-hair': 'skin-hair',
  'hormonal': 'hormonal',
  'metabolic': 'metabolic',
};

// SEO-optimized meta descriptions per category
export const categoryMeta: Record<string, { title: string; description: string; intro: string }> = {
  'healing': {
    title: 'Healing Peptides – BPC-157, TB-500 & Tissue Repair Protocols',
    description: 'Research-backed healing peptides for tissue repair, injury recovery, and inflammation. Dosing protocols, stacking guides, and safety data for BPC-157, TB-500, and more.',
    intro: 'Healing peptides accelerate tissue repair through angiogenesis, collagen synthesis, and modulation of growth factors. These peptides are among the most researched for musculoskeletal and gastrointestinal recovery.'
  },
  'weight-loss': {
    title: 'Weight Loss Peptides – Retatrutide, Tirzepatide & GLP-1 Agonists',
    description: 'Evidence-based weight loss peptides including GLP-1 receptor agonists. Protocols, dosing, and clinical data for Retatrutide, Tirzepatide, Semaglutide.',
    intro: 'GLP-1 receptor agonists and multi-agonist peptides represent the most significant advancement in metabolic therapy. These peptides work through appetite regulation, insulin sensitization, and metabolic rate enhancement.'
  },
  'longevity': {
    title: 'Longevity Peptides – Epitalon, SS-31 & Anti-Aging Research',
    description: 'Anti-aging and longevity peptides targeting telomeres, mitochondria, and cellular senescence. Research protocols for Epitalon, SS-31, GHK-Cu.',
    intro: 'Longevity peptides target the fundamental mechanisms of aging: telomere maintenance, mitochondrial function, and cellular senescence. Research in this category spans from telomerase activation to mitochondrial membrane stabilization.'
  },
  'cognitive': {
    title: 'Cognitive Peptides – Semax, Selank & Nootropic Protocols',
    description: 'Nootropic peptides for cognitive enhancement, neuroprotection, and focus. Research data on Semax, Selank, Dihexa, and P21.',
    intro: 'Cognitive peptides enhance neuroplasticity, neurotrophic factor expression, and neuroprotection. These compounds are researched for memory enhancement, focus optimization, and neurodegenerative disease prevention.'
  },
  'immune': {
    title: 'Immune Peptides – Thymosin Alpha-1, Thymalin & Immune Support',
    description: 'Immunomodulating peptides for immune optimization. Research protocols for Thymosin Alpha-1, Thymalin, and LL-37.',
    intro: 'Immune-modulating peptides enhance both innate and adaptive immune responses through T-cell activation, dendritic cell maturation, and cytokine modulation. These peptides are among the most clinically validated in the field.'
  },
  'growth-hormone': {
    title: 'GH Secretagogues – Ipamorelin, CJC-1295 Protocols',
    description: 'Growth hormone releasing peptides and secretagogues. Dosing protocols for Ipamorelin, CJC-1295, GHRP-6, and MK-677.',
    intro: 'Growth hormone secretagogues stimulate the pituitary gland to release GH through GHRH receptor or ghrelin receptor activation. Stacking a GHRP with a GHRH analog produces synergistic GH pulses that mimic physiological patterns.'
  },
  'skin-hair': {
    title: 'Skin & Hair Peptides – GHK-Cu, SNAP-8 & Cosmetic Protocols',
    description: 'Peptides for skin rejuvenation, hair growth, and cosmetic applications. Research protocols for GHK-Cu, SNAP-8, and copper peptides.',
    intro: 'Cosmetic peptides promote collagen synthesis, reduce wrinkle depth, and stimulate hair follicle growth through growth factor signaling and extracellular matrix remodeling.'
  },
  'hormonal': {
    title: 'Hormonal Peptides – PT-141, Kisspeptin & Hormone Optimization',
    description: 'Peptides for hormonal optimization including sexual health, fertility, and endocrine support. Research on PT-141, Kisspeptin, and HCG.',
    intro: 'Hormonal peptides modulate the hypothalamic-pituitary-gonadal axis, influencing sexual function, fertility, and endocrine balance through receptor-specific signaling.'
  },
  'metabolic': {
    title: 'Metabolic Peptides – AOD-9604, MOTS-c & Fat Loss Research',
    description: 'Metabolic peptides for fat oxidation, insulin sensitivity, and energy metabolism. Research data on AOD-9604 and MOTS-c.',
    intro: 'Metabolic peptides enhance fat oxidation, insulin sensitivity, and mitochondrial energy production. Unlike GLP-1 agonists which work through appetite suppression, these peptides directly target metabolic pathways.'
  },
};

// Guide page definitions
export const guidePages = {
  'reconstitution': {
    title: 'How to Reconstitute Peptides – Step-by-Step Guide',
    description: 'Complete guide to reconstituting lyophilized peptides with bacteriostatic water. Step-by-step instructions, dosing calculations, and storage requirements.',
    slug: 'reconstitution'
  },
  'injection': {
    title: 'Subcutaneous Injection Guide – Safe Peptide Administration',
    description: 'Safe subcutaneous injection technique for peptides. Injection sites, needle selection, sterile protocol, and post-injection care.',
    slug: 'injection'
  },
  'bloodwork': {
    title: 'Bloodwork Monitoring for Peptide Protocols – Essential Panels',
    description: 'Which blood panels to monitor during peptide use. IGF-1, metabolic panels, inflammatory markers, and optimal testing frequency.',
    slug: 'bloodwork'
  }
};

import { QuizQuestion } from '@/components/course/QuizSection';

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    duration: string;
  }[];
  quiz: {
    title: string;
    questions: QuizQuestion[];
  };
}

export const courseModules: CourseModule[] = [
  {
    id: 'what-are-peptides',
    number: 1,
    title: 'What Peptides Are',
    description: 'Understand the science behind peptides, their structure, and why they are revolutionizing medicine.',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to Peptides — The Building Blocks of Life',
        description: 'Learn what peptides are, how they differ from proteins, and why they play a critical role in human biology. This foundational lesson covers amino acid chains, signaling mechanisms, and the history of peptide research.',
        youtubeId: 'RsfGEbbjlFU',
        duration: '18 min',
      },
      {
        id: '1-2',
        title: 'Amino Acids, Peptide Bonds & Protein Structure',
        description: 'A deep dive into the chemistry of peptide bonds, how amino acids link together, and the structural principles that make peptides biologically active.',
        youtubeId: 'oOya3cFmAMc',
        duration: '50 min',
      },
    ],
    quiz: {
      title: 'Module 1 Knowledge Check',
      questions: [
        {
          question: 'What is a peptide?',
          options: [
            'A type of lipid found in cell membranes',
            'A short chain of amino acids linked by peptide bonds',
            'A carbohydrate used for energy storage',
            'A mineral essential for bone health',
          ],
          correctIndex: 1,
          explanation: 'Peptides are short chains of amino acids (typically 2–50) linked by peptide bonds. They differ from proteins primarily in length.',
        },
        {
          question: 'How do peptides primarily communicate with cells?',
          options: [
            'By altering DNA directly',
            'By binding to specific cell surface receptors',
            'By dissolving in cell membranes',
            'By replacing damaged proteins',
          ],
          correctIndex: 1,
          explanation: 'Peptides act as signaling molecules, binding to specific receptors on cell surfaces to trigger biological responses.',
        },
        {
          question: 'What distinguishes peptides from proteins?',
          options: [
            'Peptides contain lipids while proteins do not',
            'Proteins are shorter chains than peptides',
            'Peptides are generally shorter chains (under ~50 amino acids)',
            'There is no difference',
          ],
          correctIndex: 2,
          explanation: 'The key distinction is length — peptides are typically under 50 amino acids, while proteins are longer and have more complex 3D structures.',
        },
      ],
    },
  },
  {
    id: 'why-they-matter',
    number: 2,
    title: 'Why Peptides Matter in Healthcare',
    description: 'Learn how peptides enhance healing, recovery, metabolism, cognitive function, aesthetics, and longevity.',
    lessons: [
      {
        id: '2-1',
        title: 'BPC-157 & TB-500 — The Healing Peptides',
        description: 'Explore how peptides like BPC-157 and TB-500 accelerate tissue repair, reduce inflammation, and support recovery from injuries and surgeries.',
        youtubeId: 'rERg_96SUXI',
        duration: '15 min',
      },
      {
        id: '2-2',
        title: 'Complete Guide to Peptides for Fat Loss, Muscle & Longevity',
        description: 'Dr. Kyle Gillett MD covers the role of peptides in metabolic optimization, fat loss, muscle building, anti-aging, and lifespan extension including GHRPs and growth hormone secretagogues.',
        youtubeId: 'OQTsicKIajE',
        duration: '58 min',
      },
    ],
    quiz: {
      title: 'Module 2 Knowledge Check',
      questions: [
        {
          question: 'Which peptide is most well-known for gut healing and tissue repair?',
          options: ['CJC-1295', 'BPC-157', 'PT-141', 'Melanotan II'],
          correctIndex: 1,
          explanation: 'BPC-157 (Body Protection Compound) is widely researched for its remarkable tissue repair and gut-healing properties.',
        },
        {
          question: 'What category do growth hormone secretagogues fall under?',
          options: [
            'Neuropeptides',
            'Antimicrobial peptides',
            'Metabolic / anti-aging peptides',
            'Cosmetic peptides',
          ],
          correctIndex: 2,
          explanation: 'Growth hormone secretagogues like Ipamorelin and CJC-1295 are metabolic peptides that stimulate natural GH release for fat loss, muscle growth, and anti-aging benefits.',
        },
        {
          question: 'TB-500 is primarily used for:',
          options: [
            'Weight loss',
            'Cognitive enhancement',
            'Tissue repair and reducing inflammation',
            'Sleep improvement',
          ],
          correctIndex: 2,
          explanation: 'TB-500 (Thymosin Beta-4) promotes tissue repair, reduces inflammation, and supports recovery from musculoskeletal injuries.',
        },
      ],
    },
  },
  {
    id: 'who-are-they-for',
    number: 3,
    title: 'Who Peptides Are For',
    description: 'Find out which patients benefit most from peptide therapy and how to personalize treatments.',
    lessons: [
      {
        id: '3-1',
        title: 'Peptide Therapy — Patient Selection & Clinical Applications',
        description: 'Dr. Craig Koniver discusses therapeutic applications of peptides, who benefits most, and how to personalize treatments for athletes, aging populations, and patients with chronic conditions.',
        youtubeId: 'wRsX_ZkzxvQ',
        duration: '90 min',
      },
    ],
    quiz: {
      title: 'Module 3 Knowledge Check',
      questions: [
        {
          question: 'Which of these is NOT typically an ideal peptide therapy candidate?',
          options: [
            'An athlete recovering from a tendon injury',
            'A patient seeking metabolic optimization',
            'Someone with no health goals or symptoms',
            'An aging patient interested in longevity',
          ],
          correctIndex: 2,
          explanation: 'Peptide therapy is most effective when targeted at specific health goals — recovery, metabolism, cognition, or longevity.',
        },
        {
          question: 'Why is personalization important in peptide therapy?',
          options: [
            'All patients respond identically to peptides',
            'Dosing, stacking, and timing must be tailored to individual goals and biology',
            'Personalization is not important',
            'It only matters for cosmetic peptides',
          ],
          correctIndex: 1,
          explanation: 'Each patient has unique biology, goals, and health history. Personalizing peptide protocols ensures optimal results and minimizes side effects.',
        },
      ],
    },
  },
  {
    id: 'clinical-applications',
    number: 4,
    title: 'Most Common Uses & Clinical Applications',
    description: 'Get a breakdown of the top peptides used in practice today, including GLP-1s, repair & recovery peptides, and neuroprotective peptides.',
    lessons: [
      {
        id: '4-1',
        title: 'GLP-1 Peptides — How Semaglutide & Ozempic Work',
        description: 'Understand GLP-1 receptor agonists like Semaglutide — mechanism of action, pharmacology, clinical evidence, dosing, and patient management.',
        youtubeId: 'ZteQT00cRR0',
        duration: '6 min',
      },
      {
        id: '4-2',
        title: 'Nasal Nootropics: Selank & Semax — Neuropeptides Explained',
        description: 'A doctor explains how neuropeptides Semax and Selank support brain health, cognitive function, anxiety relief, and neuroprotection.',
        youtubeId: '0tqgYLAYzmk',
        duration: '5 min',
      },
    ],
    quiz: {
      title: 'Module 4 Knowledge Check',
      questions: [
        {
          question: 'What is the primary mechanism of GLP-1 receptor agonists?',
          options: [
            'They directly burn fat cells',
            'They mimic incretin hormones to regulate blood sugar and appetite',
            'They block cortisol production',
            'They increase testosterone levels',
          ],
          correctIndex: 1,
          explanation: 'GLP-1 agonists mimic the incretin hormone GLP-1, which regulates blood sugar, slows gastric emptying, and reduces appetite.',
        },
        {
          question: 'Which peptide is known for cognitive enhancement and neuroprotection?',
          options: ['BPC-157', 'Semax', 'Ipamorelin', 'AOD-9604'],
          correctIndex: 1,
          explanation: 'Semax is a synthetic peptide derived from ACTH that enhances BDNF, supports cognitive function, and provides neuroprotective effects.',
        },
        {
          question: 'Semaglutide belongs to which class of peptides?',
          options: [
            'Growth hormone secretagogues',
            'Antimicrobial peptides',
            'GLP-1 receptor agonists',
            'Thymic peptides',
          ],
          correctIndex: 2,
          explanation: 'Semaglutide is a GLP-1 receptor agonist used for type 2 diabetes and weight management.',
        },
      ],
    },
  },
  {
    id: 'practice-benefits',
    number: 5,
    title: 'What Peptides Can Do for Your Patients & Practice',
    description: 'Increase patient results, retention, and revenue with proven peptide-based protocols.',
    lessons: [
      {
        id: '5-1',
        title: 'Profits From Legal OTC Peptides — Building a Peptide Practice',
        description: 'Learn how practitioners are integrating peptide therapy to increase patient outcomes, boost retention rates, and create new revenue streams with safe, legal peptide offerings.',
        youtubeId: '4qoMwdTnd24',
        duration: '45 min',
      },
      {
        id: '5-2',
        title: 'The Secret Power of Peptides — Expert Insights',
        description: 'Peptide expert Ryan Smith shares first-hand knowledge on the current state of peptide therapy, where the industry is heading, and practical applications for practitioners.',
        youtubeId: 'V4GEaDCY8No',
        duration: '60 min',
      },
    ],
    quiz: {
      title: 'Module 5 Knowledge Check',
      questions: [
        {
          question: 'How can peptide therapy improve practice revenue?',
          options: [
            'By replacing all other treatments',
            'By offering a premium, results-driven service that increases retention and referrals',
            'By reducing the number of patients seen',
            'Revenue is not affected by peptide therapy',
          ],
          correctIndex: 1,
          explanation: 'Peptide therapy creates a premium offering that delivers measurable results, leading to higher patient satisfaction, retention, and word-of-mouth referrals.',
        },
        {
          question: 'What is a key benefit of offering peptide therapy in a clinical practice?',
          options: [
            'It requires no training or education',
            'It differentiates the practice and attracts patients seeking cutting-edge treatments',
            'It eliminates the need for other services',
            'It has no regulatory considerations',
          ],
          correctIndex: 1,
          explanation: 'Offering peptide therapy positions a practice at the forefront of regenerative medicine.',
        },
      ],
    },
  },
  {
    id: 'dosing-stacks',
    number: 6,
    title: 'Common Dosing & Treatment Stacks',
    description: 'Step-by-step guidance on how to stack peptides for corrective healing and optimized health outcomes.',
    lessons: [
      {
        id: '6-1',
        title: 'The Exact Starter Stack Protocol — 12-Week Guide',
        description: 'A complete 12-week starter protocol for fat loss, recovery, and performance. Learn how to layer peptides into client programs with specific dosing, timing, and stacking strategies.',
        youtubeId: 'v0pYWVprM28',
        duration: '25 min',
      },
      {
        id: '6-2',
        title: 'How to Reconstitute Peptides — Step by Step Dosing Guide',
        description: 'Master the practical skills of peptide reconstitution, proper dosing calculations, injection techniques, and storage protocols.',
        youtubeId: '1Tadntx7RH8',
        duration: '12 min',
      },
    ],
    quiz: {
      title: 'Module 6 Knowledge Check',
      questions: [
        {
          question: 'What is the "Wolverine Stack"?',
          options: [
            'Semaglutide + Tirzepatide',
            'BPC-157 + TB-500 for accelerated healing',
            'Ipamorelin + CJC-1295 for growth hormone',
            'Semax + Selank for cognition',
          ],
          correctIndex: 1,
          explanation: 'The Wolverine Stack combines BPC-157 and TB-500 for powerful synergistic healing.',
        },
        {
          question: 'Why is cycling important in peptide therapy?',
          options: [
            'It is not important',
            'To prevent receptor desensitization and maintain efficacy',
            'To increase costs for patients',
            'Only for cosmetic peptides',
          ],
          correctIndex: 1,
          explanation: 'Cycling prevents receptor desensitization and ensures sustained therapeutic benefits over time.',
        },
        {
          question: 'What should always be considered before stacking peptides?',
          options: [
            'Only the cost of peptides',
            'Patient goals, potential interactions, contraindications, and proper dosing',
            'The brand of the peptide only',
            'Nothing — all peptides can be safely combined',
          ],
          correctIndex: 1,
          explanation: 'Safe stacking requires careful consideration of patient goals, interactions, contraindications, and appropriate dosing protocols.',
        },
      ],
    },
  },
];

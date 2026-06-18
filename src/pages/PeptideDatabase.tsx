import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Search, FlaskConical, Filter, ArrowRightCircle, Stethoscope, X } from 'lucide-react'
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/pages/AnimatedSection'

const categories = ['All', 'Metabolic', 'Healing & Recovery', 'GH Secretagogue', 'Longevity', 'Cognitive']

const compounds = [
  { id: 'semaglutide', name: 'Semaglutide', category: 'Metabolic', description: 'GLP-1 receptor agonist for weight loss and diabetes.', keyUse: 'Weight loss, metabolic health', evidence: 'Phase 3 RCT' },
  { id: 'tirzepatide', name: 'Tirzepatide', category: 'Metabolic', description: 'Dual GLP-1/GIP agonist with superior weight loss efficacy.', keyUse: 'Weight loss, diabetes', evidence: 'Phase 3 RCT' },
  { id: 'bpc-157', name: 'BPC-157', category: 'Healing & Recovery', description: 'Synthetic pentadecapeptide for tendon, ligament, and gut repair.', keyUse: 'Tendon repair, muscle recovery', evidence: 'Animal studies' },
  { id: 'tb-500', name: 'TB-500', category: 'Healing & Recovery', description: 'Thymosin Beta-4 fragment for cell migration and tissue regeneration.', keyUse: 'Wound healing, recovery', evidence: 'Animal studies' },
  { id: 'cjc-1295-ipamorelin', name: 'CJC-1295 + Ipamorelin', category: 'GH Secretagogue', description: 'Synergistic GH secretagogue stack for body recomposition.', keyUse: 'Muscle growth, recovery, sleep', evidence: 'Phase 1 + community' },
  { id: 'sermorelin', name: 'Sermorelin', category: 'GH Secretagogue', description: 'GHRH analog for natural GH restoration and sleep quality.', keyUse: 'Natural GH restoration, sleep', evidence: 'Limited human data' },
  { id: 'nad', name: 'NAD+', category: 'Longevity', description: 'Cellular energy and DNA repair coenzyme.', keyUse: 'Cellular energy, longevity', evidence: 'Preclinical + community' },
  { id: 'mots-c', name: 'MOTS-C', category: 'Metabolic', description: 'Mitochondrial-derived peptide for AMPK activation and metabolic health.', keyUse: 'Metabolic flexibility, insulin', evidence: 'Preclinical' },
  { id: 'aod-9604', name: 'AOD-9604', category: 'Metabolic', description: 'Targeted fat loss peptide without GH side effects.', keyUse: 'Targeted fat loss', evidence: 'Limited human data' },
  { id: 'tesamorelin', name: 'Tesamorelin', category: 'Metabolic', description: 'GHRH analog for visceral fat reduction.', keyUse: 'Visceral fat reduction', evidence: 'Phase 3 RCT' },
  { id: 'ghk-cu', name: 'GHK-Cu', category: 'Healing & Recovery', description: 'Copper peptide for skin repair and tissue remodeling.', keyUse: 'Skin repair, tissue remodeling', evidence: 'Preclinical + community' },
  { id: 'epitalon', name: 'Epitalon', category: 'Longevity', description: 'Telomerase activator and pineal gland peptide.', keyUse: 'Telomerase, anti-aging', evidence: 'Limited human data' },
  { id: 'glutathione', name: 'Glutathione', category: 'Longevity', description: 'Master antioxidant and detoxification peptide.', keyUse: 'Antioxidant, detoxification', evidence: 'Extensive clinical use' },
  { id: 'dsip', name: 'DSIP', category: 'Cognitive', description: 'Deep sleep and stress recovery peptide.', keyUse: 'Deep sleep, stress recovery', evidence: 'Limited human data' },
  { id: 'retatrutide', name: 'Retatrutide', category: 'Metabolic', description: 'Triple agonist (GLP-1/GIP/GCG) with 24% weight loss in trials.', keyUse: 'Weight loss, metabolic health', evidence: 'Phase 3 RCT' },
]

const stackSuggestions = [
  { goal: 'weight-loss', name: 'Weight Loss Stack', compounds: ['semaglutide', 'mots-c', 'aod-9604'] },
  { goal: 'muscle-recovery', name: 'Recovery Stack', compounds: ['bpc-157', 'tb-500', 'cjc-1295-ipamorelin'] },
  { goal: 'longevity', name: 'Longevity Stack', compounds: ['nad', 'epitalon', 'cjc-1295-ipamorelin'] },
  { goal: 'sports-performance', name: 'Performance Stack', compounds: ['cjc-1295-ipamorelin', 'bpc-157', 'nad'] },
  { goal: 'metabolic-reset', name: 'Metabolic Reset Stack', compounds: ['semaglutide', 'mots-c', 'aod-9604'] },
]

export default function PeptideDatabase() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const filtered = compounds.filter((c) => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const selectedStack = stackSuggestions.find((s) => s.goal === selectedGoal)

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-dark-900">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-950 opacity-90" />
        <div className="container-main relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <FlaskConical className="w-4 h-4" />
              98+ Compounds
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Peptide <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Database</span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 leading-relaxed mb-8">
              Explore our comprehensive database of peptide compounds with clinical research, mechanisms, dosing protocols, and PubMed references. Free for the research community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment" className="btn-primary">
                Get Your Personalized Protocol
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-dark-100">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search compounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-dark-400" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              <Filter className="w-4 h-4 text-dark-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-50 text-dark-600 hover:bg-dark-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compounds Grid */}
      <section className="section-padding bg-dark-50">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StaggerContainer staggerDelay={0.08} className="contents">
              {filtered.map((c) => (
                <StaggerItem key={c.id}>
                  <Link to={`/peptides/${c.id}`} className="card-hover p-6 block h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">{c.category}</span>
                      <span className="text-xs text-dark-400">{c.evidence}</span>
                    </div>
                    <h3 className="text-lg font-bold text-dark-900 mb-2">{c.name}</h3>
                    <p className="text-sm text-dark-500 mb-3">{c.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-dark-100">
                      <span className="text-xs text-dark-400">Key use: {c.keyUse}</span>
                      <ArrowRightCircle className="w-5 h-5 text-primary-600" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-500">No compounds match your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stack Builder */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="text-center mb-10">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Stack Builder</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mt-2 mb-4">Build Your Protocol</h2>
            <p className="text-dark-500 max-w-2xl mx-auto">Select your goal to see a suggested base stack. Your physician will personalize this based on your health profile.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-5 gap-3 mb-8">
            {stackSuggestions.map((s) => (
              <button
                key={s.goal}
                onClick={() => setSelectedGoal(selectedGoal === s.goal ? null : s.goal)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedGoal === s.goal
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-dark-50 text-dark-700 hover:bg-dark-100'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          {selectedStack && (
            <AnimatedSection>
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
                <h3 className="text-xl font-bold text-dark-900 mb-4">{selectedStack.name}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedStack.compounds.map((id) => {
                    const c = compounds.find((x) => x.id === id)
                    if (!c) return null
                    return (
                      <Link key={id} to={`/peptides/${id}`} className="bg-white rounded-xl p-4 border border-dark-100 hover:border-primary-300 transition-colors">
                        <div className="text-xs text-primary-600 font-medium mb-1">{c.category}</div>
                        <div className="font-semibold text-dark-900 mb-1">{c.name}</div>
                        <div className="text-xs text-dark-500">{c.description}</div>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-dark-500">
                    <Stethoscope className="w-4 h-4 inline mr-1" />
                    This stack is a starting suggestion. Your physician will customize it based on your biomarkers and health history.
                  </p>
                  <Link to={`/assessment?program=${selectedStack.goal}`} className="btn-primary text-sm">
                    Get Protocol
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-main">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <FlaskConical className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Your Personalized Protocol</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Our physicians design protocols tailored to your body, goals, and biomarkers. Not one-size-fits-all. Not research-only. Clinical-grade peptide therapy.
            </p>
            <Link to="/assessment" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 shadow-none">
              Take Your 2-Minute Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

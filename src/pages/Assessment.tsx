import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight, ChevronLeft, AlertTriangle, Check, MessageCircle } from 'lucide-react'
import { AnimatedSection } from '../components/pages/AnimatedSection'

const steps = [
  { id: 'goals', label: 'Goals', number: 1 },
  { id: 'health', label: 'Health History', number: 2 },
  { id: 'medications', label: 'Medications', number: 3 },
  { id: 'lifestyle', label: 'Lifestyle', number: 4 },
  { id: 'consent', label: 'Consent', number: 5 },
]

const goals = [
  'Lose fat and improve body composition',
  'Build muscle and improve strength',
  'Recover from injury or surgery',
  'Slow aging and improve longevity',
  'Improve sports performance',
  'Improve energy, sleep, and mental clarity',
  'Improve skin, hair, and appearance',
  'Other',
]

const timelines = [
  'Urgent — I want to see results in 4–8 weeks',
  'Moderate — 3–6 months is fine',
  'Long-term — I\'m building a lifelong health plan',
]

const conditions = [
  'Type 1 diabetes', 'Type 2 diabetes', 'Prediabetes / insulin resistance',
  'Thyroid disease', 'Heart disease or arrhythmia', 'High blood pressure',
  'Kidney disease', 'Liver disease', 'History of pancreatitis',
  'History of gallbladder disease', 'Cancer (current or history)',
  'Depression or anxiety', 'Eating disorder (current or history)',
  'Sleep apnea', 'PCOS',
]

const medications = [
  'Insulin', 'Sulfonylureas (e.g., glibenclamide, gliclazide)',
  'Metformin', 'Warfarin or other blood thinners',
  'Thyroid medication', 'Corticosteroids',
  'Blood pressure medication', 'Antidepressants or anti-anxiety medication',
]

const diets = [
  'Standard South African diet', 'High protein', 'Low carb / keto',
  'Intermittent fasting', 'Vegetarian', 'Vegan', 'Other',
]

const exercises = [
  'Resistance training (weights)', 'Cardio (running, cycling, swimming)',
  'High-intensity interval training (HIIT)', 'Yoga / Pilates',
  'Team sports', 'Outdoor activities (hiking, surfing, etc.)', 'None currently',
]

const provinces = [
  'Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape',
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape',
]

const sources = [
  'Google Search', 'Instagram', 'YouTube', 'Cape Town Peptide Club',
  'Friend / Family referral', 'Doctor / Healthcare provider', 'Podcast', 'Other',
]

export default function Assessment() {
  const [searchParams] = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const program = searchParams.get('program')
    const compound = searchParams.get('compound')
    const city = searchParams.get('city')
    if (program) {
      const goalMap: Record<string, string> = {
        'weight-loss': 'Lose fat and improve body composition',
        'metabolic-reset': 'Lose fat and improve body composition',
        'muscle-recovery': 'Recover from injury or surgery',
        'sports-performance': 'Improve sports performance',
        'longevity': 'Slow aging and improve longevity',
      }
      setFormData((prev) => ({ ...prev, goal: goalMap[program] || '', program, city }))
    }
    if (compound) {
      setFormData((prev) => ({ ...prev, interestedCompound: compound }))
    }
    if (city) {
      setFormData((prev) => ({ ...prev, city }))
    }
  }, [searchParams])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  const validateStep = () => {
    const step = steps[currentStep].id
    const newErrors: Record<string, string> = {}
    if (step === 'goals') {
      if (!formData.goal) newErrors.goal = 'Please select a goal'
      if (!formData.timeline) newErrors.timeline = 'Please select a timeline'
    }
    if (step === 'health') {
      if (!formData.age || formData.age < 18 || formData.age > 100) newErrors.age = 'Please enter a valid age (18-100)'
      if (!formData.gender) newErrors.gender = 'Please select a gender'
      if (!formData.height || formData.height < 100 || formData.height > 250) newErrors.height = 'Please enter a valid height (cm)'
      if (!formData.weight || formData.weight < 30 || formData.weight > 300) newErrors.weight = 'Please enter a valid weight (kg)'
      if (!formData.mtcMen2) newErrors.mtcMen2 = 'Please answer this question'
    }
    if (step === 'medications') {
      if (!formData.currentMeds) newErrors.currentMeds = 'Please list your medications or write "none"'
    }
    if (step === 'lifestyle') {
      if (!formData.diet) newErrors.diet = 'Please select a diet pattern'
      if (!formData.exerciseDays) newErrors.exerciseDays = 'Please select exercise frequency'
    }
    if (step === 'consent') {
      if (!formData.name) newErrors.name = 'Please enter your full name'
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'
      if (!formData.phone) newErrors.phone = 'Please enter a phone number'
      if (!formData.city) newErrors.city = 'Please enter your city'
      if (!formData.consent1) newErrors.consent1 = 'You must consent to telehealth consultation'
      if (!formData.consent2) newErrors.consent2 = 'You must understand that a prescription is required'
      if (!formData.consent3) newErrors.consent3 = 'You must consent to data processing under POPIA'
      if (!formData.consent4) newErrors.consent4 = 'You must read the medical disclaimer'
      if (!formData.consent5) newErrors.consent5 = 'You must confirm you are 18 or older'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) return
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const submit = () => {
    if (!validateStep()) return
    setSubmitted(true)
  }

  const bmi = formData.height && formData.weight
    ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
    : null

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-dark-50">
        <div className="container-main max-w-2xl">
          <AnimatedSection className="bg-white rounded-2xl shadow-lg border border-dark-100 p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-dark-900 mb-4">Thank You, {formData.name}!</h1>
            <p className="text-dark-500 mb-6 leading-relaxed">
              Your assessment has been submitted successfully. An HPCSA-registered physician will review your health profile within 24–48 hours. You will receive an email and SMS with the physician's decision.
            </p>
            <div className="bg-dark-50 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-dark-900 mb-3">What happens next:</h3>
              <ol className="space-y-2 text-sm text-dark-500">
                <li>1. Physician review within 24–48 hours</li>
                <li>2. Email/SMS with approval, conditional, or decline decision</li>
                <li>3. If approved, complete payment and pharmacy fulfillment</li>
                <li>4. Cold-chain delivery to your door in 3–5 days</li>
                <li>5. Total time to first dose: 5–7 days</li>
              </ol>
            </div>
            <p className="text-sm text-dark-400 mb-6">
              Reference number: PSA-{new Date().getFullYear()}-{Math.floor(Math.random() * 90000 + 10000)}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn-primary">
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/27123456789" className="btn-secondary" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-dark-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-dark-100 sticky top-16 z-30">
        <div className="container-main py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-dark-700">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-dark-400">{steps[currentStep].label}</span>
          </div>
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-primary-600' : 'bg-dark-200'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="container-main py-8 md:py-12 max-w-3xl">
        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div key="goals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-dark-900 mb-1">What is your primary goal?</h2>
                  <p className="text-dark-500 text-sm mb-6">Select the goal that best describes what you want to achieve.</p>
                  <div className="space-y-2 mb-6">
                    {goals.map((g) => (
                      <button
                        key={g}
                        onClick={() => updateField('goal', g)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.goal === g
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-dark-200 hover:border-dark-300 text-dark-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  {errors.goal && <p className="text-red-600 text-sm mb-4">{errors.goal}</p>}

                  <h3 className="text-lg font-bold text-dark-900 mb-1 mt-8">What is your timeline?</h3>
                  <p className="text-dark-500 text-sm mb-4">Select the option that best matches your expectations.</p>
                  <div className="space-y-2">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        onClick={() => updateField('timeline', t)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.timeline === t
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-dark-200 hover:border-dark-300 text-dark-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.timeline && <p className="text-red-600 text-sm mt-4">{errors.timeline}</p>}

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-dark-700 mb-2">Have you tried peptides before?</label>
                    <div className="flex gap-3">
                      <button onClick={() => updateField('triedPeptides', 'Yes')} className={`px-4 py-2 rounded-lg border text-sm font-medium ${formData.triedPeptides === 'Yes' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200'}`}>Yes</button>
                      <button onClick={() => updateField('triedPeptides', 'No')} className={`px-4 py-2 rounded-lg border text-sm font-medium ${formData.triedPeptides === 'No' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200'}`}>No</button>
                    </div>
                    {formData.triedPeptides === 'Yes' && (
                      <div className="mt-3 space-y-2">
                        <input type="text" placeholder="Which ones?" className="input-field" value={formData.previousPeptides || ''} onChange={(e) => updateField('previousPeptides', e.target.value)} />
                        <input type="text" placeholder="For how long?" className="input-field" value={formData.previousDuration || ''} onChange={(e) => updateField('previousDuration', e.target.value)} />
                        <input type="text" placeholder="Results?" className="input-field" value={formData.previousResults || ''} onChange={(e) => updateField('previousResults', e.target.value)} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div key="health" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-dark-900 mb-1">Health History</h2>
                  <p className="text-dark-500 text-sm mb-6">This helps us screen for contraindications and design a safe protocol.</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Age</label>
                      <input type="number" className="input-field" placeholder="Years" value={formData.age || ''} onChange={(e) => updateField('age', parseInt(e.target.value))} />
                      {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Gender</label>
                      <select className="input-field" value={formData.gender || ''} onChange={(e) => updateField('gender', e.target.value)}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Height (cm)</label>
                      <input type="number" className="input-field" placeholder="cm" value={formData.height || ''} onChange={(e) => updateField('height', parseInt(e.target.value))} />
                      {errors.height && <p className="text-red-600 text-xs mt-1">{errors.height}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Weight (kg)</label>
                      <input type="number" className="input-field" placeholder="kg" value={formData.weight || ''} onChange={(e) => updateField('weight', parseInt(e.target.value))} />
                      {errors.weight && <p className="text-red-600 text-xs mt-1">{errors.weight}</p>}
                    </div>
                  </div>
                  {bmi && (
                    <div className={`rounded-lg p-3 mb-4 text-sm ${parseFloat(bmi) < 18.5 || parseFloat(bmi) > 40 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                      <div className="font-semibold">BMI: {bmi}</div>
                      {parseFloat(bmi) < 18.5 && <div className="text-xs">Your BMI is below 18.5. Weight loss peptides may not be appropriate. Your physician will assess.</div>}
                      {parseFloat(bmi) > 40 && <div className="text-xs">Your BMI is above 40. This requires additional physician attention and may need specialist referral.</div>}
                      {parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 40 && <div className="text-xs">Your BMI is within the range typically assessed for peptide therapy.</div>}
                    </div>
                  )}

                  <h3 className="font-semibold text-dark-900 mb-2 mt-4">Do you have any of the following conditions?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {conditions.map((c) => (
                      <label key={c} className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                          checked={(formData.conditions || []).includes(c)}
                          onChange={(e) => {
                            const current = formData.conditions || []
                            if (e.target.checked) updateField('conditions', [...current, c])
                            else updateField('conditions', current.filter((x: string) => x !== c))
                          }}
                        />
                        <span className="text-sm text-dark-700">{c}</span>
                      </label>
                    ))}
                  </div>
                  <input type="text" placeholder="Other conditions" className="input-field mb-4" value={formData.otherConditions || ''} onChange={(e) => updateField('otherConditions', e.target.value)} />

                  <h3 className="font-semibold text-dark-900 mb-2">Are you currently pregnant, planning pregnancy, or breastfeeding?</h3>
                  <div className="flex gap-3 mb-4">
                    {['Yes', 'No', 'Unsure'].map((o) => (
                      <button key={o} onClick={() => updateField('pregnancy', o)} className={`px-4 py-2 rounded-lg border text-sm font-medium ${formData.pregnancy === o ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200'}`}>{o}</button>
                    ))}
                  </div>

                  <h3 className="font-semibold text-dark-900 mb-2">Do you have a personal or family history of medullary thyroid carcinoma or MEN2?</h3>
                  <div className="flex gap-3">
                    {['Yes', 'No', 'Unsure'].map((o) => (
                      <button key={o} onClick={() => updateField('mtcMen2', o)} className={`px-4 py-2 rounded-lg border text-sm font-medium ${formData.mtcMen2 === o ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200'}`}>{o}</button>
                    ))}
                  </div>
                  {errors.mtcMen2 && <p className="text-red-600 text-xs mt-1">{errors.mtcMen2}</p>}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="medications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-dark-900 mb-1">Medications & Supplements</h2>
                  <p className="text-dark-500 text-sm mb-6">List all medications and supplements you are currently taking.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Current prescription medications</label>
                      <textarea className="input-field min-h-[80px]" placeholder="List all prescription medications" value={formData.currentMeds || ''} onChange={(e) => updateField('currentMeds', e.target.value)} />
                      {errors.currentMeds && <p className="text-red-600 text-xs mt-1">{errors.currentMeds}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Over-the-counter medications</label>
                      <textarea className="input-field min-h-[60px]" placeholder="List any OTC medications" value={formData.otcMeds || ''} onChange={(e) => updateField('otcMeds', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Supplements</label>
                      <textarea className="input-field min-h-[60px]" placeholder="List all supplements" value={formData.supplements || ''} onChange={(e) => updateField('supplements', e.target.value)} />
                    </div>
                  </div>

                  <h3 className="font-semibold text-dark-900 mb-2 mt-6">Are you taking any of the following?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {medications.map((m) => (
                      <label key={m} className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                          checked={(formData.selectedMeds || []).includes(m)}
                          onChange={(e) => {
                            const current = formData.selectedMeds || []
                            if (e.target.checked) updateField('selectedMeds', [...current, m])
                            else updateField('selectedMeds', current.filter((x: string) => x !== m))
                          }}
                        />
                        <span className="text-sm text-dark-700">{m}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="lifestyle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-dark-900 mb-1">Lifestyle</h2>
                  <p className="text-dark-500 text-sm mb-6">Help us understand your daily habits for a more personalized protocol.</p>

                  <h3 className="font-semibold text-dark-900 mb-2">Diet pattern</h3>
                  <div className="space-y-2 mb-4">
                    {diets.map((d) => (
                      <button
                        key={d}
                        onClick={() => updateField('diet', d)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.diet === d
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-dark-200 hover:border-dark-300 text-dark-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.diet && <p className="text-red-600 text-sm mb-4">{errors.diet}</p>}

                  <h3 className="font-semibold text-dark-900 mb-2 mt-4">Exercise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {exercises.map((e) => (
                      <label key={e} className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                          checked={(formData.exercises || []).includes(e)}
                          onChange={(ev) => {
                            const current = formData.exercises || []
                            if (ev.target.checked) updateField('exercises', [...current, e])
                            else updateField('exercises', current.filter((x: string) => x !== e))
                          }}
                        />
                        <span className="text-sm text-dark-700">{e}</span>
                      </label>
                    ))}
                  </div>

                  <h3 className="font-semibold text-dark-900 mb-2">How many days per week do you exercise?</h3>
                  <div className="flex gap-3 mb-4">
                    {['0', '1–2', '3–4', '5+'].map((d) => (
                      <button key={d} onClick={() => updateField('exerciseDays', d)} className={`px-4 py-2 rounded-lg border text-sm font-medium ${formData.exerciseDays === d ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-dark-200'}`}>{d}</button>
                    ))}
                  </div>
                  {errors.exerciseDays && <p className="text-red-600 text-sm mb-4">{errors.exerciseDays}</p>}

                  <h3 className="font-semibold text-dark-900 mb-2 mt-4">Sleep quality (1-10)</h3>
                  <input type="range" min="1" max="10" className="w-full mb-1" value={formData.sleepQuality || 5} onChange={(e) => updateField('sleepQuality', parseInt(e.target.value))} />
                  <div className="text-sm text-dark-500 mb-4">Current: {formData.sleepQuality || 5}</div>

                  <h3 className="font-semibold text-dark-900 mb-2">Average hours per night</h3>
                  <input type="number" className="input-field mb-4" placeholder="Hours" value={formData.sleepHours || ''} onChange={(e) => updateField('sleepHours', e.target.value)} />

                  <h3 className="font-semibold text-dark-900 mb-2">Stress level (1-10)</h3>
                  <input type="range" min="1" max="10" className="w-full mb-1" value={formData.stressLevel || 5} onChange={(e) => updateField('stressLevel', parseInt(e.target.value))} />
                  <div className="text-sm text-dark-500 mb-4">Current: {formData.stressLevel || 5}</div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="consent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-dark-900 mb-1">Consent & Contact</h2>
                  <p className="text-dark-500 text-sm mb-6">Complete your details and confirm your consent to proceed.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Full name</label>
                      <input type="text" className="input-field" placeholder="Your full name" value={formData.name || ''} onChange={(e) => updateField('name', e.target.value)} />
                      {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Email</label>
                      <input type="email" className="input-field" placeholder="you@example.com" value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} />
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">Phone number</label>
                      <input type="tel" className="input-field" placeholder="+27 12 345 6789" value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1">City</label>
                      <input type="text" className="input-field" placeholder="Cape Town" value={formData.city || ''} onChange={(e) => updateField('city', e.target.value)} />
                      {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-dark-700 mb-1">Province</label>
                      <select className="input-field" value={formData.province || ''} onChange={(e) => updateField('province', e.target.value)}>
                        <option value="">Select province</option>
                        {provinces.map((p) => (<option key={p} value={p}>{p}</option>))}
                      </select>
                    </div>
                  </div>

                  <h3 className="font-semibold text-dark-900 mb-2">How did you hear about us?</h3>
                  <div className="space-y-2 mb-6">
                    {sources.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateField('source', s)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          formData.source === s
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-dark-200 hover:border-dark-300 text-dark-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">
                        Peptide South Africa provides telehealth services connecting patients with HPCSA-registered physicians and licensed compounding pharmacies. Peptide therapy is not appropriate for everyone. All protocols require physician evaluation and prescription. Results vary. If you experience a medical emergency, call 10111 or 112 immediately.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'consent1', label: 'I consent to a telehealth consultation with an HPCSA-registered physician' },
                      { id: 'consent2', label: 'I understand that peptide therapy requires a prescription and physician oversight' },
                      { id: 'consent3', label: 'I consent to the collection and processing of my health data under POPIA' },
                      { id: 'consent4', label: 'I have read and understand the medical disclaimer' },
                      { id: 'consent5', label: 'I am 18 years or older' },
                    ].map((c) => (
                      <label key={c.id} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500 mt-0.5"
                          checked={!!formData[c.id]}
                          onChange={(e) => updateField(c.id, e.target.checked)}
                        />
                        <span className="text-sm text-dark-700">{c.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.consent1 && <p className="text-red-600 text-sm mt-2">{errors.consent1}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentStep === 0 ? 'text-dark-300 cursor-not-allowed' : 'text-dark-700 hover:bg-dark-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button onClick={nextStep} className="btn-primary">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit} className="btn-primary">
                  Submit Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* WhatsApp Alternative */}
            <div className="mt-4 text-center">
              <a href="https://wa.me/27123456789" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                <MessageCircle className="w-4 h-4" />
                Prefer WhatsApp? Click here to complete your assessment via WhatsApp
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

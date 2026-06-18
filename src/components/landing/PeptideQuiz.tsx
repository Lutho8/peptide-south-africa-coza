import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, X, Sparkles, Lightbulb, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { peptides, Peptide } from '@/data/peptides';

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; categories: string[] }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'goal',
    question: 'What is your primary research goal?',
    options: [
      { label: 'Weight loss & metabolism', value: 'weight', categories: ['metabolic', 'weight-loss'] },
      { label: 'Healing & recovery', value: 'healing', categories: ['healing'] },
      { label: 'Cognitive enhancement', value: 'cognitive', categories: ['cognitive'] },
      { label: 'Anti-aging & longevity', value: 'longevity', categories: ['longevity', 'anti-aging'] },
      { label: 'Immune support', value: 'immune', categories: ['immune'] },
      { label: 'Muscle growth & performance', value: 'performance', categories: ['gh-secretagogue'] },
    ],
  },
  {
    id: 'experience',
    question: 'What is your research experience level?',
    options: [
      { label: 'Beginner - Just starting out', value: 'beginner', categories: [] },
      { label: 'Intermediate - Some experience', value: 'intermediate', categories: [] },
      { label: 'Advanced - Extensive experience', value: 'advanced', categories: [] },
    ],
  },
  {
    id: 'administration',
    question: 'What administration method do you prefer?',
    options: [
      { label: 'Subcutaneous injection', value: 'subq', categories: [] },
      { label: 'Intranasal spray', value: 'nasal', categories: ['cognitive'] },
      { label: 'Any method is fine', value: 'any', categories: [] },
    ],
  },
  {
    id: 'frequency',
    question: 'How often can you commit to dosing?',
    options: [
      { label: 'Daily', value: 'daily', categories: [] },
      { label: '2-3 times per week', value: 'weekly', categories: [] },
      { label: 'Once weekly', value: 'once-weekly', categories: ['metabolic', 'weight-loss'] },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    options: [
      { label: 'FDA-approved status', value: 'fda', categories: ['metabolic', 'weight-loss'] },
      { label: 'Extensive research backing', value: 'research', categories: ['immune', 'healing'] },
      { label: 'Fast-acting results', value: 'fast', categories: ['cognitive', 'gh-secretagogue'] },
      { label: 'Long-term benefits', value: 'longterm', categories: ['longevity', 'anti-aging'] },
    ],
  },
];

interface PeptideQuizProps {
  open: boolean;
  onClose: () => void;
}

export function PeptideQuiz({ open, onClose }: PeptideQuizProps) {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      setStarted(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setStarted(false);
  };

  const getRecommendedPeptides = (): Peptide[] => {
    const categoryScores: Record<string, number> = {};
    quizQuestions.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.value === answer);
      if (option) {
        option.categories.forEach(cat => {
          categoryScores[cat] = (categoryScores[cat] || 0) + 2;
        });
      }
    });
    return peptides
      .map(p => ({ peptide: p, score: (categoryScores[p.category] || 0) + (p.longevityScore / 2) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(r => r.peptide);
  };

  if (!open) return null;

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-xl md:text-2xl font-bold">Peptide Quiz</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <AnimatePresence mode="wait">
          {!started ? (
            /* Landing / Intro Screen */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-8"
              >
                <Lightbulb className="w-10 h-10 text-accent" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Ideal Peptide</h2>
              <p className="text-muted-foreground text-lg mb-2">
                Answer 5 quick questions to get personalized peptide recommendations based on your goals.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Clock className="w-4 h-4" />
                <span>Takes less than 2 minutes</span>
              </div>

              <Button size="lg" className="min-h-[52px] px-10 text-base" onClick={() => setStarted(true)}>
                Start Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground mt-4">No account required</p>
            </motion.div>
          ) : !showResults ? (
            <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Question {currentStep + 1} of {quizQuestions.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{currentQuestion.question}</h2>
                    <div className="grid gap-3">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(currentQuestion.id, option.value)}
                          className={`p-4 rounded-xl border text-left transition-all min-h-[52px] ${
                            answers[currentQuestion.id] === option.value
                              ? 'border-accent bg-accent/10 ring-2 ring-accent/50'
                              : 'border-border hover:border-accent/50 hover:bg-accent/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            {answers[currentQuestion.id] === option.value && <CheckCircle className="w-5 h-5 text-accent" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleBack} className="min-h-[44px]">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="min-h-[44px]">
                  {currentStep === quizQuestions.length - 1 ? 'See Results' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Your Recommended Peptides</h2>
                <p className="text-muted-foreground">Based on your research goals, here are our top recommendations</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
                {getRecommendedPeptides().map((peptide, index) => (
                  <motion.div key={peptide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="p-4 hover:border-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{peptide.name}</h3>
                          <span className="text-sm text-muted-foreground capitalize">{peptide.category.replace('-', ' ')}</span>
                        </div>
                        <span className="text-2xl font-bold text-accent">#{index + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{peptide.mechanism.slice(0, 150)}...</p>
                      <div className="flex flex-wrap gap-1">
                        {peptide.benefits.slice(0, 2).map((benefit, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary">{benefit.slice(0, 30)}{benefit.length > 30 ? '...' : ''}</span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>Retake Quiz</Button>
                <Button onClick={onClose}>Back to Peptide South Africa</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

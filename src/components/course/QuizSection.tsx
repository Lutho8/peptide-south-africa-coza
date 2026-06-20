import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizSectionProps {
  title: string;
  questions: QuizQuestion[];
  isPassed: boolean;
  onPass: () => void;
}

export function QuizSection({ title, questions, isPassed, onPass }: QuizSectionProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [quizDone, setQuizDone] = useState(false);

  const passingScore = Math.ceil(questions.length * 0.7);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    setShowResult(true);
    if (selected === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setSelected(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      setQuizDone(true);
      const finalScore = score + (selected === questions[currentQ].correctIndex ? 0 : 0);
      // score already updated in handleSubmit
      if (score >= passingScore || (selected === questions[currentQ].correctIndex && score + 1 >= passingScore)) {
        onPass();
      }
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers(Array(questions.length).fill(null));
    setQuizDone(false);
  };

  if (isPassed) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-5 flex items-center gap-3">
          <Award className="text-green-500 shrink-0" size={24} />
          <div>
            <p className="font-semibold text-foreground">{title} — Passed!</p>
            <p className="text-sm text-muted-foreground">You've completed this knowledge check.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizDone) {
    const passed = score >= passingScore;
    return (
      <Card className={cn("border", passed ? "border-green-500/30 bg-green-500/5" : "border-destructive/30 bg-destructive/5")}>
        <CardContent className="p-6 text-center space-y-4">
          {passed ? (
            <>
              <Award className="text-green-500 mx-auto" size={40} />
              <h4 className="text-xl font-bold text-foreground">Congratulations!</h4>
              <p className="text-muted-foreground">You scored {score}/{questions.length}. Quiz passed!</p>
            </>
          ) : (
            <>
              <XCircle className="text-destructive mx-auto" size={40} />
              <h4 className="text-xl font-bold text-foreground">Not quite there</h4>
              <p className="text-muted-foreground">
                You scored {score}/{questions.length}. You need {passingScore} to pass.
              </p>
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RotateCcw size={16} /> Retry Quiz
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const q = questions[currentQ];

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-foreground text-sm">{title}</h4>
          <span className="text-xs text-muted-foreground">
            {currentQ + 1} / {questions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <p className="text-foreground font-medium">{q.question}</p>

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correctIndex;
                const isSelected = idx === selected;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border text-sm transition-all",
                      !showResult && isSelected && "border-primary bg-primary/10",
                      !showResult && !isSelected && "border-border hover:border-primary/50",
                      showResult && isCorrect && "border-green-500 bg-green-500/10 text-foreground",
                      showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10"
                    )}
                    disabled={showResult}
                  >
                    <span className="flex items-center gap-2">
                      {showResult && isCorrect && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle size={16} className="text-destructive shrink-0" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg"
              >
                {q.explanation}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selected === null} size="sm">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} size="sm">
              {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

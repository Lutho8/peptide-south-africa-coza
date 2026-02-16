import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, GraduationCap, Clock, Gift, Zap, ChevronDown, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CourseProgress } from '@/components/course/CourseProgress';
import { VideoLesson } from '@/components/course/VideoLesson';
import { QuizSection } from '@/components/course/QuizSection';
import { courseModules } from '@/data/courseContent';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FreeCourse() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());

  const totalLessons = courseModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalQuizzes = courseModules.length;

  const markLessonComplete = useCallback((id: string) => {
    setCompletedLessons((prev) => new Set(prev).add(id));
  }, []);

  const markQuizPassed = useCallback((moduleId: string) => {
    setCompletedQuizzes((prev) => new Set(prev).add(moduleId));
  }, []);

  const isModuleUnlocked = (index: number) => {
    if (index === 0) return true;
    const prev = courseModules[index - 1];
    const allLessonsDone = prev.lessons.every((l) => completedLessons.has(l.id));
    const quizDone = completedQuizzes.has(prev.id);
    return allLessonsDone && quizDone;
  };

  const scrollToCourse = () => {
    setStarted(true);
    setTimeout(() => {
      document.getElementById('course-content')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onSignInClick={() => navigate('/')} onSearch={() => navigate('/')} />

      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold tracking-wide">
        FREE INTRODUCTION TO PEPTIDE THERAPY STARTER COURSE
      </div>

      {/* Progress bar (when started) */}
      {started && (
        <CourseProgress
          completedLessons={completedLessons.size}
          totalLessons={totalLessons}
          completedQuizzes={completedQuizzes.size}
          totalQuizzes={totalQuizzes}
        />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-16 md:py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Rocket size={20} />
            <span>Unlock the Power of Peptides in Your Practice</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            Discover How to Transform Patient Outcomes, Scale Your Revenue, and Stay Ahead in Healthcare!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            6 modules · 11 video lessons · 6 quizzes · 100% free & self-paced
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button size="lg" onClick={scrollToCourse} className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
              👉 {started ? 'Continue Learning' : 'Start the Free Course'}
              <ArrowRight size={18} />
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm mt-4">
              <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> Self-Paced</span>
              <span className="flex items-center gap-1"><Gift size={14} className="text-primary" /> 100% Free</span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-primary" /> Instant Access</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Peptides Are Changing Medicine—Are You Ready?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <strong className="text-foreground">Peptide therapy</strong> is one of the <strong className="text-foreground">fastest-growing innovations in healthcare,</strong> offering groundbreaking solutions for <strong className="text-foreground">metabolic health, healing, longevity, cognitive function, aesthetics, and more.</strong>
          </p>
          <p className="text-muted-foreground text-lg">
            This self-paced course combines <strong className="text-foreground">video lessons</strong> with <strong className="text-foreground">interactive quizzes</strong> so you can learn at your own pace and test your knowledge as you go.
          </p>
        </div>
      </section>

      {/* Course Content */}
      <section id="course-content" className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-center text-foreground mb-4"
          >
            Course Modules
          </motion.h2>
          <p className="text-center text-muted-foreground mb-10">
            Complete each module's lessons and quiz to unlock the next one.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {courseModules.map((mod, idx) => {
              const unlocked = isModuleUnlocked(idx);
              const allLessonsDone = mod.lessons.every((l) => completedLessons.has(l.id));
              const quizDone = completedQuizzes.has(mod.id);
              const moduleComplete = allLessonsDone && quizDone;

              return (
                <AccordionItem
                  key={mod.id}
                  value={mod.id}
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all",
                    !unlocked && "opacity-60",
                    moduleComplete && "border-green-500/30"
                  )}
                >
                  <AccordionTrigger
                    className="px-5 py-4 hover:no-underline"
                    disabled={!unlocked}
                  >
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        moduleComplete ? "bg-green-500/10 text-green-500" :
                        unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {!unlocked ? <Lock size={16} /> : mod.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-base truncate">
                          Module {mod.number}: {mod.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{mod.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                        {mod.lessons.length} lesson{mod.lessons.length > 1 ? 's' : ''} + quiz
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-6">
                    {unlocked ? (
                      <div className="space-y-8 pt-2">
                        {mod.lessons.map((lesson) => (
                          <VideoLesson
                            key={lesson.id}
                            title={lesson.title}
                            description={lesson.description}
                            youtubeId={lesson.youtubeId}
                            duration={lesson.duration}
                            isCompleted={completedLessons.has(lesson.id)}
                            onComplete={() => markLessonComplete(lesson.id)}
                          />
                        ))}

                        <div className="border-t border-border pt-6">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <GraduationCap size={16} />
                            Knowledge Check
                          </h4>
                          {allLessonsDone ? (
                            <QuizSection
                              title={mod.quiz.title}
                              questions={mod.quiz.questions}
                              isPassed={quizDone}
                              onPass={() => markQuizPassed(mod.id)}
                            />
                          ) : (
                            <Card className="border-dashed">
                              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                                <BookOpen size={20} className="mx-auto mb-2 text-muted-foreground/50" />
                                Complete all lessons above to unlock the quiz.
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        Complete the previous module to unlock this one.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary font-semibold flex items-center justify-center gap-2 mb-2">
              <GraduationCap size={20} />
              Want to Go Deeper?
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Explore the Full Peptide University
            </h2>
            <p className="text-muted-foreground mt-4">
              Ready for advanced protocols, certification, and clinical mastery? Check out the full curriculum.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all gap-2"
              onClick={() => window.open('https://mypeptideuniversity.com', '_blank')}
            >
              👉 Visit Peptide University
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

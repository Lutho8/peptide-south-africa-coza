import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Brain,
  Send,
  User,
  Sparkles,
  Loader2,
  Flame,
  TrendingUp,
  Activity,
  Pill,
  Clock,
  Zap,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

interface AIChatProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, helpful: boolean) => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
  className?: string;
}

const defaultSuggestions = [
  'How should I time my CJC-1295 doses?',
  'What are common BPC-157 side effects?',
  'Optimize my current protocol',
  'Compare Ipamorelin vs GHRP-6',
];

export const AIChat: React.FC<AIChatProps> = ({
  messages: propMessages,
  onSendMessage,
  onRegenerate,
  onFeedback,
  isLoading = false,
  suggestedQuestions = defaultSuggestions,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm your peptide optimization assistant. I can help you with dosing schedules, protocol adjustments, side effect management, and tracking insights. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = propMessages ?? localMessages;

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    if (!propMessages) {
      setLocalMessages((prev) => [...prev, userMsg]);
    }
    onSendMessage?.(trimmed);
    setInputValue('');

    // Simulate response if no external handler manages messages
    if (!onSendMessage) {
      setTimeout(() => {
        const responses = [
          'Based on your recent logs, your energy levels have been trending upward since starting the CJC-1295 protocol. I recommend maintaining the current morning dosing schedule.',
          'For BPC-157, the standard subQ dosing range is 250-500mcg daily. Your current dose of 300mcg falls well within the therapeutic window.',
          'I noticed you missed a dose on Tuesday. Try setting a phone reminder for your evening injections to improve adherence.',
          'Your recovery scores correlate strongly with TB-500 dosing days. Consider maintaining at least 2 doses per week during your training blocks.',
        ];
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
        };
        setLocalMessages((prev) => [...prev, assistantMsg]);
      }, 1200);
    }
  }, [inputValue, isLoading, onSendMessage, propMessages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleSuggestionClick = useCallback(
    (question: string) => {
      setInputValue(question);
      inputRef.current?.focus();
    },
    []
  );

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      {/* Header */}
      <CardHeader className="pb-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Peptide AI Assistant</CardTitle>
              <div className="flex items-center gap-1.5">
                <span className={cn('h-1.5 w-1.5 rounded-full', isLoading ? 'bg-amber-500' : 'bg-emerald-500')} />
                <span className="text-[10px] text-muted-foreground">
                  {isLoading ? 'Thinking...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] gap-1">
            <Sparkles className="h-3 w-3" />
            GPT-4
          </Badge>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                      msg.role === 'assistant'
                        ? 'bg-primary/10'
                        : 'bg-muted'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <Brain className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5',
                      msg.role === 'assistant'
                        ? 'bg-muted text-foreground rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          'text-[10px]',
                          msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/60'
                        )}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {/* Feedback buttons for assistant messages */}
                      {msg.role === 'assistant' && msg.id !== 'welcome' && (
                        <div className="flex items-center gap-1 ml-2">
                          {onRegenerate && (
                            <button
                              onClick={() => onRegenerate(msg.id)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Regenerate"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          )}
                          {onFeedback && (
                            <>
                              <button
                                onClick={() => onFeedback(msg.id, true)}
                                className="text-muted-foreground hover:text-emerald-500 transition-colors"
                                title="Helpful"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onFeedback(msg.id, false)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                title="Not helpful"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Suggested questions (only show when there are few messages) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-border shrink-0">
          <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">
            Suggested questions
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSuggestionClick(q)}
                className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs text-foreground hover:bg-muted hover:border-muted-foreground/30 transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about dosing, protocols, side effects..."
            className="flex-1 bg-background"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          AI suggestions are informational only. Always consult a healthcare provider.
        </p>
      </div>
    </Card>
  );
};

AIChat.displayName = 'AIChat';

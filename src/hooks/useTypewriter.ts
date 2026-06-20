import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  pauseOnComplete?: number;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  pauseOnComplete = 0,
  onComplete,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    setIsComplete(false);
    setDisplayText('');
    
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
        
        if (loop) {
          setTimeout(() => {
            setDisplayText('');
            currentIndex = 0;
            setIsComplete(false);
            setTimeout(startTyping, delay);
          }, pauseOnComplete);
        }
      }
    };

    setTimeout(typeNextChar, speed);
  }, [text, speed, delay, loop, pauseOnComplete, onComplete]);

  useEffect(() => {
    const timer = setTimeout(startTyping, delay);
    return () => clearTimeout(timer);
  }, [startTyping, delay]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, []);

  return {
    displayText,
    isTyping,
    isComplete,
    cursorVisible,
    cursor: cursorVisible ? '|' : ' ',
    restart: startTyping,
  };
}
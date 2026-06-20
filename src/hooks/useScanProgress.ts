import { useCallback, useEffect, useRef, useState } from 'react';

export type ScanStage = 'idle' | 'upload' | 'extract' | 'generate' | 'finalize' | 'done' | 'error';

const STAGE_TARGETS: Record<Exclude<ScanStage, 'idle' | 'done' | 'error'>, number> = {
  upload: 15,
  extract: 50,
  generate: 90,
  finalize: 100,
};

const STAGE_LABELS: Record<ScanStage, string> = {
  idle: 'Ready',
  upload: 'Uploading bloodwork…',
  extract: 'Extracting biomarkers…',
  generate: 'Generating personalised protocol…',
  finalize: 'Finalising results…',
  done: 'Complete',
  error: 'Something went wrong',
};

export function useScanProgress() {
  const [stage, setStage] = useState<ScanStage>('idle');
  const [percent, setPercent] = useState(0);
  const stageRef = useRef<ScanStage>('idle');
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setPercent((current) => {
      const s = stageRef.current;
      if (s === 'idle' || s === 'done' || s === 'error') return current;
      const target = STAGE_TARGETS[s] ?? 100;
      const next = current + (target - current) * 0.08;
      return Math.min(target - 0.5, next);
    });
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(() => {
    stop();
    stageRef.current = 'upload';
    setStage('upload');
    setPercent(0);
    timerRef.current = window.setInterval(tick, 200);
  }, [stop, tick]);

  const advance = useCallback((next: 'extract' | 'generate' | 'finalize') => {
    stageRef.current = next;
    setStage(next);
  }, []);

  const complete = useCallback(() => {
    stageRef.current = 'done';
    setStage('done');
    setPercent(100);
    stop();
  }, [stop]);

  const fail = useCallback(() => {
    stageRef.current = 'error';
    setStage('error');
    stop();
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    stageRef.current = 'idle';
    setStage('idle');
    setPercent(0);
  }, [stop]);

  return {
    stage,
    label: STAGE_LABELS[stage],
    percent: Math.round(percent),
    start,
    advance,
    complete,
    fail,
    reset,
  };
}

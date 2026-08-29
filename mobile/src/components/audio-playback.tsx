/**
 * Simulated audiobook playback engine.
 * The web app has no real audio files - js/modules/audio.js keeps an
 * `audiobookState` object and advances `currentTime` with a 1s setInterval.
 * This hook is a faithful port of that simulation (ticker, seek, skip, speed
 * cycling, chapter navigation and the 15s demo sleep timer).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface AudioChapter {
  id: string;
  title: string;
  durationSecs: number;
}

export type AudioNotify = (text: string, tone: 'info' | 'success') => void;

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
const DEFAULT_SPEED = 1.25;
const SKIP_SECONDS = 10;
const SLEEP_TIMER_MS = 15000;

/** mm:ss, exactly like the web's formatAudioTime(). */
export function formatAudioTime(secs: number): string {
  const safe = Number.isFinite(secs) && secs > 0 ? secs : 0;
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** "12h 45m" style total duration used by the chapter sheet badge. */
export function formatTotalDuration(secs: number): string {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.round((secs % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes.toString().padStart(2, '0')}m` : `${minutes}m`;
}

export function formatSpeed(speed: number): string {
  return `${speed.toFixed(2).replace('.00', '')}x`;
}

export function useAudiobookPlayer(chapters: AudioChapter[], onNotify?: AudioNotify) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);

  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifyRef = useRef<AudioNotify | undefined>(onNotify);

  useEffect(() => {
    notifyRef.current = onNotify;
  }, [onNotify]);

  const duration = useMemo(
    () => chapters.reduce((sum, chapter) => sum + chapter.durationSecs, 0),
    [chapters],
  );

  /** Chapter offsets, so seeking maps back onto a chapter like the web does. */
  const offsets = useMemo(() => {
    let accumulated = 0;
    return chapters.map((chapter) => {
      const start = accumulated;
      accumulated += chapter.durationSecs;
      return start;
    });
  }, [chapters]);

  const currentChapterIdx = useMemo(() => {
    let index = 0;
    offsets.forEach((start, i) => {
      const end = start + (chapters[i]?.durationSecs ?? 0);
      if (currentTime >= start && currentTime < end) index = i;
    });
    return index;
  }, [offsets, chapters, currentTime]);

  // 1s ticker: advances playback by `speed` seconds, exactly as the web does.
  useEffect(() => {
    if (!isPlaying || duration <= 0) return;
    const interval = setInterval(() => {
      setCurrentTime((previous) => {
        const next = previous + speed;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, speed, duration]);

  const clearSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearSleepTimer, [clearSleepTimer]);

  const togglePlayback = useCallback(() => setIsPlaying((previous) => !previous), []);

  const skipTime = useCallback(
    (secs: number) => setCurrentTime((previous) => clamp(previous + secs, 0, duration)),
    [duration],
  );

  const seekToPercent = useCallback(
    (percent: number) => setCurrentTime(clamp(percent, 0, 1) * duration),
    [duration],
  );

  const playChapter = useCallback(
    (index: number) => {
      const start = offsets[index];
      if (start === undefined) return;
      setCurrentTime(clamp(start, 0, duration));
      setIsPlaying(true);
    },
    [offsets, duration],
  );

  const changeChapter = useCallback(
    (direction: number) => {
      const next = currentChapterIdx + direction;
      if (next < 0 || next >= chapters.length) return;
      playChapter(next);
    },
    [currentChapterIdx, chapters.length, playChapter],
  );

  const cycleSpeed = useCallback(() => {
    setSpeed((previous) => {
      const index = SPEEDS.indexOf(previous);
      return SPEEDS[(index + 1) % SPEEDS.length] ?? DEFAULT_SPEED;
    });
  }, []);

  const toggleSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearSleepTimer();
      setSleepTimerActive(false);
      notifyRef.current?.('Đã tắt hẹn giờ ngủ.', 'info');
      return;
    }
    setSleepTimerActive(true);
    notifyRef.current?.('Hẹn giờ tắt sau 15 giây (bản demo).', 'success');
    sleepTimerRef.current = setTimeout(() => {
      sleepTimerRef.current = null;
      setSleepTimerActive(false);
      setIsPlaying(false);
      notifyRef.current?.('Đã tự động tạm dừng sách nói (Hẹn giờ ngủ).', 'info');
    }, SLEEP_TIMER_MS);
  }, [clearSleepTimer]);

  return {
    isPlaying,
    currentTime,
    duration,
    speed,
    currentChapterIdx,
    sleepTimerActive,
    skipSeconds: SKIP_SECONDS,
    togglePlayback,
    skipTime,
    seekToPercent,
    playChapter,
    changeChapter,
    cycleSpeed,
    toggleSleepTimer,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

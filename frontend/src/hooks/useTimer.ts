import { useEffect, useRef, useState } from "react";

export const useTimer = (
  startedAt: Date | undefined,
  seconds: number, // 制限時間
  onTimeUp: () => void,
) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const hasCalledTimeUpRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!startedAt) {
      setRemainingTime(null);
      hasCalledTimeUpRef.current = false;
      return;
    }

    // 終了時刻
    const targetTime = new Date(startedAt).getTime() + seconds * 1000;

    const intervalId = setInterval(() => {
      const timeLeft = Math.max(
        0,
        Math.round((targetTime - Date.now()) / 1000),
      );

      if (timeLeft === 0) {
        setRemainingTime(0);
        clearInterval(intervalId);
        if (!hasCalledTimeUpRef.current) {
          hasCalledTimeUpRef.current = true;
          onTimeUpRef.current();
        }
      } else {
        setRemainingTime(timeLeft);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [startedAt, seconds]);

  return remainingTime;
};

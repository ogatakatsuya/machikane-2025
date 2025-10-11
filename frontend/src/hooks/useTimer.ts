import { useEffect, useState } from "react";

export const useTimer = (
  startedAt: Date | undefined,
  seconds: number, // 制限時間
  onTimeUp: () => void,
) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (!startedAt) {
      setRemainingTime(null);
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
        onTimeUp();
      } else {
        setRemainingTime(timeLeft);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [startedAt, seconds, onTimeUp]);

  return remainingTime;
};

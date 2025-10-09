import { useEffect, useState } from "react";

/**
 * 指定された時間（秒）後にページ遷移するタイマーフック
 * @param seconds - 制限時間（秒）
 * @param redirectTo - 遷移先のパス
 */
export const useTimer = (
  startedAt: Date,
  seconds: number,
  onTimeUp: () => void,
) => {
  // useStateを使って、コンポーネントの初期化時に一度だけ終了時刻を計算・設定
  const [targetTime] = useState(() => {
    const t = new Date(startedAt);
    t.setSeconds(t.getSeconds() + seconds);
    return t.getTime();
  });

  const [remainingTime, setRemainingTime] = useState(seconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.round((targetTime - now) / 1000);

      if (timeLeft <= 0) {
        setRemainingTime(0);
        clearInterval(intervalId); // タイマーを停止
        onTimeUp(); // 時間切れ時の処理を呼び出す
      } else {
        setRemainingTime(timeLeft);
      }
    }, 250); // 1秒より短い間隔で現在時刻との差を再計算する

    // コンポーネントがアンマウントされる時にクリーンアップ
    return () => clearInterval(intervalId);
  }, [targetTime, onTimeUp]); // 依存配列

  return remainingTime;
};

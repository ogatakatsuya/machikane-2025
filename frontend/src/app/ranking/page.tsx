"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import { UPDATE_RANKING_INTERVAL } from "@/lib/constants";

// ランキングデータの型定義
interface RankingItem {
  id: string;
  group_name: string;
  score: number;
  rank: number;
  created_at: string;
  completion_time?: number; // 完了時間（秒）
}

// 連続自動スクロールコンポーネント
const AutoScrollList = ({
  items,
  onScrollUpdate,
}: {
  items: RankingItem[];
  onScrollUpdate: (position: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    maxScroll: 0,
    clientHeight: 0,
    scrollHeight: 0,
  });

  // ヘルパー関数をコンポーネント内で定義
  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return {
        icon: "🏆",
        color: "text-yellow-500",
        bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      };
    if (rank === 2)
      return {
        icon: "🥈",
        color: "text-gray-600",
        bg: "bg-gradient-to-br from-gray-100 to-gray-200",
      };
    if (rank === 3)
      return {
        icon: "🥉",
        color: "text-amber-700",
        bg: "bg-gradient-to-br from-amber-100 to-amber-200",
      };
    if (rank <= 10)
      return {
        icon: rank.toString(),
        color: "text-yellow-600",
        bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      };
    return {
      icon: rank.toString(),
      color: "text-gray-100",
      bg: "bg-gradient-to-br from-gray-700 to-gray-600",
    };
  };

  // TODO: 日付もフォーマットする
  const formatChallengeTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;

    const startScrolling = () => {
      const container = containerRef.current;
      if (!container) {
        console.log("Container not found");
        return;
      }

      // DOMが完全にレンダリングされるまで待つ
      const checkAndStart = () => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        const debugData = {
          scrollHeight: container.scrollHeight,
          clientHeight: container.clientHeight,
          maxScroll: maxScroll,
        };

        setDebugInfo(debugData);
        console.log("Checking scroll capability:", debugData);

        if (maxScroll <= 0) {
          console.log("No scrollable content, retrying in 500ms...");
          retryTimeoutId = setTimeout(checkAndStart, 500);
          return;
        }

        console.log("Starting auto-scroll with maxScroll:", maxScroll);
        setIsScrolling(true);

        let currentPosition = 0;
        let isPaused = false;
        const scrollStep = 1; // より細かいステップ
        const pauseDuration = 2000; // 2秒休憩

        const scroll = () => {
          if (!containerRef.current || isPaused) return;

          currentPosition += scrollStep;

          // 境界チェック
          if (currentPosition >= maxScroll) {
            currentPosition = maxScroll;
            containerRef.current.scrollTop = currentPosition;
            setScrollPosition(currentPosition);
            onScrollUpdate(currentPosition);

            // 下に到達したら休憩してからトップに戻る
            isPaused = true;
            setTimeout(() => {
              if (containerRef.current) {
                currentPosition = 0;
                containerRef.current.scrollTop = 0;
                setScrollPosition(0);
                onScrollUpdate(0);
                isPaused = false;
              }
            }, pauseDuration);
          } else {
            containerRef.current.scrollTop = currentPosition;
            setScrollPosition(currentPosition);
            onScrollUpdate(currentPosition);
          }
        };

        // 30FPSでスクロール（より安定）
        intervalId = setInterval(scroll, 33); // 33ms ≈ 30fps
      };

      checkAndStart();
    };

    // データが存在し、DOMが準備できてから開始
    if (items && items.length > 0) {
      timeoutId = setTimeout(() => {
        startScrolling();
      }, 2000); // 2秒後に開始
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, [items]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-y-auto overflow-x-hidden auto-scroll-container"
        style={{
          height: "400px", // 固定の高さを設定
          scrollBehavior: "auto",
        }}
      >
        <div className="space-y-3 pb-40">
          {" "}
          {/* より多くのパディングを追加 */}
          {items.map((item) => {
            const badge = getRankBadge(item.rank);

            return (
              <div
                key={item.id}
                className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-600/30 transition-all duration-300 shadow-lg min-h-[80px]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-lg border-2 border-yellow-500/50 flex items-center justify-center text-lg font-bold ${badge.bg} ${badge.color} shadow-md`}
                  >
                    {badge.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-yellow-100 font-bold text-xl truncate font-mono">
                      {item.group_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-yellow-300/80">
                      <span>
                        🕐 完了時間:{" "}
                        {formatChallengeTime(item.completion_time || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400 font-mono">
                      {item.score}
                    </div>
                    <div className="text-yellow-600 text-sm font-mono">
                      POINTS
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* スクロールバーインジケーターとステータス */}
      <div className="mt-4 relative">
        {/* ステータス表示 */}
        <div className="mb-2 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ${isScrolling ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isScrolling ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
            ></div>
            <span>{isScrolling ? "SCROLLING" : "STOPPED"}</span>
          </div>
          <div className="text-xs text-yellow-600/60 mt-1 font-mono">
            H:{debugInfo.scrollHeight} | V:{debugInfo.clientHeight} | Max:
            {debugInfo.maxScroll} | Pos:{Math.round(scrollPosition)}
          </div>
        </div>

        <div className="w-full h-1 bg-yellow-900/30 rounded-full">
          <div
            className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-100"
            style={{
              width: `${debugInfo.maxScroll > 0 ? Math.min(100, (scrollPosition / debugInfo.maxScroll) * 100) : 0}%`,
            }}
          />
        </div>

        {/* デバッグ用手動スクロールボタン */}
        <div className="mt-2 flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTop += 100;
                console.log(
                  "Manual scroll - New position:",
                  containerRef.current.scrollTop,
                );
              }
            }}
            className="px-3 py-1 bg-yellow-600 text-black text-xs rounded font-mono hover:bg-yellow-500"
          >
            ↓ +100px
          </button>
          <button
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTop = 0;
                setScrollPosition(0);
                console.log("Reset scroll to top");
              }
            }}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded font-mono hover:bg-green-500"
          >
            🔝 Reset
          </button>
          <button
            onClick={() => {
              if (containerRef.current) {
                const info = {
                  scrollTop: containerRef.current.scrollTop,
                  scrollHeight: containerRef.current.scrollHeight,
                  clientHeight: containerRef.current.clientHeight,
                  maxScroll:
                    containerRef.current.scrollHeight -
                    containerRef.current.clientHeight,
                  itemsCount: items.length,
                };
                console.log("Container Debug Info:", info);
                alert(
                  `スクロール情報:\n高さ: ${info.scrollHeight}px\n表示: ${info.clientHeight}px\nMax: ${info.maxScroll}px\n現在位置: ${info.scrollTop}px\nアイテム数: ${info.itemsCount}`,
                );
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-mono hover:bg-blue-500"
          >
            📊 Debug
          </button>
        </div>
      </div>
    </div>
  );
};

// 波形アニメーション背景
const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="animate-wave1 absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
        <div className="animate-wave2 absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform skew-x-12"></div>
        <div className="animate-wave3 absolute inset-0 bg-gradient-to-r from-transparent via-purple-300 to-transparent transform -skew-x-6"></div>
      </div>
    </div>
  );
};

// 更新インジケーター
const UpdateIndicator = ({ isUpdating }: { isUpdating: boolean }) => {
  return (
    <div
      className={`fixed top-6 right-8 z-50 transition-all duration-500 ${isUpdating ? "scale-130 opacity-100" : "scale-100 opacity-70"}`}
    >
      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${isUpdating ? "bg-green-400 animate-pulse" : "bg-blue-400"}`}
        />
        <span className="text-white text-sm font-medium">
          {isUpdating ? "更新中..." : "更新待機中"}
        </span>
      </div>
    </div>
  );
};

const RankingPage = () => {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [remainingTime, setRemainingTime] = useState(UPDATE_RANKING_INTERVAL);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);

  // TODO: ダミー．API実装後
  const generateDummyRankings = useCallback((): RankingItem[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: `team-${i + 1}`,
      group_name: `チーム${i + 1}`,
      score: Math.max(0, 1000 - i * 15 - Math.floor(Math.random() * 50)),
      rank: i + 1,
      created_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      completion_time: Math.floor(300 + Math.random() * 1200), // 5-25分
    }));
  }, []);

  // 10分ごとの自動更新
  const fetchRankings = useCallback(async () => {
    setIsUpdating(true);

    // TODO: ダミーAPI呼び出しのシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRankings(generateDummyRankings());
    setLastUpdated(new Date());
    setIsUpdating(false);
  }, [generateDummyRankings]);

  // 初回データ読み込み
  useEffect(() => {
    const initializeData = async () => {
      await fetchRankings();
      setLoading(false);
    };

    initializeData();
  }, [fetchRankings]);

  // 10分ごとの更新タイマー
  useEffect(() => {
    const updateInterval = setInterval(
      fetchRankings,
      UPDATE_RANKING_INTERVAL * 1000,
    );
    return () => clearInterval(updateInterval);
  }, [fetchRankings]);

  // カウントダウンタイマー: 1秒ごとに更新
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextUpdateTime = new Date(
        lastUpdated.getTime() + UPDATE_RANKING_INTERVAL * 1000,
      );
      const remainingSeconds = Math.max(
        0,
        Math.floor((nextUpdateTime.getTime() - now.getTime()) / 1000),
      );
      setRemainingTime(remainingSeconds);
    };
    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [lastUpdated]);

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return {
        icon: "🏆",
        color: "text-yellow-500",
        bg: "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300",
        shadow: "shadow-yellow-200",
      };
    if (rank === 2)
      return {
        icon: "🥈",
        color: "text-gray-600",
        bg: "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300",
        shadow: "shadow-gray-200",
      };
    if (rank === 3)
      return {
        icon: "🥉",
        color: "text-amber-700",
        bg: "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300",
        shadow: "shadow-amber-200",
      };
    if (rank <= 10)
      return {
        icon: rank.toString(),
        color: "text-blue-700",
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
        shadow: "shadow-blue-100",
      };
    return {
      icon: rank.toString(),
      color: "text-gray-700",
      bg: "bg-gradient-to-br from-gray-50 to-white border-gray-200",
      shadow: "shadow-gray-100",
    };
  };

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // TODO: 日付もフォーマットする
  const formatChallengeTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) return <LoadingPage text="TOP50ランキングを読み込み中..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      <UpdateIndicator isUpdating={isUpdating} />

      <div className="absolute inset-0 overflow-hidden">
        {/* TODO: いる？背景暗号文 */}
        <div className="absolute inset-0 opacity-20">
          <div className="text-yellow-500 text-xl font-mono absolute top-10 left-10 animate-pulse">
            01110100 01101000 01100101
          </div>
          <div className="text-yellow-500 text-xl font-mono absolute top-20 right-20 animate-pulse">
            CIPHER
          </div>
          <div className="text-yellow-500 text-xl font-mono absolute bottom-20 left-20 animate-pulse">
            ?!@#$%^&*()
          </div>
          <div className="text-yellow-500 text-xl font-mono absolute bottom-10 right-10 animate-pulse">
            DECODE
          </div>
        </div>

        {/* 格子グリッド */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 0, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black/80 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-yellow-500/50 shadow-xl">
            <h1 className="text-5xl font-bold mb-3 flex items-center justify-center gap-4 font-mono">
              <span className="text-4xl">🔍</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MYSTERY RANKING
              </span>
              <span className="text-4xl">🔍</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-yellow-300/90 font-mono text-sm">
              <span>最終更新: {formatLastUpdated(lastUpdated)}</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>次回更新: {formatRemainingTime(remainingTime)}</span>
            </div>
          </div>
        </div>

        {/* TOP 3 */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-6">
            {rankings.slice(0, 3).map((item, index) => {
              const badge = getRankBadge(item.rank);
              const podiumHeights = ["h-32", "h-40", "h-28"];
              const podiumColors = [
                "bg-gradient-to-t from-gray-600 to-gray-400 border-gray-300",
                "bg-gradient-to-t from-yellow-600 to-yellow-400 border-yellow-300",
                "bg-gradient-to-t from-amber-700 to-amber-500 border-amber-400",
              ];

              return (
                <div
                  key={item.id}
                  className={`text-center ${index === 1 ? "order-first" : index === 0 ? "order-2" : "order-3"}`}
                >
                  <div
                    className={`${podiumColors[index]} ${podiumHeights[index]} rounded-t-2xl mx-8 mb-4 flex items-end justify-center pb-4 shadow-2xl border-2`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 rounded-xl border-4 border-black/30 flex items-center justify-center text-3xl font-bold mb-2 ${badge.bg} ${badge.color} shadow-xl`}
                      >
                        {badge.icon}
                      </div>
                      <div className="text-black font-bold text-lg drop-shadow-lg font-mono">
                        {item.rank}位
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-yellow-500/30">
                    <h3 className="text-yellow-100 font-bold text-lg mb-2 truncate font-mono">
                      {item.group_name}
                    </h3>
                    <div className="text-3xl font-bold text-yellow-400 mb-1 font-mono">
                      {item.score}
                    </div>
                    <div className="text-yellow-300/80 text-sm font-mono">
                      🕐 {formatChallengeTime(item.completion_time || 0)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4位以下のランキングリスト - 自動スクロール */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-500/50 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-3 font-mono">
            <span className="text-4xl">�</span>
            DETECTIVE BOARD (4-50位)
            <span className="text-4xl">�</span>
          </h2>

          <div className="max-h-96 overflow-hidden">
            <AutoScrollList
              items={rankings.slice(3)}
              onScrollUpdate={setCurrentScrollPosition}
            />
          </div>

          {/* スクロールインジケーター */}
          <div className="mt-6 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-yellow-500/70 text-sm font-mono">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>CONTINUOUS AUTO SCROLL</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-yellow-600/60 font-mono">
              {rankings.slice(3).length} TEAMS • 50px/SEC SPEED
            </div>
            <div className="text-xs text-yellow-500/40 font-mono">
              Position: {Math.round(currentScrollPosition)}px{" "}
              {currentScrollPosition > 0 ? "📍" : "🔝"}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-4 inline-block border border-yellow-500/30">
            <div className="text-yellow-400/90 text-sm font-mono">
              🔍 MYSTERY CHALLENGE 2025 | 🔄 REAL-TIME | 👥 {rankings.length}{" "}
              TEAMS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;

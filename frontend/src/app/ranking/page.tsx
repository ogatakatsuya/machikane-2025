"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import { UPDATE_RANKING_INTERVAL } from "@/lib/constants";

interface RankingItem {
  id: string;
  group_name: string;
  score: number;
  rank: number;
  time: number;
}

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
      color: "text-yellow-600",
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      shadow: "shadow-yellow-100",
    };
  return {
    icon: rank.toString(),
    color: "text-gray-100",
    bg: "bg-gradient-to-br from-gray-700 to-gray-600",
    shadow: "shadow-gray-100",
  };
};

const AutoScrollList = ({ items }: { items: RankingItem[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // TODO: 日付もフォーマットする
  const formatChallengeTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 自動スクロール機能
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrollEnabled) return;

    const scrollSpeed = 100; // ピクセル/秒
    const scrollInterval = 30; // ミリ秒ごとに更新
    const scrollStep = (scrollSpeed * scrollInterval) / 1000;

    const autoScroll = setInterval(() => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10
      ) {
        container.scrollTop = 0;
      } else {
        container.scrollTop += scrollStep;
      }
    }, scrollInterval);

    return () => clearInterval(autoScroll);
  }, [isAutoScrollEnabled]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto overflow-x-hidden auto-scroll-container"
        style={{
          height: "380px",
        }}
      >
        <div className="space-y-3 py-40">
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
                  <div className="flex-1">
                    <h3 className="text-yellow-100 font-bold text-xl truncate font-mono">
                      {item.group_name}
                    </h3>
                    <div className="text-sm text-yellow-300/80">
                      🕐 挑戦日時: {formatChallengeTime(item.time || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 font-mono">
                      {item.score}
                    </div>
                    <div className="text-yellow-600 text-sm font-mono">
                      CREDITS
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
        className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs transition-all duration-300 ${
          isAutoScrollEnabled
            ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400/60 hover:text-yellow-400"
            : "bg-gray-500/20 hover:bg-gray-500/30 text-gray-400/60 hover:text-gray-400"
        }`}
        title={
          isAutoScrollEnabled ? "自動スクロールを停止" : "自動スクロールを開始"
        }
      >
        {isAutoScrollEnabled ? "▶" : "⏸"}
      </button>
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

  // TODO: ダミー．API実装後
  const generateDummyRankings = useCallback((): RankingItem[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: `team-${i + 1}`,
      group_name: `チーム${i + 1}`,
      score: Math.max(0, 1000 - i * 15 - Math.floor(Math.random() * 50)),
      rank: i + 1,
      created_at: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      time: Math.floor(300 + Math.random() * 1200), // 5-25分
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
          <div className="grid grid-cols-3 gap-6 items-end">
            {rankings.slice(0, 3).map((item, index) => {
              const badge = getRankBadge(item.rank);
              const podiumHeights = ["h-40", "h-32", "h-28"];
              const podiumColors = [
                "bg-gradient-to-t from-yellow-600 to-yellow-400 border-yellow-300",
                "bg-gradient-to-t from-gray-600 to-gray-400 border-gray-300",
                "bg-gradient-to-t from-amber-700 to-amber-500 border-amber-400",
              ];

              return (
                <div
                  key={item.id}
                  className={`text-center ${index === 1 ? "order-first" : index === 0 ? "order-2" : "order-3"}`}
                >
                  <div
                    className={`${podiumColors[index]} ${podiumHeights[index]} rounded-t-2xl mx-8 mb-2 flex items-start justify-center shadow-2xl border-2`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center text-3xl font-bold mb-2 -mt-6 ${badge.bg} ${badge.color} shadow-xl`}
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
                      <span className="text-sm font-mono ml-1">単位</span>
                    </div>
                    <div className="text-yellow-300/80 text-sm font-mono">
                      🕐 {formatChallengeTime(item.time || 0)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4位以下のランキングリスト */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-500/50 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-3 font-mono">
            <span className="text-4xl">�</span>
            DETECTIVE BOARD
            <span className="text-4xl">�</span>
          </h2>

          <div className="max-h-96 overflow-hidden">
            <AutoScrollList items={rankings.slice(3)} />
          </div>

          <div className="mt-6 text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-yellow-500/70 text-sm font-mono">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>CONTINUOUS AUTO SCROLL</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-yellow-600/60 font-mono">
              {rankings.slice(3).length} TEAMS
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-4 inline-block border border-yellow-500/30 text-yellow-400/90 text-sm font-mono">
            🔍 MYSTERY CHALLENGE 2025 | 🔄 REAL-TIME | 👥 {rankings.length}{" "}
            TEAMS
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import { getRankings } from "@/lib/api";
import { UPDATE_RANKING_INTERVAL } from "@/lib/constants";
import type { RankingItem } from "@/lib/types";

const getRankBadge = (rank: number) => {
  if (rank === 1)
    return {
      icon: "🏆",
      color: "text-yellow-300",
      bg: "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300",
      shadow: "shadow-yellow-400",
    };
  if (rank === 2)
    return {
      icon: "🥈",
      color: "text-gray-100",
      bg: "bg-gradient-to-br from-gray-300 to-gray-400 border-gray-300",
      shadow: "shadow-gray-300",
    };
  if (rank === 3)
    return {
      icon: "🥉",
      color: "text-amber-200",
      bg: "bg-gradient-to-br from-amber-500 to-amber-700 border-amber-400",
      shadow: "shadow-amber-400",
    };
  if (rank <= 10)
    return {
      icon: rank.toString(),
      color: "text-cyan-200",
      bg: "bg-gradient-to-br from-cyan-600 to-cyan-800",
      shadow: "shadow-cyan-400",
    };
  return {
    icon: rank.toString(),
    color: "text-blue-200",
    bg: "bg-gradient-to-br from-blue-700 to-blue-900",
    shadow: "shadow-blue-400",
  };
};

const formatChallengeTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

const AutoScrollList = ({ items }: { items: RankingItem[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // 自動スクロール機能
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isAutoScrollEnabled) return;
    if (items.length <= 3) return;

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
  }, [isAutoScrollEnabled, items]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="overflow-y-auto overflow-x-hidden auto-scroll-container"
        style={{
          height: "380px",
        }}
      >
        <div className={`space-y-3 ${items.length <= 3 ? "py-2" : "py-40"}`}>
          {items.map((item) => {
            const badge = getRankBadge(item.rank);

            return (
              <div
                key={item.id}
                className="bg-gradient-to-r from-blue-900/60 via-blue-800/60 to-cyan-900/60 rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-cyan-500/40 shadow-lg min-h-[70px] md:min-h-[80px] relative overflow-hidden mx-1"
              >
                <div className="absolute top-2 right-4 w-2 h-2 bg-cyan-300/40 rounded-full animate-pulse" />
                <div className="absolute bottom-3 right-8 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse delay-75" />

                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 md:border-3 flex items-center justify-center text-xl md:text-2xl font-bold ${badge.bg} ${badge.color} relative flex-shrink-0`}
                  >
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-cyan-100 font-bold text-lg md:text-xl truncate">
                      {item.group_name}
                    </h3>
                    <div className="text-xs md:text-sm text-cyan-300/70">
                      挑戦日時: {formatChallengeTime(item.created_at)}
                    </div>
                  </div>
                  <div className="text-center bg-blue-950/50 rounded-lg px-2 md:px-4 py-2 border border-cyan-500/30 flex-shrink-0">
                    <div className="text-2xl md:text-4xl font-bold text-yellow-300 drop-shadow-[0_2px_8px_rgba(253,224,71,0.5)]">
                      {item.score}
                    </div>
                    <div className="text-cyan-400 text-xs md:text-sm font-bold tracking-wider">
                      単位
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
        className={`absolute bottom-2 right-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 border z-10 ${
          isAutoScrollEnabled
            ? "bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-300/60 hover:text-cyan-300 border-cyan-500/30"
            : "bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-200/80 hover:text-cyan-200 border-cyan-400/50"
        }`}
        title={
          isAutoScrollEnabled ? "自動スクロールを停止" : "自動スクロールを開始"
        }
      >
        {isAutoScrollEnabled ? "⏸ 停止" : "▶ 再生"}
      </button>
    </div>
  );
};

// 更新インジケーター
const UpdateIndicator = ({ isUpdating }: { isUpdating: boolean }) => {
  return (
    <div
      className={`fixed top-4 md:top-6 right-2 md:right-8 z-50 transition-all duration-500 ${isUpdating ? "scale-110 opacity-100" : "scale-100 opacity-80"}`}
    >
      <div className="bg-blue-900/60 rounded-full px-2 md:px-4 py-1 md:py-2 flex items-center gap-1 md:gap-2 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20">
        <div
          className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${isUpdating ? "bg-cyan-400 animate-pulse" : "bg-cyan-500"}`}
        />
        <span className="text-cyan-200 text-xs md:text-sm font-medium">
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

  // 10分ごとの自動更新
  const fetchRankings = useCallback(async () => {
    setIsUpdating(true);

    try {
      const response = await getRankings(0, 50);
      setRankings(response.rankings);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    }

    setLastUpdated(new Date());
    setIsUpdating(false);
  }, []);

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
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(countdownInterval);
  }, [lastUpdated]);

  const formatRemainingTime = (seconds: number) => {
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

  // 参加チームが0の場合
  if (rankings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-cyan-900 relative overflow-hidden flex items-center justify-center">
        <UpdateIndicator isUpdating={isUpdating} />

        <div className="z-10 text-center px-2">
          <div className="bg-blue-950/80 rounded-2xl md:rounded-3xl px-6 md:px-12 py-8 md:py-10 border-2 md:border-3 border-cyan-400/60 shadow-2xl shadow-cyan-500/20">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6">🌊</div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(253,224,71,0.5)]">
                まだ参加チームがいません
              </span>
            </h1>
            <p className="text-cyan-200 text-lg md:text-xl mb-4 md:mb-6">
              大阪湾に沈んだ単位を取り戻す冒険者を待っています！
            </p>
            <div className="text-cyan-300/80 text-base md:text-lg mb-4 md:mb-6">
              最初の挑戦者になりませんか？ 🚀
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-cyan-300/70 text-xs md:text-sm border-t border-cyan-500/30 pt-4">
              <span>最終更新: {formatLastUpdated(lastUpdated)}</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>次回更新: {formatRemainingTime(remainingTime)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const top3Rankings = rankings.slice(0, 3);
  const hasTop3 = top3Rankings.length > 0;
  const remaining = rankings.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-cyan-900 relative overflow-hidden">
      <UpdateIndicator isUpdating={isUpdating} />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-400/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-2 md:px-6 py-4">
        {/* ヘッダー */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-blue-950/80 rounded-2xl md:rounded-3xl px-4 md:px-8 py-4 md:py-6 border-2 md:border-3 border-cyan-400/60 shadow-2xl shadow-cyan-500/20 mx-2">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
              <span className="text-3xl md:text-5xl">🔍</span>
              <h1 className="text-2xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(253,224,71,0.5)]">
                  修得単位数ランキング
                </span>
              </h1>
              <span className="text-3xl md:text-5xl">🔍</span>
            </div>
            <div className="text-cyan-200 text-base md:text-lg mb-3 font-bold">
              大阪湾に沈んだ単位を取り戻せ！
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-cyan-300/80 text-xs md:text-sm">
              <span>最終更新: {formatLastUpdated(lastUpdated)}</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>次回更新: {formatRemainingTime(remainingTime)}</span>
            </div>
          </div>
        </div>

        {/* TOP 3 */}
        {hasTop3 && (
          <div className="mb-6 md:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 items-end">
              {top3Rankings.map((item, index) => {
                const badge = getRankBadge(item.rank);
                const podiumHeights = [
                  "h-32 md:h-48",
                  "h-28 md:h-40",
                  "h-24 md:h-36",
                ];
                const podiumColors = [
                  "bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 border-yellow-300",
                  "bg-gradient-to-t from-gray-500 via-gray-400 to-gray-300 border-gray-300",
                  "bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 border-amber-400",
                ];

                return (
                  <div
                    key={item.id}
                    className={`text-center ${index === 1 ? "sm:order-first" : index === 0 ? "sm:order-2" : "sm:order-3"}`}
                  >
                    <div
                      className={`${podiumColors[index]} ${podiumHeights[index]} rounded-t-2xl md:rounded-t-3xl mx-2 md:mx-8 mb-2 flex justify-center border-2 md:border-3 relative`}
                    >
                      <div className="text-center relative z-10 -mt-6 md:-mt-10">
                        <div
                          className={`w-16 h-16 md:w-30 md:h-30 rounded-full border-2 md:border-4 flex items-center justify-center text-3xl md:text-6xl font-bold mb-1 md:mb-2 ${badge.bg} ${badge.color} shadow-2xl`}
                        >
                          {badge.icon}
                        </div>
                        <div className="text-white font-bold text-xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1 tracking-wider">
                          {item.rank}位
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-cyan-900/80 rounded-xl md:rounded-2xl p-3 md:p-4 border-2 border-cyan-400/50 shadow-xl mx-1">
                      <h3 className="text-cyan-100 font-bold text-lg md:text-xl mb-2 truncate">
                        {item.group_name}
                      </h3>
                      <div className="bg-blue-950/60 rounded-lg px-2 md:px-3 py-2 border border-cyan-500/40 mb-2">
                        <div className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-[0_2px_10px_rgba(253,224,71,0.6)]">
                          {item.score}
                        </div>
                        <div className="text-cyan-300 text-base md:text-lg font-bold tracking-widest">
                          単位
                        </div>
                      </div>
                      <div className="text-cyan-300/70 text-xs md:text-sm">
                        🕐 {formatChallengeTime(item.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4位以下のランキングリスト */}
        {remaining.length > 0 && (
          <div className="bg-blue-950/80 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 md:border-3 border-cyan-400/60 shadow-2xl shadow-cyan-500/20 mx-2">
            <h2 className="text-xl md:text-3xl font-bold text-cyan-200 mb-4 md:mb-6 text-center flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
              <span className="text-2xl md:text-4xl">🔍</span>
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                単位修得状況
              </span>
              <span className="text-2xl md:text-4xl">🔍</span>
            </h2>

            <div className="max-h-80 md:max-h-96 overflow-hidden">
              <AutoScrollList items={remaining} />
            </div>

            <div className="mt-4 md:mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-cyan-400/70 text-xs md:text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>自動スクロール中</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* 参加チームが少ない場合のメッセージ */}
        {rankings.length > 0 && rankings.length < 4 && (
          <div className="mt-6 md:mt-8 text-center">
            <div className="inline-block bg-blue-950/60 rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-6 border-2 border-cyan-400/40 shadow-xl mx-2">
              <div className="text-3xl md:text-4xl mb-3">🌟</div>
              <p className="text-cyan-200 text-base md:text-lg font-bold mb-2">
                まだまだ挑戦者を募集中！
              </p>
              <p className="text-cyan-300/80 text-sm md:text-base">
                あなたも大阪湾に沈んだ単位を取り戻しませんか？
              </p>
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="mt-4 text-center">
          <div className="bg-blue-950/80 rounded-lg md:rounded-xl px-3 md:px-6 py-3 md:py-4 inline-flex flex-col sm:flex-row sm:divide-x-2 border-2 border-cyan-400/40 text-cyan-300/90 text-xs md:text-sm shadow-lg mx-2 gap-2 sm:gap-0">
            <span className="px-2 md:px-4">マチカネ謎解き@A101</span>
            <span className="px-2 md:px-4">
              🌊 大阪湾に沈んだ単位を取り戻せ！
            </span>
            <span className="px-2 md:px-4">
              👥 {rankings.length} チーム参加中
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;

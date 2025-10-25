"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getQuizResults } from "@/lib/api";
import type { QuizResult } from "@/lib/quiz-types";

const ShareInstagramContent = () => {
  const [results, setResults] = useState<QuizResult | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeResult = async () => {
      try {
        const groupId = searchParams.get("groupId");
        if (!groupId) {
          return;
        }

        const result = await getQuizResults(groupId);
        setResults({
          ...result,
          created_at: new Date(result.created_at),
          updated_at: new Date(result.updated_at),
          context: {
            ...result.context,
            startedAt: new Date(result.context.startedAt),
          },
          top_five: result.top_five.map((t) => ({
            ...t,
            created_at: new Date(t.created_at),
          })),
        });
      } catch (error) {
        console.error("Failed to load results:", error);
      }
    };
    initializeResult();
  }, [searchParams]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <div className="fixed left-0 top-0">
      <div className="w-[1080px] h-[1920px] bg-gradient-to-b from-blue-950 via-blue-900 to-cyan-900 flex flex-col items-center justify-between p-20 text-white relative overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 border-4 border-cyan-400 rounded-full" />
          <div className="absolute bottom-40 left-20 w-72 h-72 border-4 border-cyan-300 rounded-full" />
        </div>

        {/* 釣り糸 */}
        <div className="absolute top-[180px] left-49">
          <div className="w-1 h-[600px] bg-gradient-to-b from-gray-300 via-gray-400 to-transparent opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
        </div>

        {/* ヘッダー */}
        <div className="relative z-10 flex flex-col items-center pt-12">
          <div className="absolute -top-2 -right-18 rotate-12">
            <div className="relative">
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 rounded-2xl px-6 py-3 shadow-2xl border-4 border-white">
                <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-yellow-400 via-red-400 to-orange-400 rounded-2xl blur-md opacity-75 -z-10" />
                <div className="flex items-center gap-2">
                  <span className="text-[36px]">📍</span>
                  <p className="text-[32px] font-black text-white tracking-wider drop-shadow-lg">
                    A101で出店中！
                  </p>
                  <span className="text-[36px]">✨</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full blur-xl opacity-50" />
            <div className="relative bg-white rounded-full">
              <Image
                src="/pmb.webp"
                alt="謎解きアイコン"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center space-y-4 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <p className="text-[28px] font-light tracking-[0.3em] text-cyan-300">
                2025
              </p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            </div>
            <h1 className="text-[64px] font-bold leading-tight tracking-wide">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(253,224,71,0.5)]">
                まちかね謎解き
              </span>
            </h1>
            <div className="text-cyan-200 text-[22px] font-bold">
              大阪湾に沈んだ単位を取り戻せ！
            </div>
          </div>
        </div>

        {/* 成績証明書 */}
        <div className="relative z-10 w-full">
          <div className="relative">
            <div className="absolute -top-16 left-32 -translate-x-1/2 z-30">
              <div className="text-[70px] drop-shadow-lg">🪝</div>
            </div>

            <div className="bg-white/95 rounded-2xl border-4 border-amber-500/30 overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 p-6">
                <h2 className="text-[42px] font-bold text-center text-white tracking-wide drop-shadow-lg flex items-center justify-center gap-3">
                  <span className="text-[48px]">🎓</span>
                  履修成績証明書
                  <span className="text-[48px]">🎓</span>
                </h2>
              </div>

              <div className="p-12 space-y-10">
                <div className="py-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300">
                  <p className="text-[24px] text-gray-900 mb-2 font-light ml-6">
                    チーム名
                  </p>
                  <p className="text-[48px] font-bold text-center text-gray-900 leading-tight">
                    {results?.group_name || "不明"}
                  </p>
                </div>

                <div className="py-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="text-[28px] text-gray-900 mb-3 font-light tracking-wider ml-6">
                    修得単位数
                  </p>
                  <div className="flex items-end justify-center gap-3">
                    <span className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-none">
                      {results?.score || 0}
                    </span>
                    <span className="text-[56px] font-bold text-blue-600">
                      単位
                    </span>
                  </div>
                  <div className="text-[25px] text-gray-900 mt-2 text-center">
                    / 45 単位
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 pb-3 border-2 border-orange-300">
                  <p className="text-[28px] text-gray-900 mb-3 font-light">
                    ランキング
                  </p>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-[48px] font-bold text-orange-600">
                      第
                    </span>
                    <span className="text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 leading-none">
                      {results?.rank || "?"}
                    </span>
                    <span className="text-[48px] font-bold text-orange-600">
                      位
                    </span>
                  </div>
                  <p className="text-right text-[18px] text-gray-900 mt-4 font-light italic">
                    {currentTime && `※${currentTime}時点での順位`}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 border-t-2 border-gray-300">
                <p className="text-[18px] text-gray-600 text-center font-light">
                  Issued by i.maker
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* フッターエリア */}
        <div className="relative z-10 flex flex-col items-center pt-12">
          <div className="bg-blue-950/80 rounded-2xl px-12 py-4 inline-flex gap-6 border-4 border-cyan-400/40 text-cyan-200 text-[32px] shadow-2xl">
            <span># マチカネ謎解き2025 </span>
            <span># imaker</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareInstagramPage = () => {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ShareInstagramContent />
    </Suspense>
  );
};

export default ShareInstagramPage;

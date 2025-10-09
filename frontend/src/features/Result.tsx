"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { submitQuizResults } from "@/lib/api";
import { SAMPLE_QUESTIONS } from "@/lib/constants";
import {
  QuestionStatus,
  type QuizResult,
  type QuizSubmissionData,
} from "@/lib/quiz-types";
import ArrowUpIcon from "/public/arrow-up.svg";
import ChartIcon from "/public/chart.svg";
import GlobeIcon from "/public/globe.svg";
import SearchIcon from "/public/search.svg";
import ShareIcon from "/public/share.svg";
import UserIcon from "/public/user.svg";

const Result = () => {
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const submissionData = localStorage.getItem("quiz_submission");
        if (submissionData) {
          const parsed = JSON.parse(submissionData);
          try {
            const result = await submitQuizResults(
              parsed as QuizSubmissionData,
            );
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
          } catch (apiError) {
            alert("結果送信に失敗しました。");
            console.error("API error:", apiError);
          }
        } else {
          alert("提出データが見つかりません。");
        }
      } catch (error) {
        console.error("Error loading submission data:", error);
        alert("提出データの読み込み中にエラーが発生しました。");
      }
    };
    initializeQuiz();
  }, []);

  return (
    <div className="bg-[#eeeecc] w-full min-h-screen">
      <div>
        {/* TODO: ロゴアイコンに変更 */}
        <Image
          src="/nazotoki_icon.png"
          alt="謎解きアイコン"
          width={48}
          height={48}
          className="object-contain mb-6"
          priority
        />
        <div className="flex w-fit bg-[#ccc] h-[22px] min-w-32 p-px ml-1 mb-4">
          <div className="bg-[#555] text-white w-5 h-5">
            <UserIcon className="w-5" />
          </div>
          {/* TODO: チーム名を返してくれるようBEに実装依頼 */}
          <span className="text-xs pl-2 pt-px">チーム名</span>
        </div>
        <div className="mb-4">
          <ul className="flex text-[10px] text-white">
            <li className="flex flex-col items-center justify-center gap-1 bg-[#88AA33] w-20 h-16">
              <UserIcon className="w-6" />
              <p>結果を見る</p>
            </li>
            <li className="flex flex-col items-center justify-center gap-1 bg-[#e67e22] w-20 h-16">
              <ChartIcon className="w-6" />
              <p>偏差値</p>
            </li>
            <li className="flex flex-col items-center justify-center gap-1 bg-[#c6b] w-20 h-16">
              <GlobeIcon className="w-6" />
              <p>ランキング</p>
            </li>
            <li className="flex flex-col items-center justify-center gap-1 bg-[#5498B8] w-20 h-16">
              <ShareIcon className="w-6" />
              <p>共有</p>
            </li>
          </ul>
        </div>
        <div className="bg-[#f0f0f0] mx-2 p-1">
          <h2 className="h-8 bg-[#555555] text-xs text-white flex items-center">
            <SearchIcon className="w-4 mx-2" />
            履修成績照会
          </h2>
          <div className="flex justify-between text-xs m-4 space-y-2">
            <p>
              年度・学年：<strong>2025年度・マチカネ学期</strong>
            </p>
            <p className="font-bold pr-5">
              <span className="text-4xl mr-1">{results?.score || 0}</span>単位
            </p>
          </div>
          <div className="px-2">
            <table className="w-full text-xs">
              <thead className="bg-[#34495e] h-9 text-white font-bold">
                <tr>
                  <th className="border w-[10%]" />
                  <th className="border">科目</th>
                  <th className="border w-[15%]">合否</th>
                </tr>
              </thead>
              <tbody className="bg-[#ddd]">
                {results?.context.questionStates.map((qs) => (
                  <tr className="h-8" key={qs.id}>
                    <td className="border border-white text-center">{qs.id}</td>
                    <td className="border border-white pl-2 font-bold">
                      {SAMPLE_QUESTIONS.find((q) => q.id === qs.id)?.title ||
                        "不明な科目"}
                    </td>
                    <td className="border border-white text-center">
                      <div
                        className={`font-bold text-white w-8 h-8 rounded-sm flex items-center justify-center mx-auto my-2 ${qs.status === QuestionStatus.CORRECT ? "bg-[#ffa500]" : "bg-[#7D7D7D]"}`}
                      >
                        {qs.status === QuestionStatus.CORRECT ? "合" : "否"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-[#34495e] h-8 text-xs text-white font-bold flex items-center justify-center">
              TOPへ
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center mx-2">
                <ArrowUpIcon className="w-3 text-[#34495e]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

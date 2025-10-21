"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import LoadingPage from "@/components/LoadingPage";
import Modal from "@/components/Modal";
import { getQuizResults } from "@/lib/api";
import { SAMPLE_QUESTIONS, snsData } from "@/lib/constants";
import { QuestionStatus, type QuizResult } from "@/lib/quiz-types";
import ArrowUpIcon from "/public/arrow-up.svg";
import ChartIcon from "/public/chart.svg";
import GlobeIcon from "/public/globe.svg";
import InstagramLogo from "/public/instagram.svg";
import SearchIcon from "/public/search.svg";
import ShareIcon from "/public/share.svg";
import UserIcon from "/public/user.svg";
import XLogo from "/public/x.svg";

const Result = () => {
  const [results, setResults] = useState<QuizResult | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializeResult = async () => {
      try {
        const groupId = searchParams.get("groupId");
        if (!groupId) {
          alert("グループIDが見つかりません。最初からやり直してください。");
          router.push("/");
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
        alert("結果の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };
    initializeResult();
  }, [router, searchParams]);

  const closeModal = () => setActiveModal(null);

  const getAnswerStatusColor = (questionId: number) => {
    const d = results?.context.questionStates.find((q) => q.id === questionId);
    if (d?.status === QuestionStatus.CORRECT)
      return "text-green-600 bg-green-100";
    else if (d?.status === QuestionStatus.INCORRECT)
      return "text-red-600 bg-red-100";
    else return "text-gray-600 bg-gray-100";
  };

  if (isLoading) {
    return <LoadingPage text="結果を読み込み中..." />;
  }

  return (
    <div className="bg-[#eeeecc] w-full min-h-screen">
      <div className="pt-1">
        <Image
          src="/imaker_logo.webp"
          alt="謎解きアイコン"
          width={141}
          height={44}
          className="object-contain mb-6 ml-1"
          priority
        />
        <div className="flex w-fit bg-[#ccc] h-[22px] min-w-32 p-px ml-1 mb-4">
          <div className="bg-[#555] text-white w-5 h-5">
            <UserIcon className="w-5" />
          </div>
          <span className="text-xs pl-2 pt-px">
            {results?.group_name || "不明なチーム"}
          </span>
        </div>
        <div className="mb-4">
          <ul className="flex text-[10px] text-white">
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: need */}
            <li
              className="flex flex-col items-center justify-center gap-1 bg-[#88AA33] w-20 h-16 cursor-pointer hover:opacity-80"
              onClick={() => setActiveModal("result")}
            >
              <UserIcon className="w-6" />
              <p>結果を見る</p>
            </li>
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: need */}
            <li
              className="flex flex-col items-center justify-center gap-1 bg-[#e67e22] w-20 h-16 cursor-pointer hover:opacity-80"
              onClick={() => setActiveModal("deviation")}
            >
              <ChartIcon className="w-6" />
              <p>偏差値</p>
            </li>
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: need */}
            <li
              className="flex flex-col items-center justify-center gap-1 bg-[#c6b] w-20 h-16 cursor-pointer hover:opacity-80"
              onClick={() => setActiveModal("ranking")}
            >
              <GlobeIcon className="w-6" />
              <p>ランキング</p>
            </li>
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: need */}
            <li
              className="flex flex-col items-center justify-center gap-1 bg-[#5498B8] w-20 h-16 cursor-pointer hover:opacity-80"
              onClick={() => setActiveModal("share")}
            >
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
              年度・学年：
              <br />
              <strong>2025年度・マチカネ学期</strong>
            </p>
            <p className="font-bold pr-2">
              <span className="text-5xl mr-1 text-blue-700">
                {results?.score || 0}
              </span>
              <span className="text-xl mr-2 text-blue-700">/45</span>単位
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

      {/* 結果詳細モーダル */}
      <Modal
        isOpen={activeModal === "result"}
        onClose={closeModal}
        title="結果を見る"
      >
        <ul className="divide-y divide-gray-400">
          {SAMPLE_QUESTIONS.map((q) => (
            <li key={q.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold">
                  問題{q.id} {q.title}
                </h3>
                <div
                  className={`border rounded-full px-3 py-1 font-semibold text-sm ${getAnswerStatusColor(q.id)}`}
                >
                  {q.score}単位
                </div>
              </div>
              <p className="text-xs px-2">{q.text}</p>
              <input
                value={
                  results?.context.questionStates.find((qs) => qs.id === q.id)
                    ?.answer || "未回答"
                }
                className="w-full p-3 border border-gray-400 text-xs rounded-xs"
                disabled
              />
            </li>
          ))}
        </ul>
      </Modal>

      {/* 偏差値モーダル */}
      {/* TODO: 偏差値 */}
      <Modal
        isOpen={activeModal === "deviation"}
        onClose={closeModal}
        title="偏差値"
      >
        <div className="text-sm p-4">
          <div className="max-w-sm mx-auto">
            <div className="p-3 text-center">
              <h3 className="font-bold mb-2">あなたの偏差値は</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">???</div>
            </div>
            <div className="bg-blue-100 p-3 rounded text-center font-semibold">
              <p>これは、参加者の中で...</p>
              <p className="font-bold text-blue-600 text-lg my-1">
                上位<span className="text-xl mx-px">???</span>%
              </p>
              <p>に位置しています</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ランキングモーダル */}
      <Modal
        isOpen={activeModal === "ranking"}
        onClose={closeModal}
        title="ランキング"
      >
        <div className="text-sm p-4">
          <div className="p-3 mb-3 rounded">
            <h3 className="font-bold mb-2">あなたの順位</h3>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                第<span className="text-4xl mx-1">{results?.rank || "-"}</span>
                位
              </div>
              <div className="text-xs text-gray-600">
                {results?.score || 0}単位修得
              </div>
            </div>
          </div>
          <div className="bg-[#f0f0f0] p-3 rounded-md">
            <h3 className="font-bold mb-2">トップ5</h3>
            <div className="space-y-2">
              {results && results.top_five.length > 0 ? (
                results?.top_five.map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex justify-between items-center p-2 rounded ${team.group_id === results.group_id ? "bg-yellow-200 font-bold" : "bg-white"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-600 text-white"
                                : "bg-gray-200"
                        }`}
                      >
                        {team.rank}
                      </div>
                      <span className="text-xs">{team.group_name}</span>
                    </div>
                    <div className="text-xs font-bold text-orange-600">
                      {team.score}単位
                    </div>
                  </div>
                ))
              ) : (
                <div>ランキングデータがありません。</div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 共有モーダル */}
      <Modal
        isOpen={activeModal === "share"}
        onClose={closeModal}
        title="結果を共有"
      >
        <div className="text-sm p-6 space-y-5">
          <div>
            <h3 className="font-bold text-lg text-center mb-4">
              あなたの結果を共有しましょう！
            </h3>

            <div className="p-4 rounded-lg border-2 border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-800">
                    {results?.group_name || "不明"}
                  </p>
                  <p className="text-xs text-gray-500">マチカネ謎解き2025</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-gray-600 text-center mb-1">
                    修得単位数
                  </p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-3xl font-bold text-blue-600">
                      {results?.score || 0}
                    </span>
                    <span className="text-sm font-semibold text-blue-600 mb-1">
                      / 45 単位
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <p className="text-[10px] text-gray-600 mb-1">順位</p>
                    <p className="text-xl font-bold text-orange-600">
                      第{results?.rank || "?"}位
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <p className="text-[10px] text-gray-600 mb-1">偏差値</p>
                    {/* TODO: 偏差値 */}
                    <p className="text-xl font-bold text-green-600">??</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={encodeURI(
                `http://twitter.com/share?text=【${snsData.title}】\n${results?.score || 0}単位修得！第${results?.rank || "?"}位でした🎓\n${snsData.text}&hashtags=${snsData.hashtags.join(",")}`,
              )}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="w-full p-2 flex items-center justify-center gap-2 bg-black rounded-md text-white"
            >
              <XLogo className="w-4" />
              <p>Xでポスト</p>
            </a>
            <a
              href={
                isMobile
                  ? encodeURI(
                      `https://line.me/R/share?text=${`【${snsData.title}】\n${results?.score || 0}単位修得！第${results?.rank || "?"}位でした🎓\n${snsData.text}`}`,
                    )
                  : encodeURI(
                      `https://social-plugins.line.me/lineit/share?text=${`【${snsData.title}】\n${results?.score || 0}単位修得！第${results?.rank || "?"}位でした🎓\n${snsData.text}`}`,
                    )
              }
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="w-full p-1 flex items-center justify-center gap-2 bg-[#06c755] rounded-md text-white"
            >
              {/** biome-ignore lint/performance/noImgElement: need */}
              <img className="w-7" src="/line.webp" alt="line_logo" />
              <p>LINEで共有</p>
            </a>
            {/* TODO: Instagram Share */}
            <button
              type="button"
              className="w-full p-2 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-md text-white"
            >
              <InstagramLogo className="w-6" />
              <p>Instagramストーリーで共有</p>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Result;

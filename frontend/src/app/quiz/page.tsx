"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { submitQuizResults } from "@/lib/api";
import { QUIZ_TIME_LIMIT, SAMPLE_QUESTIONS } from "@/lib/constants";
import ClockIcon from "/public/clock.svg";

const QuizTestPage = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "all_questions" | "unanswered_questions"
  >("all_questions");
  const router = useRouter();

  // ローカルストレージからgroupIdを取得してから初期化
  useEffect(() => {
    const initializeQuiz = () => {
      try {
        setIsInitializing(true);

        const storedGroupId = localStorage.getItem("groupId");
        if (storedGroupId) {
          setGroupId(storedGroupId);
        } else {
          alert("グループIDが見つかりません。グループ登録ページへ移動します。");
          router.push("/register");
        }
      } catch (error) {
        console.error("Failed to initialize quiz:", error);
        alert("クイズの初期化に失敗しました。ページをリロードしてください。");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeQuiz();
  }, [router]);

  // groupIdが確定してからuseQuizProgressを初期化
  const {
    context,
    isLoading,
    updateMultipleAnswers,
    saveProgress,
    clearProgress,
    generateSubmissionData,
  } = useQuizProgress({
    groupId: groupId || "",
    totalQuestions: SAMPLE_QUESTIONS.length,
    enabled: !!groupId, // groupIdが存在する場合のみ有効化
  });

  // コンテキストが更新されたら、ローカル状態と保存状態に反映
  useEffect(() => {
    if (context?.QuestionAnswerState) {
      const contextAnswers: Record<number, string> = {};
      context.QuestionAnswerState.forEach((state) => {
        if (state.answer) {
          contextAnswers[state.id] = state.answer;
        }
      });
      setLocalAnswers(contextAnswers);
    }
  }, [context]);

  // クイズの進行状況(回答数, 時間関連)
  const answeredCount =
    context?.QuestionAnswerState.filter((q) => q.answer?.trim()).length || 0;
  const timeProgress = context
    ? (() => {
        const elapsedTime = Math.floor(
          (currentTime.getTime() - context.startedAt.getTime()) / 1000,
        );
        const remainingTime = Math.max(0, QUIZ_TIME_LIMIT - elapsedTime);
        const timePercentage = Math.max(
          0,
          Math.round((remainingTime / QUIZ_TIME_LIMIT) * 100),
        );
        const isTimeUp = remainingTime === 0;

        return {
          elapsed: elapsedTime,
          remaining: remainingTime,
          percentage: timePercentage,
          isTimeUp,
          formattedRemaining: `${Math.floor(remainingTime / 60)}分${String(remainingTime % 60).padStart(2, "0")}秒`,
        };
      })()
    : {
        elapsed: 0,
        remaining: QUIZ_TIME_LIMIT,
        percentage: 100,
        isTimeUp: false,
        formattedRemaining: `${Math.floor(QUIZ_TIME_LIMIT / 60)}分00秒`,
      };

  // 現在時刻を毎秒更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 現在の回答状況を保存
  const handleSaveProgress = () => {
    try {
      // ローカル回答を一括でコンテキストに反映
      const answers = Object.entries(localAnswers).map(
        ([questionId, answer]) => ({
          questionId: Number(questionId),
          answer,
        }),
      );
      updateMultipleAnswers(answers);
      saveProgress();
      setLastSavedAt(
        new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      alert("回答状況を保存しました！");
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("回答状況の保存に失敗しました。");
    }
  };

  // 結果送信のテスト
  const _handleSubmitResults = () => {
    try {
      submitQuizResults(generateSubmissionData());
      localStorage.removeItem("groupId");
      localStorage.removeItem(`quiz_progress_${groupId}`);
      // TODO: 実際はAPIの結果を確認して成功/失敗を判定
      alert("結果が送信されました！（コンソールを確認してください）");
    } catch (error) {
      console.error("Failed to submit results:", error);
      alert("結果の送信に失敗しました。");
    }
  };

  // フィルター機能：表示する問題を決定（保存された状態を基準にする）
  const filteredQuestions =
    filterType === "unanswered_questions"
      ? context?.QuestionAnswerState.map((q) =>
          !q.answer?.trim()
            ? SAMPLE_QUESTIONS.find((sq) => sq.id === q.id)
            : null,
        ).filter((q) => !!q) || []
      : SAMPLE_QUESTIONS;

  // TODO: UI班要相談変更
  const getAnswerStatusColor = (questionId: number) => {
    if (
      context?.QuestionAnswerState.find(
        (q) => q.id === questionId,
      )?.answer?.trim()
    )
      return "text-green-600 bg-green-100";
    else if (localAnswers[questionId]?.trim())
      return "text-yellow-600 bg-yellow-100";
    else return "text-gray-600 bg-white";
  };
  // TODO: UI班要相談変更
  const getTimeStatusColor = () => {
    if (timeProgress.percentage > 50) return ["bg-[#c8e8d3]", "bg-[#007c2a]"];
    else return ["bg-[#ecd0f1]", "bg-[#a234b5]"];
  };

  // 初期化待ちまたはクイズデータの読み込み中
  if (isInitializing || !groupId || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isInitializing
              ? "初期化中..."
              : !groupId
                ? "グループIDを取得中..."
                : "クイズデータを読み込み中..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col mb-12">
        <div className="fixed top-0 left-0 right-0">
          <div className="bg-[#2c2880] h-10 flex items-center justify-center text-white">
            <p className="font-bold">謎解き試験</p>
          </div>
          <div className="bg-white pt-4 px-3 pb-2">
            <div className="text-xs border-b border-gray-400 pb-2 space-y-1">
              <div
                className={`${getTimeStatusColor()[0]} rounded-full h-2 mb-2`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getTimeStatusColor()[1]}`}
                  style={{
                    width: `${timeProgress.percentage}%`,
                  }}
                />
              </div>
              <p className="">
                {SAMPLE_QUESTIONS.length}問中
                <strong>{SAMPLE_QUESTIONS.length - answeredCount}</strong>
                問の問題が残っています
              </p>
              <p className="flex items-center gap-px">
                <ClockIcon className="w-4 h-4 text-[#a234b5]" />
                {timeProgress.formattedRemaining}残っています
              </p>
            </div>
          </div>
        </div>
        <div className="pt-34 pb-20 px-3">
          <h2>試験問題</h2>
          {filterType === "unanswered_questions" &&
            filteredQuestions.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>すべての問題に回答済みです！</p>
                <p className="text-xs mt-2">
                  「全問題を表示」を選択して確認してください。
                </p>
              </div>
            )}
          <ul className="divide-y divide-gray-400">
            {filteredQuestions.map((q) => (
              <li key={q.id} className="py-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    問題{q.id} {q.title}
                  </h3>
                  <div
                    className={`border rounded-full px-3 py-1 font-bold text-sm ${getAnswerStatusColor(q.id)}`}
                  >
                    {q.score}単位
                  </div>
                </div>
                <p className="text-xs px-2">{q.text}</p>
                <input
                  value={localAnswers[q.id] || ""}
                  onChange={(e) => {
                    setLocalAnswers((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }));
                  }}
                  placeholder="回答を入力してください..."
                  className="w-full p-3 border border-gray-400 text-xs rounded-xs"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-[#f8f8f8] border-t border-gray-400 p-3">
          <p className="text-xs text-center mb-2">
            {lastSavedAt !== "" ? `最終保存: ${lastSavedAt}` : "未保存"}
          </p>
          <div className="flex gap-x-3 mb-3">
            <div className="text-xs bg-white px-3 py-1 border">
              問題フィルタ (2)
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="filter"
                id="filter-all"
                value="all_questions"
                checked={filterType === "all_questions"}
                onChange={() => setFilterType("all_questions")}
                className="mr-px"
              />
              <label htmlFor="filter-all" className="text-xs">
                全問題を表示
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="filter"
                id="filter-unanswered"
                value="unanswered_questions"
                checked={filterType === "unanswered_questions"}
                onChange={() => setFilterType("unanswered_questions")}
                className="mr-px"
              />
              <label htmlFor="filter-unanswered" className="text-xs">
                未回答問題を表示
              </label>
            </div>
          </div>
          <div className="w-full flex gap-x-2">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="w-full bg-[#cdcdcd] hover:bg-[#bababa] text-[#2b2b2b] text-xs px-3 py-2 transition-colors"
            >
              回答内容を保存
            </button>
            {/* TODO: debug用要削除 */}
            <button
              type="button"
              onClick={() => {
                clearProgress();
                setLastSavedAt("");
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 transition-colors"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTestPage;

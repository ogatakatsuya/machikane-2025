"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useTimer } from "@/hooks/useTimer";
import { submitQuizResults } from "@/lib/api";
import { QUIZ_TIME_LIMIT, SAMPLE_QUESTIONS } from "@/lib/constants";
import ClockIcon from "/public/clock.svg";

const QuizPage = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "all_questions" | "unanswered_questions"
  >("all_questions");
  const router = useRouter();
  const hasInitializedRef = useRef(false);
  const localAnswersRef = useRef<Record<number, string>>({});

  // ローカルストレージからgroupIdを取得してから初期化
  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

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
        hasInitializedRef.current = true;
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
    generateSubmissionData,
  } = useQuizProgress({
    groupId: groupId || "",
    totalQuestions: SAMPLE_QUESTIONS.length,
    enabled: !!groupId, // groupIdが存在する場合のみ有効化
  });

  useEffect(() => {
    localAnswersRef.current = localAnswers;
  }, [localAnswers]);

  // コンテキストが更新されたら、ローカル状態と保存状態に反映（初回のみ）
  const hasLoadedContextRef = useRef(false);
  useEffect(() => {
    if (context?.QuestionAnswerState && !hasLoadedContextRef.current) {
      const contextAnswers: Record<number, string> = {};
      context.QuestionAnswerState.forEach((state) => {
        if (state.answer) {
          contextAnswers[state.id] = state.answer;
        }
      });
      setLocalAnswers(contextAnswers);
      hasLoadedContextRef.current = true;
    }
  }, [context]);

  // 現在の回答状況を保存（デバウンス処理）
  const handleSaveProgressInternal = useCallback(() => {
    try {
      const currentAnswers = { ...localAnswersRef.current };
      const answers = Object.entries(currentAnswers).map(
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
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("回答状況の保存に失敗しました。");
    }
  }, [updateMultipleAnswers, saveProgress]);

  // デバウンスされた保存処理
  const handleSaveProgress = useDebouncedCallback(
    handleSaveProgressInternal,
    3000,
  );

  // 結果画面へ移動
  const goToResults = useCallback(async () => {
    try {
      const submission = generateSubmissionData();
      await submitQuizResults(submission);

      localStorage.removeItem("quiz_submission");
      localStorage.removeItem(`quiz_progress_${groupId}`);
      router.push(`/result?groupId=${groupId}`);
      localStorage.removeItem("groupId");
    } catch (error) {
      console.error("Failed to submit results:", error);
      alert("結果の送信に失敗しました。通信状況をご確認ください。");
    }
  }, [groupId, generateSubmissionData, router]);

  // 時間終了時のコールバック
  const onTimeUp = useCallback(() => {
    alert("制限時間が終了しました。回答内容を保存して結果画面へ移動します。");
    handleSaveProgressInternal();
    goToResults();
  }, [handleSaveProgressInternal, goToResults]);

  // クイズの進行状況(回答数, 時間関連)
  const answeredCount =
    context?.QuestionAnswerState.filter((q) => q.answer?.trim()).length || 0;
  const remainingTime = useTimer(context?.startedAt, QUIZ_TIME_LIMIT, onTimeUp);

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
    if (remainingTime && remainingTime >= 60)
      return ["bg-[#c8e8d3]", "bg-[#007c2a]"];
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
              {remainingTime ? (
                <div
                  className={`${getTimeStatusColor()[0]} rounded-full h-2 mb-2`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getTimeStatusColor()[1]}`}
                    style={{
                      width: `${(remainingTime / QUIZ_TIME_LIMIT) * 100}%`,
                    }}
                  />
                </div>
              ) : null}
              <p className="">
                {SAMPLE_QUESTIONS.length}問中
                <strong>{SAMPLE_QUESTIONS.length - answeredCount}</strong>
                問の問題が残っています
              </p>
              <p className="flex items-center gap-px">
                <ClockIcon className="w-4 h-4 text-[#a234b5]" />
                {remainingTime
                  ? `${Math.floor(remainingTime / 60)}分${String(remainingTime % 60).padStart(2, "0")}秒残っています`
                  : "--:--"}
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
                    handleSaveProgress();
                  }}
                  placeholder="回答を入力してください..."
                  className="w-full p-3 border border-gray-400 text-xs rounded-xs"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-[#f8f8f8] border-t border-gray-400 p-3 space-y-2">
          <p className="text-xs text-center">
            {lastSavedAt !== "" ? `最終保存: ${lastSavedAt}` : "未保存"}
          </p>
          <div className="flex gap-x-3">
            <div className="text-xs bg-white px-3 py-1 border">
              問題フィルタ ({filteredQuestions.length})
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
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

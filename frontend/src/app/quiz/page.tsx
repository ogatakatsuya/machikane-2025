"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { submitQuizResults } from "@/lib/api";
import { QUIZ_TIME_LIMIT, SAMPLE_QUESTIONS } from "@/lib/constants";

const QuizTestPage = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localAnswers, setLocalAnswers] = useState<Record<number, string>>({});
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

  // コンテキストが更新されたら、ローカル状態に反映
  useEffect(() => {
    if (context?.QuestionAnswerState) {
      const existingAnswers: Record<number, string> = {};
      context.QuestionAnswerState.forEach((state) => {
        if (state.answer) {
          existingAnswers[state.id] = state.answer;
        }
      });
      setLocalAnswers(existingAnswers);
    }
  }, [context]);

  const _isFinished = Object.values(localAnswers).every(
    (ans) => ans.trim() !== "",
  );
  const answeredCount = Object.values(localAnswers).filter(
    (ans) => ans.trim() !== "",
  ).length;

  // 残り時間の計算
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

  // ローカル回答を更新
  const handleAnswerChange = (questionId: number, answer: string) => {
    setLocalAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

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
      alert("回答状況を保存しました！");
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("回答状況の保存に失敗しました。");
    }
  };

  // 結果送信のテスト
  const handleSubmitResults = () => {
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

  const getStatusColor = (questionId: number) => {
    if (localAnswers[questionId]?.trim()) return "text-green-600 bg-green-100";
    else return "text-gray-600 bg-gray-100";
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
            <div className="text-xs border-b border-gray-400 pb-2">
              <div className="bg-[#ecd0f1] rounded-full h-2 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-300 bg-[#a234b5]"
                  style={{
                    width: `${(answeredCount / SAMPLE_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
              <p>
                {SAMPLE_QUESTIONS.length}問中
                <strong>{SAMPLE_QUESTIONS.length - answeredCount}</strong>
                問の問題が残っています
              </p>
              <p>{timeProgress.formattedRemaining}残っています！</p>
              <div className="mt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={handleSaveProgress}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200 font-medium"
                >
                  回答状況を保存
                </button>
                <button
                  type="button"
                  onClick={clearProgress}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200 font-medium"
                >
                  リセット
                </button>
                <button
                  type="button"
                  onClick={handleSubmitResults}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200 font-medium"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-40 px-3">
          <h2>試験問題</h2>
          <ul>
            {SAMPLE_QUESTIONS.map((q) => (
              <li
                key={q.id}
                className="py-6 border-b border-gray-300 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    <span className="border-2 rounded-full px-1 mr-px">
                      {q.id}
                    </span>
                    {q.title}
                  </h3>
                  <div
                    className={`border rounded-full px-3 py-1 font-bold text-sm ${getStatusColor(q.id)}`}
                  >
                    {q.score}単位
                  </div>
                </div>
                <p className="text-xs px-2">{q.text}</p>
                <input
                  value={localAnswers[q.id] || ""}
                  onChange={(e) => {
                    handleAnswerChange(q.id, e.target.value);
                  }}
                  placeholder="回答を入力してください..."
                  className="w-full p-3 border text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizTestPage;

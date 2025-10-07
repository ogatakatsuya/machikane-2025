"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionComponent from "@/components/QuestionComponent";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { submitQuizResults } from "@/lib/api";
import { QuestionStatus } from "@/lib/quiz-types";

// サンプル問題データ
const SAMPLE_QUESTIONS = [
  { id: 1, text: "1 + 1 = ?", answer: ["2", "田"] },
  {
    id: 2,
    text: "日本の首都は?",
    answer: ["東京", "とうきょう", "Tokyo", "トウキョウ"],
  },
  { id: 3, text: "TypeScript の T は何の略?", answer: ["Type"] },
];

// クイズの制限時間（秒）
const QUIZ_TIME_LIMIT = 10 * 60;

const QuizTestPage = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  // セッションストレージからgroupIdを取得してから初期化
  useEffect(() => {
    const initializeQuiz = async () => {
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
    updateQuestionStatus,
    getQuestionState,
    saveProgress,
    clearProgress,
    generateSubmissionData,
    debug,
  } = useQuizProgress({
    groupId: groupId || "", // groupIdがnullの場合は空文字
    totalQuestions: SAMPLE_QUESTIONS.length,
    enabled: !!groupId, // groupIdが存在する場合のみ有効化
  });

  const isFinished = context
    ? context.questionStates.every((q) => q.status === QuestionStatus.CORRECT)
    : false;

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
          formattedRemaining: `${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, "0")}`,
        };
      })()
    : {
        elapsed: 0,
        remaining: QUIZ_TIME_LIMIT,
        percentage: 100,
        isTimeUp: false,
        formattedRemaining: `${Math.floor(QUIZ_TIME_LIMIT / 60)}:00`,
      };

  // 現在時刻を毎秒更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (
    questionId: number,
    status: QuestionStatus,
    answer: string,
  ) => {
    if (timeProgress.isTimeUp) {
      alert("時間切れのため、これ以上回答できません。");
      return;
    }
    updateQuestionStatus(questionId, status, answer);
  };

  // 結果送信のテスト
  const handleSubmitResults = async () => {
    try {
      submitQuizResults(generateSubmissionData());
      // TODO: 実際はAPIの結果を確認して成功/失敗を判定
      alert("結果が送信されました！（コンソールを確認してください）");
    } catch (error) {
      console.error("Failed to submit results:", error);
      alert("結果の送信に失敗しました。");
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            クイズ進捗管理テスト
          </h1>
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">グループID:</span> {groupId}
          </div>

          {/* 残り時間表示 */}
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                timeProgress.percentage > 30
                  ? "bg-green-600"
                  : timeProgress.percentage > 10
                    ? "bg-yellow-600"
                    : "bg-red-600"
              }`}
              style={{ width: `${timeProgress.percentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span
              className={`font-medium ${
                timeProgress.percentage <= 10
                  ? "text-red-600"
                  : timeProgress.percentage <= 30
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              残り時間: {timeProgress.formattedRemaining}
            </span>
            <span className="text-gray-500">
              経過時間: {Math.floor(timeProgress.elapsed / 60)}:
              {String(timeProgress.elapsed % 60).padStart(2, "0")}
            </span>
          </div>

          {timeProgress.isTimeUp && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              ⏰ 時間切れです！クイズを終了してください。
            </div>
          )}

          {!timeProgress.isTimeUp && isFinished && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              🎉 全ての問題が完了しました！
            </div>
          )}

          {/* 操作ボタン */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveProgress()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              手動保存
            </button>

            <button
              type="button"
              onClick={clearProgress}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              進捗リセット
            </button>

            <button
              type="button"
              onClick={debug}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              デバッグ出力
            </button>

            {(isFinished || timeProgress.isTimeUp) && (
              <button
                type="button"
                onClick={handleSubmitResults}
                className={`text-white px-4 py-2 rounded ${
                  timeProgress.isTimeUp
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {timeProgress.isTimeUp ? "時間切れ - 結果を送信" : "結果を送信"}
              </button>
            )}
          </div>
        </div>

        {/* 問題一覧 */}
        <div className="space-y-4">
          {SAMPLE_QUESTIONS.map((question) => {
            const questionState = getQuestionState(question.id) || {
              id: question.id,
              status: QuestionStatus.UNANSWERED,
              answer: undefined,
              attempts: 0,
            };

            return (
              <div key={question.id} className="bg-white rounded-lg shadow-md">
                <QuestionComponent
                  questionId={question.id}
                  questionText={question.text}
                  questionAnswer={question.answer}
                  questionState={questionState}
                  onAnswer={handleAnswer}
                />
              </div>
            );
          })}
        </div>

        {/* 復帰テスト説明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            🧪 クイズ機能テスト手順
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>
              グループ登録（/register）でグループIDをローカルストレージに保存
            </li>
            <li>いくつか問題に回答してください（時間制限: 10分）</li>
            <li>
              ページをリロード（F5）またはブラウザを閉じて再度開いてください
            </li>
            <li>グループID、回答状態、残り時間が復帰されることを確認</li>
            <li>時間切れ時の動作をテスト（回答無効化、強制終了）</li>
            <li>開発者ツールのコンソールでデータを確認できます</li>
          </ol>

          <div className="mt-4 space-y-3">
            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <p className="text-orange-800 font-medium">⏰ 時間管理機能</p>
              <ul className="text-orange-700 text-sm mt-2 space-y-1">
                <li>
                  <strong>制限時間:</strong>{" "}
                  10分（ヘッダーのプログレスバーで可視化）
                </li>
                <li>
                  <strong>色分け:</strong> 緑（余裕）→ 黄（注意）→ 赤（緊急）
                </li>
                <li>
                  <strong>時間切れ時:</strong> 回答無効化、強制終了モード
                </li>
                <li>
                  <strong>復帰時:</strong> 経過時間も正しく復元されます
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTestPage;

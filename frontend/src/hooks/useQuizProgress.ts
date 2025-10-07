import { useCallback, useEffect, useRef, useState } from "react";
import { QuizProgressManager } from "@/lib/quiz-progress-manager";
import type {
  QuestionState,
  QuestionStatus,
  QuizContext,
  SerializedQuizContext,
} from "@/lib/quiz-types";

interface UseQuizProgressOptions {
  groupId: string;
  totalQuestions: number;
  enabled?: boolean; // 初期化を制御するフラグ
}

interface UseQuizProgressReturn {
  context: QuizContext | null;
  isLoading: boolean;
  updateQuestionStatus: (
    questionId: number,
    status: QuestionStatus,
    answer: string,
  ) => void;
  getQuestionState: (questionId: number) => QuestionState | undefined;
  saveProgress: () => Promise<void>;
  clearProgress: () => void;
  generateSubmissionData: () => SerializedQuizContext;

  // デバッグ用
  // TODO: 開発完了後に削除予定
  debug: () => void;
}

/**
 * クイズの進捗管理Hook
 */
export const useQuizProgress = (
  options: UseQuizProgressOptions,
): UseQuizProgressReturn => {
  const { groupId, totalQuestions, enabled = true } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<QuizContext | null>(null);
  const managerRef = useRef<QuizProgressManager | null>(null);

  // 初期化
  useEffect(() => {
    if (!enabled || !groupId) {
      setIsLoading(false);
      return;
    }

    const initializeManager = async () => {
      setIsLoading(true);

      try {
        const manager = new QuizProgressManager(groupId, totalQuestions);
        managerRef.current = manager;
        setContext(manager.getContext());
      } catch (error) {
        console.error("Failed to initialize quiz progress manager:", error);
        alert("進捗の初期化に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    initializeManager();
  }, [enabled, groupId, totalQuestions]);

  // ブラウザ終了時の保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (managerRef.current) {
        // ブラウザ終了時には必ず保存
        managerRef.current.saveToStorage();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 問題状態の更新（解答時に保存）
  const updateQuestionStatus = useCallback(
    async (questionId: number, status: QuestionStatus, answer: string) => {
      if (!managerRef.current) {
        console.error("Quiz progress manager not initialized");
        alert("進捗の更新に失敗しました。（初期化されていません）");
        return;
      }

      try {
        managerRef.current.updateQuestionStatus(questionId, status, answer);
        setContext(managerRef.current.getContext());
        managerRef.current.saveToStorage(); // 自動保存
      } catch (error) {
        console.error(
          "Failed to update question status or save progress:",
          error,
        );
        alert("進捗の更新に失敗しました。");
      }
    },
    [],
  );

  // 特定の問題状態を取得
  const getQuestionState = useCallback(
    (questionId: number): QuestionState | undefined => {
      if (!managerRef.current) return undefined;
      return managerRef.current.getQuestionState(questionId);
    },
    [],
  );

  // 手動保存
  const saveProgress = useCallback(async (): Promise<void> => {
    if (!managerRef.current) {
      alert("進捗の保存に失敗しました。（初期化されていません）");
      throw new Error("Quiz progress manager not initialized");
    }

    try {
      managerRef.current.saveToStorage();
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("進捗の保存に失敗しました。");
    }
  }, []);

  // 進捗クリア
  const clearProgress = useCallback(() => {
    if (!managerRef.current) return;

    managerRef.current.clearStorage();

    // 新しいマネージャーを作成
    const newManager = new QuizProgressManager(groupId, totalQuestions);
    managerRef.current = newManager;

    setContext(newManager.getContext());
  }, [groupId, totalQuestions]);

  // API送信用データ生成
  const generateSubmissionData = useCallback((): SerializedQuizContext => {
    if (!managerRef.current) {
      alert("進捗の読み込みに失敗しました。（初期化されていません）");
      throw new Error("Quiz progress manager not initialized");
    }
    return managerRef.current.generateSubmissionData();
  }, []);

  // デバッグ出力
  // TODO: 開発完了後に削除予定
  const debug = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.debug();
    }
  }, []);

  return {
    context,
    isLoading,
    updateQuestionStatus,
    getQuestionState,
    saveProgress,
    clearProgress,
    generateSubmissionData,
    debug,
  };
};

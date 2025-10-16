import { useCallback, useEffect, useRef, useState } from "react";
import { QuizProgressManager } from "@/lib/quiz-progress-manager";
import type { QuizContext, QuizSubmissionData } from "@/lib/quiz-types";

interface UseQuizProgressOptions {
  groupId: string;
  totalQuestions: number;
  enabled?: boolean; // 初期化を制御するフラグ
}

interface UseQuizProgressReturn {
  context: QuizContext | null;
  isLoading: boolean;
  updateMultipleAnswers: (
    answers: { questionId: number; answer: string }[],
  ) => void;
  saveProgress: () => void;
  clearProgress: () => void;
  generateSubmissionData: () => QuizSubmissionData;
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

    const initializeManager = () => {
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

  // 複数の回答を一括更新（保存はしない）
  const updateMultipleAnswers = useCallback(
    (answers: { questionId: number; answer: string }[]): void => {
      if (!managerRef.current) {
        console.error("Quiz progress manager not initialized");
        alert("進捗の更新に失敗しました。（初期化されていません）");
        return;
      }

      try {
        managerRef.current.updateMultipleAnswers(answers);
        setContext(managerRef.current.getContext());
      } catch (error) {
        console.error("Failed to update multiple answers:", error);
        alert("進捗の更新に失敗しました。");
      }
    },
    [],
  );

  // 手動保存
  const saveProgress = useCallback((): void => {
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
  const generateSubmissionData = useCallback((): QuizSubmissionData => {
    if (!managerRef.current) {
      alert("進捗の読み込みに失敗しました。（初期化されていません）");
      throw new Error("Quiz progress manager not initialized");
    }
    return managerRef.current.generateSubmissionData();
  }, []);

  return {
    context,
    isLoading,
    updateMultipleAnswers,
    saveProgress,
    clearProgress,
    generateSubmissionData,
  };
};

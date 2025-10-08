import type { QuizContext, SerializedQuizContext } from "@/lib/quiz-types";

/**
 * クイズの進捗状況を管理するクラス
 * ブラウザストレージとの同期、状態更新、API送信データの生成を担当
 */
export class QuizProgressManager {
  private context: QuizContext;
  private storageKey: string;

  constructor(groupId: string, totalQuestions: number) {
    this.storageKey = `quiz_progress_${groupId}`;

    const restoredContext = this.tryLoadFromStorage(groupId);
    if (restoredContext) {
      this.context = restoredContext;
    } else {
      this.context = this.createNewContext(groupId, totalQuestions);
    }
    this.saveToStorage();
  }

  /**
   * 新規コンテキストを作成
   */
  private createNewContext(
    groupId: string,
    totalQuestions: number,
  ): QuizContext {
    return {
      groupId,
      startedAt: new Date(),
      totalQuestions,
      QuestionAnswerState: Array.from({ length: totalQuestions }, (_, i) => ({
        id: i + 1,
      })),
    };
  }

  /**
   * ローカルストレージからの復元を試行
   */
  private tryLoadFromStorage(groupId: string): QuizContext | null {
    try {
      const storageKey = `quiz_progress_${groupId}`;
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        return null;
      }

      const serialized: SerializedQuizContext = JSON.parse(stored);

      // デシリアライゼーションしてコンテキストを復元
      return {
        groupId: serialized.groupId,
        startedAt: new Date(serialized.startedAt),
        totalQuestions: serialized.totalQuestions,
        QuestionAnswerState: serialized.QuestionAnswerState,
      };
    } catch (error) {
      console.warn("Failed to load from localStorage:", error);
      alert("進捗の復元に失敗しました。新しいセッションを開始します。");
      return null;
    }
  }

  /**
   * 複数の問題の回答を一括更新
   */
  updateMultipleAnswers(
    answers: { questionId: number; answer: string }[],
  ): void {
    answers.forEach(({ questionId, answer }) => {
      const questionIndex = this.context.QuestionAnswerState.findIndex(
        (q) => q.id === questionId,
      );

      if (questionIndex !== -1) {
        this.context.QuestionAnswerState[questionIndex] = {
          ...this.context.QuestionAnswerState[questionIndex],
          answer: answer.trim() || undefined,
        };
      }
    });
  }

  /**
   * コンテキスト全体を取得
   */
  getContext(): QuizContext {
    return { ...this.context };
  }

  /**
   * ローカルストレージに保存
   */
  saveToStorage(): void {
    try {
      const serialized: SerializedQuizContext = {
        groupId: this.context.groupId,
        startedAt: this.context.startedAt.toISOString(),
        totalQuestions: this.context.totalQuestions,
        QuestionAnswerState: this.context.QuestionAnswerState,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(serialized));
    } catch (error) {
      console.error("Failed to save quiz progress to localStorage:", error);
      alert("進捗の保存に失敗しました。");
    }
  }

  /**
   * API送信用データを生成
   */
  generateSubmissionData(): SerializedQuizContext {
    // TODO: 計算してcorrect/incorrectのステータスを含める
    return {
      groupId: this.context.groupId,
      startedAt: this.context.startedAt.toISOString(),
      totalQuestions: this.context.totalQuestions,
      QuestionAnswerState: this.context.QuestionAnswerState.filter(
        (state) => state.answer !== undefined,
      ),
    };
  }

  /**
   * ストレージをクリア
   */
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }
}

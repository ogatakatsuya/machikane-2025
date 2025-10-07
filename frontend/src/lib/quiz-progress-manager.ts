import {
  type QuestionState,
  QuestionStatus,
  type QuizContext,
  type SerializedQuizContext,
} from "@/lib/quiz-types";

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
      lastUpdatedAt: new Date(),
      totalQuestions,
      questionStates: Array.from({ length: totalQuestions }, (_, i) => ({
        id: i + 1,
        status: QuestionStatus.UNANSWERED,
        attempts: 0,
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

      // デシリアライズしてコンテキストを復元
      return {
        groupId: serialized.groupId,
        startedAt: new Date(serialized.startedAt),
        lastUpdatedAt: new Date(serialized.lastUpdatedAt),
        totalQuestions: serialized.totalQuestions,
        questionStates: serialized.questionStates.map(
          (state: QuestionState<string>) => ({
            ...state,
            answeredAt: state.answeredAt
              ? new Date(state.answeredAt)
              : undefined,
          }),
        ),
      };
    } catch (error) {
      console.warn("Failed to load from localStorage:", error);
      alert("進捗の復元に失敗しました。新しいセッションを開始します。");
      return null;
    }
  }

  /**
   * 問題の状態を更新
   */
  updateQuestionStatus(
    questionId: number,
    status: QuestionStatus,
    answer: string,
  ): void {
    const questionIndex = this.context.questionStates.findIndex(
      (q) => q.id === questionId,
    );

    if (questionIndex === -1) {
      throw new Error(`Question with id ${questionId} not found`);
    }

    // 状態を更新
    const currentState = this.context.questionStates[questionIndex];
    this.context.questionStates[questionIndex] = {
      ...currentState,
      status,
      answer,
      answeredAt: new Date(),
      attempts: currentState.attempts + 1,
    };
    this.context.lastUpdatedAt = new Date();
  }

  /**
   * 特定の問題の状態を取得
   */
  getQuestionState(questionId: number): QuestionState | undefined {
    return this.context.questionStates.find((q) => q.id === questionId);
  }

  /**
   * すべての問題状態を取得
   */
  getAllQuestionStates(): QuestionState[] {
    return [...this.context.questionStates];
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
        lastUpdatedAt: this.context.lastUpdatedAt.toISOString(),
        totalQuestions: this.context.totalQuestions,
        questionStates: this.context.questionStates.map((state) => ({
          ...state,
          answeredAt: state.answeredAt?.toISOString(),
        })),
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
    return {
      groupId: this.context.groupId,
      startedAt: this.context.startedAt.toISOString(),
      lastUpdatedAt: this.context.lastUpdatedAt.toISOString(),
      totalQuestions: this.context.totalQuestions,
      questionStates: this.context.questionStates
        .filter((state) => state.status !== QuestionStatus.UNANSWERED)
        .map((state) => ({
          id: state.id,
          status: state.status,
          answer: state.answer,
          answeredAt: state.answeredAt?.toISOString(),
          attempts: state.attempts,
        })),
    };
  }

  /**
   * ストレージをクリア
   */
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * デバッグ用：コンテキストをコンソールに出力
   * TODO: 開発完了後に削除予定
   */
  debug(): void {
    console.log("Quiz Progress Manager Context:");
    console.table(this.context);
  }
}

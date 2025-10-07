// 問題の解答状態
export enum QuestionStatus {
  UNANSWERED = "unanswered",
  CORRECT = "correct",
  INCORRECT = "incorrect",
}

// 個別の問題状態
export interface QuestionState<TDate = Date> {
  id: number;
  status: QuestionStatus;
  answer?: string;
  answeredAt?: TDate;
  attempts: number;
}

export interface QuizData<TDate = string> {
  groupId: string;
  startedAt: TDate;
  lastUpdatedAt: TDate;
  totalQuestions: number;
  questionStates: Array<{
    id: number;
    status: QuestionStatus;
    answer?: string;
    answeredAt?: TDate;
    attempts: number;
  }>;
}

// 実行時用の型エイリアス（Dateオブジェクト使用）
export type QuizContext = QuizData<Date>;

// シリアライズ用の型エイリアス（文字列使用）
export type SerializedQuizContext = QuizData<string>;

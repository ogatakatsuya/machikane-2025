export type QuestionType = {
  id: number;
  title: string;
  text: string;
  score: number;
  answer: string[];
};

// 問題の解答状態
export enum QuestionStatus {
  UNANSWERED = "unanswered",
  CORRECT = "correct",
  INCORRECT = "incorrect",
}

// 個別の問題状態
export interface QuestionState {
  id: number;
  status: QuestionStatus;
  answer?: string;
}

export interface QuestionAnswerState {
  id: number;
  answer?: string;
}

export interface QuizData<TDate = string> {
  groupId: string;
  startedAt: TDate;
  totalQuestions: number;
  QuestionAnswerState: Array<QuestionAnswerState>;
}

// 実行時用の型エイリアス（Dateオブジェクト使用）
export type QuizContext = QuizData<Date>;

// シリアライズ用の型エイリアス（文字列使用）
export type SerializedQuizContext = QuizData<string>;

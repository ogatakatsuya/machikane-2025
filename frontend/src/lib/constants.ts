import type { QuestionType } from "./quiz-types";

// API Constants
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// App Constants
export const RANGE = { min: 1, max: 4 } as const;

// Sample Questions and Time Limits
export const SAMPLE_QUESTIONS: QuestionType[] = [
  { id: 1, title: "足し算", score: 1, text: "1 + 1 = ?", answer: ["2", "田"] },
  {
    id: 2,
    title: "地理",
    score: 2,
    text: "日本の首都は?",
    answer: ["東京", "とうきょう", "Tokyo", "トウキョウ"],
  },
  {
    id: 3,
    title: "プログラミング",
    score: 3,
    text: "TypeScript の T は何の略?",
    answer: ["Type"],
  },
];
export const QUIZ_TIME_LIMIT = 10 * 60;

export const WARNING_LIST = [
  "テストは静かな場所で受けてください。",
  "他の人の答案を見ないでください。",
  "時間を守り、途中退出はできません。",
  "試験用紙は丁寧に扱ってください。",
  "不明な点があれば、試験監督に質問してください。",
];

export const IMPORTANT_NOTICE = ["重要なお知らせはここに表示されます。"];

export type FeedBackEntry = {
  credits: string;
  comment: string;
  image: string;
};
export const TimeToDisplayHint: number[] = [180, 120, 270];
export const TimePerQuizSet: number = 600;
export const FeedBack: { [key: string]: FeedBackEntry } = {
  S: {
    credits: "S",
    comment:
      "素晴らしい成績です！あなたの謎解き力は非常に高水準であり、何故追試だったのか不思議なレベルです。",
    image: "/S.png",
  },
  A: {
    credits: "A",
    comment:
      "良い成績です。謎解き力は高いですが、最後の詰めが必要でした。S評価まであと少しのところまで迫っています。",
    image: "/A.png",
  },
  B: {
    credits: "B",
    comment:
      "おおむね良い成績ですが、いくつか危ないポイントがありました。今後はもう少し深い考察ができるように努力に励んでください。",
    image: "/B.png",
  },
  C: {
    credits: "C",
    comment:
      "努力の跡は見えますが、全体として謎解き力の底上げが必要です。頭を柔軟に用いて正解まで導く練習を行いましょう。次回の試験に期待しています。",
    image: "/C.png",
  },
  F: {
    credits: "F",
    comment:
      "残念ですが、今回の結果は合格基準を満たしませんでした。基礎固めをして謎解き力の底上げに努めてください。次回の試験に期待しています。",
    image: "/F.png",
  },
};

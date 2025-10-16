import type { QuestionType } from "./quiz-types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const RANGE = { min: 1, max: 4 } as const;
export const QUIZ_TIME_LIMIT = 1 * 60;

// TODO: Created by Copilot
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
  {
    id: 4,
    title: "なぞなぞ",
    score: 2,
    text: "白いものを黒く塗ると何になる?",
    answer: ["汚い", "きたない", "よごれた"],
  },
  {
    id: 5,
    title: "計算",
    score: 3,
    text: "5×5-3×3=?",
    answer: ["16"],
  },
  {
    id: 6,
    title: "歴史",
    score: 2,
    text: "鎌倉幕府が成立した年は?",
    answer: ["1192", "1185"],
  },
  {
    id: 7,
    title: "言葉遊び",
    score: 4,
    text: "「た」を「ら」に変えると美味しくなる食べ物は?",
    answer: ["たまご", "卵", "らまご"],
  },
  {
    id: 8,
    title: "理科",
    score: 2,
    text: "水の沸点は摂氏何度?",
    answer: ["100", "100度"],
  },
  {
    id: 9,
    title: "文字並び替え",
    score: 3,
    text: "「きつね」の文字を並び替えて作れる動物は?",
    answer: ["ねこ", "猫"],
  },
  {
    id: 10,
    title: "推理",
    score: 4,
    text: "兄弟が3人います。太郎は次郎より年上、花子は太郎より年上です。一番年下は誰?",
    answer: ["次郎", "じろう"],
  },
];

export const WARNING_LIST = [
  "手持ちのライトで問題を照らしてください。",
  "選んだ問題の解答を記入してください。",
  "他チームとの協力は禁止です。",
  "発見次第、注意させていただきます。",
  "不具合がありましたら、スタッフまでお知らせください。",
];

export const IMPORTANT_NOTICE = [
  "途中で諦めず、最後まで全力で単位を修得しましょう。",
  "わからない問題はスタッフがヒントを教えてくれるかもしれません。",
  "i.maker は阪大情報サイト「はんナビ」を運営しています。",
  "ここまで読んだ方は観察力が高く、謎解きが得意な傾向にあります。",
];

// TODO: biz班に確認
export const snsData = {
  title: "テスト：タイトル",
  text: "テスト：テキスト",
  url: "https://machikane-2025.i-maker.org/",
  hashtags: ["まちかね祭"],
};

export const UPDATE_RANKING_INTERVAL = 0.5 * 60;

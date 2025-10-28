import type { QuestionType } from "./quiz-types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const RANGE = { min: 1, max: 4 } as const;
export const QUIZ_TIME_LIMIT = 10 * 60;

export const QUESTIONS: QuestionType[] = [
  { id: 1, title: "回路設計I", answer: ["単位", "たんい"], score: 3 },
  { id: 2, title: "近現代史", answer: ["たいへいよう", "太平洋"], score: 1 },
  {
    id: 3,
    title: "統計学入門",
    answer: ["さんま", "秋刀魚", "サンマ"],
    score: 2,
  },
  {
    id: 4,
    title: "西洋文化論",
    answer: ["ふぁみれす", "ファミレス"],
    score: 3,
  },
  {
    id: 5,
    title: "総合英語",
    answer: ["インターネット", "internet", "Internet"],
    score: 1,
  },
  { id: 6, title: "認知視覚心理学", answer: ["波", "なみ", "ナミ"], score: 2 },
  { id: 7, title: "解剖学", answer: ["はんだい"], score: 1 },
  {
    id: 8,
    title: "分析化学実験",
    answer: ["SCIENCE", "science", "サイエンス"],
    score: 1,
  },
  { id: 9, title: "韓国語上級", answer: ["ハングル", "はんぐる"], score: 3 },
  { id: 10, title: "経済学入門", answer: ["まちかね"], score: 2 },
  { id: 11, title: "動物生態学", answer: ["B大阪湾", "B、大阪湾"], score: 2 },
  {
    id: 12,
    title: "実践英語",
    answer: ["HANDAISEI", "阪大生", "はんだいせい"],
    score: 1,
  },
  { id: 13, title: "中国文学I", answer: ["三国志", "さんごくし"], score: 2 },
  {
    id: 14,
    title: "大阪大学の歴史",
    answer: ["げんざいしんこうけい", "現在進行形"],
    score: 1,
  },
  { id: 15, title: "日本文学I", answer: ["ちしき", "知識"], score: 1 },
  { id: 16, title: "言語文化論", answer: ["ねんげつ"], score: 3 },
  { id: 17, title: "化学基礎論", answer: ["知恵", "ちえ", "チエ"], score: 2 },
  { id: 18, title: "ゲーム理論入門", answer: ["バード", "ばーど"], score: 1 },
  { id: 19, title: "メディア文化研究", answer: ["クリスマス"], score: 2 },
  {
    id: 20,
    title: "幾何学入門",
    answer: ["えんすい", "円錐"],
    score: 2,
  },
  { id: 21, title: "言語学I", answer: ["鯉", "こい", "コイ"], score: 1 },
  { id: 22, title: "世界地理学", answer: ["中国", "ちゅうごく"], score: 2 },
  { id: 23, title: "地史学I", answer: ["4"], score: 1 },
  { id: 24, title: "環境論I", answer: ["院進", "いんしん"], score: 2 },
  {
    id: 25,
    title: "文理融合の応用論",
    answer: ["フル単", "ふるたん"],
    score: 3,
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

export const snsData = {
  title: "マチカネ謎解き2025",
  text: "あなたも単位を修得しよう！A101で出店中🎓✨\n",
  hashtags: ["まちかね祭", "i.maker"],
};

export const UPDATE_RANKING_INTERVAL = 10 * 60; // seconds

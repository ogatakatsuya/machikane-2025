import { Chapter, Question, ChapterMessages } from '@/lib/types/game';

export class QuestionManager {
  private questions = new Map<string, Question>();

  constructor(questionsData: Array<Omit<Question, 'isCompleted' | 'isUnlocked'>>) {
    questionsData.forEach((questionData, index) => {
      this.questions.set(questionData.id, {
        ...questionData,
        isCompleted: false,
        isUnlocked: index === 0,
      });
    });
  }

  getQuestion(id: string): Question | undefined {
    return this.questions.get(id);
  }

  getAllQuestions(): Map<string, Question> {
    return new Map(this.questions);
  }

  markAsCompleted(id: string): boolean {
    const question = this.questions.get(id);
    if (!question) return false;
    
    question.isCompleted = true;
    
    const questionIds = Array.from(this.questions.keys());
    const currentIndex = questionIds.indexOf(id);
    if (currentIndex !== -1 && currentIndex + 1 < questionIds.length) {
      const nextQuestionId = questionIds[currentIndex + 1];
      const nextQuestion = this.questions.get(nextQuestionId);
      if (nextQuestion) {
        nextQuestion.isUnlocked = true;
      }
    }
    
    return true;
  }

  isAllCompleted(): boolean {
    return Array.from(this.questions.values()).every(q => q.isCompleted);
  }

  checkAnswer(id: string, answer: string): boolean {
    const question = this.questions.get(id);
    if (!question || !question.isUnlocked) return false;
    
    const normalize = (s: string) => s.toLowerCase().trim();
    const normalizedAnswer = normalize(answer);
    return question.answer.some(ans => normalize(ans) === normalizedAnswer);
  }
}

export class ChapterManager {
  private chapters = new Map<number, Chapter>();
  private chapterMessages = new Map<number, ChapterMessages>();

  constructor() {
    this.initializeChapters();
    this.initializeChapterMessages();
  }

  private initializeChapters(): void {
    const chapter1Questions = new QuestionManager([
      {
        id: "1-1",
        title: "第1問",
        text: "ステージ奏から共通棟A棟を見上げてみよう！A~Dのうち窓ガラスにかかれているマークはどれ？",
        answer: ["C"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/1.webp"
      },
      {
        id: "1-2",
        title: "第2問",
        text: "メインストリートを通って総合案内所の近くの階段に行こう！赤→黄緑→オレンジ→緑の順に言葉を当てはめるとできる4文字の言葉が答えだ。",
        answer: ["入り口", "入口", "いりぐち"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/2.webp"
      },
      {
        id: "1-3",
        title: "第3問",
        text: "共通棟B棟の入り口付近に向かい「全学教育推進機構 建物総合案内」を見よう！向きが【⑴の答え】の【⑵の答え】はいくつある？数字で答えよ。",
        answer: ["3", "３"],
      },
      {
        id: "1-4",
        title: "第4問",
        text: "【⑴の答え】棟の【⑶の答え】階に行って中庭を見下ろそう！",
        answer: ["HEIJITSU", "平日", "へいじつ", "ヘイジツ"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/4.webp"
      }
    ]);

    this.chapters.set(1, {
      id: 1,
      title: "共通棟前",
      location: "共通棟前",
      isCompleted: false,
      isUnlocked: true,
      questions: chapter1Questions.getAllQuestions()
    });

    const chapter2Questions = new QuestionManager([
      {
        id: "2-1",
        title: "第5問",
        text: "ステージ宙の近くには様々な看板が見えるはずだ。隠された文字をアルファベットで入力しよう！",
        answer: ["IKUYUKAI", "ikuyukai"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/5.webp"
      },
      {
        id: "2-2",
        title: "第6問",
        text: "【⑸の答え】を漢字にすると「育友会」となる。大阪大学育友会から2016年に寄贈されたものは何？",  
        answer: ["とけい", "時計"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/6.webp"
      },
      {
        id: "2-3",
        title: "第7問",
        text: "学生会館の方に歩こう！するとまた別の【⑹の答え】が見えてくる。その近くで【⑷の答え】をヒントに謎を解こう。",
        answer: ["もけい", "模型"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/7.webp"
      }
    ]);

    this.chapters.set(2, {
      id: 2,
      title: "かさね前",
      location: "かさね前",
      isCompleted: false,
      isUnlocked: false,
      questions: chapter2Questions.getAllQuestions()
    });

    const chapter3Questions = new QuestionManager([
      {
        id: "3-1",
        title: "第8問",
        text: "福利会館の前で左に曲がり、豊中総合学館の前で止まろう。この通りにはいくつものアート作品があるみたいだ！さっそく近くに児玉康兵さんによって作られた作品が見える。この作品にはステンレス板がいくつ張り合わされているか?",
        answer: ["24", "２４"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/8.webp"
      },
      {
        id: "3-2",
        title: "第9問",
        text: "メインストリートの方に向かって歩くと法経講義棟の近くにまた別のアート作品がある。その作品をヒントに次の謎を解け。",
        answer: ["ちけい", "地形"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/9.webp"
      },
    ]);

    this.chapters.set(3, {
      id: 3,
      title: "法経棟",
      location: "法経棟",
      isCompleted: false,
      isUnlocked: false,
      questions: chapter3Questions.getAllQuestions()
    });

    const chapter4Questions = new QuestionManager([
      {
        id: "4-1",
        title: "第11問",
        text: "メインストリートに出ると左ななめ前に公衆電話が見えてくるはずだ。電話ボックスの中をヒントに次の謎を解こう。これらの隠された3桁の数字のうち共通棟Ａ棟に実際にある教室の部屋番号はどれ？3桁の数字で答えよ。",
        answer: ["104", "１０４"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/11.webp"
      },
      {
        id: "4-2",
        title: "第12問",
        text: "いよいよ最終問題だ。共通棟Ａ101の近くに行き、次の謎を解こう。",
        answer: ["LAST", "ラスト"],
        image: "https://r2.machikane-2025.i-maker.org/outdoor/12.webp"
      }
    ]);

    this.chapters.set(4, {
      id: 4,
      title: "共通棟前（最終）",
      location: "共通棟",
      isCompleted: false,
      isUnlocked: false,
      questions: chapter4Questions.getAllQuestions()
    });
  }

  private initializeChapterMessages(): void {
    this.chapterMessages.set(1, {
      locationPopupText: "まずは「共通棟前」で謎を解こう",
      clearTitle: "第1章クリア！",
      clearMessage: "おめでとうございます！次の章に進みましょう。",
      mapInstruction: "共通棟前に移動してください",
      mapImageUrl: "https://r2.machikane-2025.i-maker.org/map/map_-_1.png"
    });

    this.chapterMessages.set(2, {
      locationPopupText: "次は「かさね前」で謎を解こう",
      clearTitle: "第2章クリア！",
      clearMessage: "素晴らしい！法経棟に向かいましょう。",
      mapInstruction: "かさね前に移動してください",
      mapImageUrl: "https://r2.machikane-2025.i-maker.org/map/map_-_2.png"
    });

    this.chapterMessages.set(3, {
      locationPopupText: "次は「法経棟」で謎を解こう",
      clearTitle: "第3章クリア！",
      clearMessage: "あと少し！最後の共通棟に戻りましょう。",
      mapInstruction: "法経棟に移動してください",
      mapImageUrl: "https://r2.machikane-2025.i-maker.org/map/map_-_3.png"
    });

    this.chapterMessages.set(4, {
      locationPopupText: "最後は「共通棟」に戻って謎を解こう",
      clearTitle: "最終章クリア！",
      clearMessage: "全ての謎を解き明かしました！",
      mapInstruction: "共通棟に戻ってください",
      mapImageUrl: "https://r2.machikane-2025.i-maker.org/map/map_-_4.png"
    });
  }

  getChapter(id: number): Chapter | undefined {
    return this.chapters.get(id);
  }

  getChapterMessages(id: number): ChapterMessages | undefined {
    return this.chapterMessages.get(id);
  }

  getAllChapters(): Map<number, Chapter> {
    return new Map(this.chapters);
  }

  markChapterAsCompleted(id: number): boolean {
    const chapter = this.chapters.get(id);
    if (!chapter) return false;
    
    chapter.isCompleted = true;
    
    const nextChapter = this.chapters.get(id + 1);
    if (nextChapter) {
      nextChapter.isUnlocked = true;
    }
    
    return true;
  }

  getTotalChapters(): number {
    return this.chapters.size;
  }

  isAllChaptersCompleted(): boolean {
    return Array.from(this.chapters.values()).every(c => c.isCompleted);
  }
}
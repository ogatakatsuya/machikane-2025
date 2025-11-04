import { GameState, ScreenType, ModalType, Chapter } from '@/lib/types/game';
import { ChapterManager } from '@/lib/data/gameData';
import { APIClient } from './api';

export class GameManager {
  private gameState: GameState;
  private chapterManager: ChapterManager;
  private currentScreen: ScreenType = 'start';
  private currentModal: ModalType = null;
  private apiClient: APIClient;
  private completedChapters: number[] = [];

  constructor() {
    this.chapterManager = new ChapterManager();
    this.gameState = this.initializeGameState();
    this.apiClient = new APIClient();
  }

  private initializeGameState(): GameState {
    return {
      currentChapter: 0,
      teamName: '',
      teamSize: 1,
      isGameCompleted: false,
      chapters: this.chapterManager.getAllChapters(),
      chapterMessages: new Map()
    };
  }

  async startGame(teamName: string, teamSize: number): Promise<{ success: boolean; error?: string }> {
    this.gameState.teamName = teamName || '名無しの探偵';
    this.gameState.teamSize = teamSize;
    this.gameState.currentChapter = 1;
    this.currentScreen = 'chapter';
    this.completedChapters = [];

    // KVにチーム情報を登録
    const result = await this.apiClient.saveTeamProgress(
      this.gameState.teamName,
      this.gameState.teamSize,
      this.gameState.currentChapter,
      this.completedChapters
    );

    // 成功時はlocalStorageにチーム名を保存
    if (result.success) {
      this.saveToLocalStorage();
    }

    return result;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getCurrentScreen(): ScreenType {
    return this.currentScreen;
  }

  setCurrentScreen(screen: ScreenType): void {
    this.currentScreen = screen;
  }

  getCurrentModal(): ModalType {
    return this.currentModal;
  }

  setCurrentModal(modal: ModalType): void {
    this.currentModal = modal;
  }

  getCurrentChapter(): Chapter | undefined {
    return this.chapterManager.getChapter(this.gameState.currentChapter);
  }

  getCurrentChapterMessages() {
    return this.chapterManager.getChapterMessages(this.gameState.currentChapter);
  }

  getChapter(id: number): Chapter | undefined {
    return this.chapterManager.getChapter(id);
  }

  getChapterMessages(id: number) {
    return this.chapterManager.getChapterMessages(id);
  }

  async checkAnswer(questionId: string, answer: string): Promise<{ correct: boolean; nextAction: 'unlock' | 'chapter-clear' | 'game-complete' | null }> {
    const [chapterIdStr] = questionId.split('-');
    const chapterId = parseInt(chapterIdStr);
    const chapter = this.chapterManager.getChapter(chapterId);
    
    if (!chapter) {
      return { correct: false, nextAction: null };
    }

    const question = chapter.questions.get(questionId);
    if (!question || !question.isUnlocked) {
      return { correct: false, nextAction: null };
    }

    // 入力・答えの正規化（半角/全角差・合成文字差を吸収）
    const normalize = (s: string) => s.normalize('NFKC').toLowerCase().trim();
    const normalizedAnswer = normalize(answer);
    const isCorrect = question.answer.some(ans => normalize(ans) === normalizedAnswer);
    
    if (isCorrect) {
      question.isCompleted = true;
      
      const questionIds = Array.from(chapter.questions.keys());
      const currentIndex = questionIds.indexOf(questionId);
      
      if (currentIndex !== -1 && currentIndex + 1 < questionIds.length) {
        const nextQuestionId = questionIds[currentIndex + 1];
        const nextQuestion = chapter.questions.get(nextQuestionId);
        if (nextQuestion) {
          nextQuestion.isUnlocked = true;
        }
        return { correct: true, nextAction: 'unlock' };
      } else {
        await this.markChapterAsCompleted(chapterId);
        
        if (this.chapterManager.isAllChaptersCompleted()) {
          this.gameState.isGameCompleted = true;
          this.completeGame(); // localStorageをクリア
          return { correct: true, nextAction: 'game-complete' };
        } else {
          return { correct: true, nextAction: 'chapter-clear' };
        }
      }
    }
    
    return { correct: false, nextAction: null };
  }

  private async markChapterAsCompleted(chapterId: number): Promise<void> {
    const chapter = this.chapterManager.getChapter(chapterId);
    if (chapter) {
      chapter.isCompleted = true;
      
      // 完了した章を記録
      if (!this.completedChapters.includes(chapterId)) {
        this.completedChapters.push(chapterId);
      }

      // KVにチェックポイントを更新
      await this.apiClient.updateChapterProgress(chapterId, this.gameState.teamName);
      
      // localStorageを更新
      this.saveToLocalStorage();
      
      const nextChapter = this.chapterManager.getChapter(chapterId + 1);
      if (nextChapter) {
        nextChapter.isUnlocked = true;
      }
    }
  }

  async moveToNextChapter(): Promise<boolean> {
    const nextChapterId = this.gameState.currentChapter + 1;
    const nextChapter = this.chapterManager.getChapter(nextChapterId);
    
    if (nextChapter && nextChapter.isUnlocked) {
      this.gameState.currentChapter = nextChapterId;
      
      // KVにチーム情報を更新
      await this.apiClient.saveTeamProgress(
        this.gameState.teamName,
        this.gameState.teamSize,
        this.gameState.currentChapter,
        this.completedChapters
      );
      
      // localStorageも更新
      this.saveToLocalStorage();
      
      return true;
    }
    
    return false;
  }

  resetGame(): void {
    this.gameState = this.initializeGameState();
    this.chapterManager = new ChapterManager();
    this.currentScreen = 'start';
    this.currentModal = null;
  }

  getTotalChapters(): number {
    return this.chapterManager.getTotalChapters();
  }

  isGameCompleted(): boolean {
    return this.gameState.isGameCompleted;
  }

  async getChapterProgress(chapterId: number) {
    return await this.apiClient.getChapterProgress(chapterId);
  }

  getCompletedChapters(): number[] {
    return [...this.completedChapters];
  }

  // localStorage関連のメソッド
  private saveToLocalStorage(): void {
    const gameData = {
      teamName: this.gameState.teamName,
      teamSize: this.gameState.teamSize,
      currentChapter: this.gameState.currentChapter,
      completedChapters: this.completedChapters,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('machikane-game-progress', JSON.stringify(gameData));
  }

  private loadFromLocalStorage(): any | null {
    try {
      const data = localStorage.getItem('machikane-game-progress');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('machikane-game-progress');
  }

  // 復帰処理
  async resumeGame(): Promise<boolean> {
    const savedData = this.loadFromLocalStorage();
    if (!savedData) {
      return false;
    }

    // 保存されたデータでゲーム状態を復元
    this.gameState.teamName = savedData.teamName;
    this.gameState.teamSize = savedData.teamSize;
    this.gameState.currentChapter = savedData.currentChapter;
    this.completedChapters = savedData.completedChapters || [];
    this.currentScreen = 'chapter';

    // 完了した章をマーク
    this.completedChapters.forEach(chapterId => {
      const chapter = this.chapterManager.getChapter(chapterId);
      if (chapter) {
        chapter.isCompleted = true;
        // 次の章をアンロック
        const nextChapter = this.chapterManager.getChapter(chapterId + 1);
        if (nextChapter) {
          nextChapter.isUnlocked = true;
        }
      }
    });

    // 現在の章をアンロック
    const currentChapter = this.chapterManager.getChapter(this.gameState.currentChapter);
    if (currentChapter) {
      currentChapter.isUnlocked = true;
    }

    return true;
  }

  // ゲーム完了時にlocalStorageをクリア
  completeGame(): void {
    this.clearLocalStorage();
  }
}
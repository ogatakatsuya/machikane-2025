export interface Question {
  id: string;
  title: string;
  text: string;
  answer: string[];
  image?: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  location: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  questions: Map<string, Question>;
}

export interface ChapterMessages {
  locationPopupText: string;
  clearTitle: string;
  clearMessage: string;
  mapInstruction: string;
  mapImageUrl?: string;
}

export interface GameState {
  currentChapter: number;
  teamName: string;
  teamSize: number;
  isGameCompleted: boolean;
  chapters: Map<number, Chapter>;
  chapterMessages: Map<number, ChapterMessages>;
}

export type ScreenType = 'start' | 'chapter' | 'final-clear';

export type ModalType = 'location' | 'chapter-clear' | 'review' | null;

// KV storage types
export interface TeamProgress {
  teamName: string;
  teamSize: number;
  currentChapter: number;
  completedChapters: number[];
  startTime: string;
}

export interface ChapterProgress {
  chapterId: number;
  completedTeams: string[];
  totalTeams: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
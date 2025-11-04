import { TeamProgress, ChapterProgress, APIResponse } from '@/lib/types/game';

export interface ChapterStats {
  chapterId: number;
  completedTeams: number;
  totalTeams: number;
  completionRate: number;
}

export interface OverallProgress {
  totalTeams: number;
  chapters: ChapterStats[];
}

const API_BASE = '/api';

export class APIClient {
  async saveTeamProgress(teamName: string, teamSize: number, currentChapter: number, completedChapters: number[]): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/team-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          teamSize,
          currentChapter,
          completedChapters,
          startTime: new Date().toISOString()
        })
      });
      
      const result: APIResponse<TeamProgress> = await response.json();
      return { success: result.success, error: result.error };
    } catch (error) {
      console.error('Failed to save team progress:', error);
      return { success: false, error: 'ネットワークエラーが発生しました' };
    }
  }

  async updateChapterProgress(chapterId: number, teamName: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/chapter-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, teamName })
      });
      
      const result: APIResponse<ChapterProgress> = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to update chapter progress:', error);
      return false;
    }
  }

  async getChapterProgress(chapterId: number): Promise<ChapterProgress | null> {
    try {
      const response = await fetch(`${API_BASE}/chapter-progress?chapterId=${chapterId}`);
      const result: APIResponse<ChapterProgress> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get chapter progress:', error);
      return null;
    }
  }

  async getOverallProgress(): Promise<OverallProgress | null> {
    try {
      const response = await fetch(`${API_BASE}/overall-progress`);
      const result: APIResponse<OverallProgress> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get overall progress:', error);
      return null;
    }
  }
}


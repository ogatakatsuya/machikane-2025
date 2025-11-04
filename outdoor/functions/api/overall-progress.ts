export interface Env {
  GAME_PROGRESS: KVNamespace;
}

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

export async function onRequestGet(context: EventContext<Env, any, any>): Promise<Response> {
  const { env } = context;
  
  try {
    // 全チーム情報を取得
    const allTeams = await env.GAME_PROGRESS.list({ prefix: 'team:' });
    const totalTeams = allTeams.keys.length;

    // 各章の進捗を取得
    const chapters: ChapterStats[] = [];
    
    // 1章から4章までチェック
    for (let chapterId = 1; chapterId <= 4; chapterId++) {
      const key = `chapter:${chapterId}`;
      const data = await env.GAME_PROGRESS.get(key);
      
      let completedTeams = 0;
      if (data) {
        const chapterData = JSON.parse(data);
        completedTeams = chapterData.completedTeams.length;
      }
      
      const completionRate = totalTeams > 0 ? Math.round((completedTeams / totalTeams) * 100) : 0;
      
      chapters.push({
        chapterId,
        completedTeams,
        totalTeams,
        completionRate
      });
    }

    const overallProgress: OverallProgress = {
      totalTeams,
      chapters
    };

    return new Response(JSON.stringify({
      success: true,
      data: overallProgress
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


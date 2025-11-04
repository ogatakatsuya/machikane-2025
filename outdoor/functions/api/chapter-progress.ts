export interface Env {
  GAME_PROGRESS: KVNamespace;
}

export async function onRequest(context: EventContext<Env, any, any>): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  
  try {
    if (request.method === 'POST') {
      // POST: 章の進捗を更新
      const { chapterId, teamName } = await request.json() as {
        chapterId: number;
        teamName: string;
      };

      // 既存のチャプター進捗を取得
      const key = `chapter:${chapterId}`;
      const existing = await env.GAME_PROGRESS.get(key);
      
      let chapterData: { chapterId: number; completedTeams: string[]; totalTeams: number } = {
        chapterId,
        completedTeams: [],
        totalTeams: 0
      };

      if (existing) {
        chapterData = JSON.parse(existing);
      }

      // チームが既に完了リストにない場合のみ追加
      if (!chapterData.completedTeams.includes(teamName)) {
        chapterData.completedTeams.push(teamName);
      }

      // チャプター進捗をKVに保存
      await env.GAME_PROGRESS.put(key, JSON.stringify(chapterData));

      // 全チーム情報を取得して合計チーム数を更新
      const allTeams = await env.GAME_PROGRESS.list({ prefix: 'team:' });
      chapterData.totalTeams = allTeams.keys.length;

      return new Response(JSON.stringify({
        success: true,
        data: chapterData
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (request.method === 'GET') {
      // GET: 章の進捗を取得
      const chapterId = url.searchParams.get('chapterId');
      
      if (!chapterId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Chapter ID is required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const key = `chapter:${chapterId}`;
      const data = await env.GAME_PROGRESS.get(key);

      if (!data) {
        // チームの総数を取得
        const allTeams = await env.GAME_PROGRESS.list({ prefix: 'team:' });
        
        return new Response(JSON.stringify({
          success: true,
          data: {
            chapterId: parseInt(chapterId),
            completedTeams: [],
            totalTeams: allTeams.keys.length
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const chapterData = JSON.parse(data);

      // 総チーム数を更新
      const allTeams = await env.GAME_PROGRESS.list({ prefix: 'team:' });
      chapterData.totalTeams = allTeams.keys.length;

      return new Response(JSON.stringify({
        success: true,
        data: chapterData
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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




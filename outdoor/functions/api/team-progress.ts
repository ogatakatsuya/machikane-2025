export interface Env {
  GAME_PROGRESS: KVNamespace;
}

export async function onRequestPost(context: EventContext<Env, any, any>): Promise<Response> {
  const { request, env } = context;
  
  try {
    const data = await request.json() as {
      teamName: string;
      teamSize: number;
      currentChapter: number;
      completedChapters: number[];
      startTime: string;
    };

    // 重複チェック：既に同じチーム名で登録されているか確認
    const existingTeam = await env.GAME_PROGRESS.get(`team:${data.teamName}`);
    
    if (existingTeam) {
      return new Response(JSON.stringify({
        success: false,
        error: 'このチーム名は既に使用されています。別のチーム名を入力してください。',
        duplicate: true
      }), {
        status: 409, // Conflict
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // チーム情報をKVに保存
    const teamData = JSON.stringify({
      teamName: data.teamName,
      teamSize: data.teamSize,
      currentChapter: data.currentChapter,
      completedChapters: data.completedChapters,
      startTime: data.startTime
    });

    await env.GAME_PROGRESS.put(`team:${data.teamName}`, teamData);

    return new Response(JSON.stringify({
      success: true,
      data: data
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


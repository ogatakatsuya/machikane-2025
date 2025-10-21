import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;

  if (!groupId) {
    return NextResponse.json(
      { error: "groupId is required" },
      { status: 400 }
    );
  }

  try {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    
    // ブラウザを起動
    const browser = await puppeteer.default.launch({
      args: [...chromium.default.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
      ignoreHTTPSErrors: true,
    });

    // ブラウザのタブを開く
    const page = await browser.newPage();

    // スクショ対象のページにアクセス
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
    await page.goto(`${baseUrl}/share_instagram?groupId=${groupId}`);

    // ページの表示が完了するまで待つ
    await page.waitForSelector("body", { visible: true });
    
    // 画像やフォントの読み込みを待つ
    await new Promise(resolve => setTimeout(resolve, 2000));

    // サイズを指定してスクショを撮ってbase64方式の画像データを取得
    const image = await page.screenshot({
      encoding: "base64",
      fullPage: false,
      clip: { x: 0, y: 0, width: 1080, height: 1920 },
    });

    // ブラウザを閉じる
    await browser.close();

    // 取得した画像データをクライアントに返す
    return NextResponse.json({ status: "OK", image }, { status: 200 });
  } catch (error) {
    console.error("Screenshot generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
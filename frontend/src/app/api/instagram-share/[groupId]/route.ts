import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  try {
    const isProduction = process.env.NODE_ENV === "production";

    let browser: any;

    if (isProduction) {
      // AWS Lambda環境でのPlaywright設定
      const playwrightAWSLambda = await import("playwright-aws-lambda");
      browser = await playwrightAWSLambda.launchChromium({
        headless: true,
      });
    } else {
      // 開発環境でのPlaywright設定
      const { chromium } = await import("playwright-core");
      browser = await chromium.launch({
        headless: true,
      });
    }

    // 新しいページを開く
    const page = await browser.newPage();

    // ビューポートを設定
    await page.setViewportSize({ width: 1080, height: 1920 });

    // スクショ対象のページにアクセス
    const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
    await page.goto(`${baseUrl}/share_instagram?groupId=${groupId}`, {
      waitUntil: "domcontentloaded",
    });

    // bodyの存在のみ確認（表示状態は問わない）
    await page.waitForSelector("body", { state: "attached" });

    // CSSが原因でbodyが非表示になっている場合の対処
    await page.addStyleTag({
      content: `
        body { 
          visibility: visible !important; 
          display: block !important; 
          opacity: 1 !important; 
        }
      `,
    });

    // 画像やフォントの読み込みを待つ
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // スクリーンショットを撮影
    const screenshot = await page.screenshot({
      clip: { x: 0, y: 0, width: 1080, height: 1920 },
    });

    // ブラウザを閉じる
    await browser.close();

    // Base64エンコード
    const image = screenshot.toString("base64");

    // 取得した画像データをクライアントに返す
    return NextResponse.json({ status: "OK", image }, { status: 200 });
  } catch (error) {
    console.error("Screenshot generation failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate screenshot",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

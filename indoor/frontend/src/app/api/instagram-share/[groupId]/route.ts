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
    const isLocal = process.env.NODE_ENV === "development";

    if (isLocal) {
      // ローカル開発環境 - Chromeのパスを指定
      const puppeteer = await import("puppeteer-core");
      const browser = await puppeteer.default.launch({
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: true,
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920 });

      const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
      await page.goto(`${baseUrl}/share_instagram?groupId=${groupId}`, {
        waitUntil: "load",
        timeout: 3000,
      });

      // bodyの存在のみ確認（表示状態は問わない）
      await page.waitForSelector("body");

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

      const image = await page.screenshot({
        encoding: "base64",
        fullPage: false,
        clip: { x: 0, y: 0, width: 1080, height: 1920 },
      });

      await browser.close();
      return NextResponse.json({ status: "OK", image }, { status: 200 });
    } else {
      // AWS Lambda環境 - @sparticuz/chromiumを使用
      const chromium = await import("@sparticuz/chromium");
      const puppeteer = await import("puppeteer-core");

      const browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();

      const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
      await page.goto(`${baseUrl}/share_instagram?groupId=${groupId}`, {
        waitUntil: "domcontentloaded",
      });

      // bodyの存在のみ確認（表示状態は問わない）
      await page.waitForSelector("body");

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

      const image = await page.screenshot({
        encoding: "base64",
        fullPage: false,
        clip: { x: 0, y: 0, width: 1080, height: 1920 },
      });

      await browser.close();
      return NextResponse.json({ status: "OK", image }, { status: 200 });
    }
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

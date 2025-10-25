import { chromium } from "playwright";

const randomWebsites = [
  "https://example.com",
  "https://news.ycombinator.com",
  "https://github.com",
  "https://openai.com",
  "https://wikipedia.org",
];

export async function runMockAutomation(row: any) {
  const browser = await chromium.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Pick a random website
  const url =
    randomWebsites[Math.floor(Math.random() * randomWebsites.length)] ??
    "https://example.com";
  console.log(`🧩 [Mock RPA] Opening: ${url} for row: ${row.OrderNo || "N/A"}`);

  try {
    await page.goto(url, { timeout: 15000 });

    // Randomly perform an action
    const randomAction = Math.floor(Math.random() * 3);
    if (randomAction === 0) {
      await page.click("body");
    } else if (randomAction === 1) {
      await page.screenshot({
        path: `./screenshots/${row.OrderNo || "test"}.png`,
      });
    } else {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    console.log(`✅ [Mock RPA] Finished for: ${row.OrderNo}`);
  } catch (err) {
    console.error(`❌ [Mock RPA] Failed for: ${row.OrderNo}`, err);
  } finally {
    await browser.close();
  }
}

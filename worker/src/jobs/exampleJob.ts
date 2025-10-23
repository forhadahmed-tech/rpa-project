import { chromium } from "playwright";

export async function performSiteTask(data: any) {
  console.log("performSiteTask STARTED");

  const browser = await chromium.launch({
    channel: "chrome",
    headless: false, // show browser
    slowMo: 200,     // slow down actions for visibility
  });

  const page = await browser.newPage();
  console.log("Browser opened...");

  try {
    console.log(`Navigating to ${data.site}...`);
    await page.goto(data.site);

    if (data.credentials) {
      console.log("Filling login form...");
      await page.fill('input[name="userId"]', data.credentials.userId);
      await page.fill('input[name="password"]', data.credentials.password);

      console.log("Clicking login button...");
      await page.click('button[type="submit"]');

      console.log("Waiting for navigation...");
      await page.waitForNavigation({ timeout: 10000 });
      console.log("Login completed.");
    }

    console.log("Task completed successfully!");
    return { success: true };
  } catch (err: any) {
    console.error("Error in performSiteTask:", err);
    throw err;
  } finally {
    // Comment these out while debugging to see browser
    await page.close();
    await browser.close();
    // console.log("Task finished (browser still open for inspection)");
  }
}

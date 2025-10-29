import { chromium } from "playwright";

export async function runMockAutomation(allRows: any[]) {
  const browser = await chromium.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    // --- STEP 1: Login once ---
    console.log("🔑 Logging in...");
    await page.goto("http://127.0.0.1:5500/login.html", { timeout: 15000 });

    // Fill login form
    await page.fill("#username", "admin");
    await page.fill("#password", "password123");
    await page.click("button[type='submit']");

    // Wait for redirect to form page
    await page.waitForURL("**/form.html", { timeout: 10000 });
    console.log("✅ Logged in successfully!");

    // --- STEP 2: Loop through rows and submit the form ---
    for (const [index, row] of allRows.entries()) {
      console.log(`📝 Processing Row ${index + 1}: ${row["Order No"]}`);

      // Fill form fields
      await page.fill("#order_no", row["Order No"] || "");
      await page.fill(
        "#booking_confirmation_no",
        row["BOOKING CONFIRMATION NO"] || ""
      );
      await page.fill("#fcr", row["Fcr"] || "");

      // Submit form
      await page.click("button[type='submit']");

      try {
        // Wait for success message or confirmation
        await page.waitForSelector("#successMessage", { timeout: 5000 });
        console.log(`✅ Row ${index + 1} submitted successfully`);
      } catch {
        console.error(`❌ Row ${index + 1} submission failed`);
        await page.screenshot({
          path: `./screenshots/failed_${row["Order No"] || "unknown"}.png`,
          fullPage: true,
        });
      }

      // Optional short delay between submissions
      await page.waitForTimeout(1000);
    }

    console.log("🎉 All rows processed!");
  } catch (err) {
    console.error("❌ Unexpected error during automation:", err);
  } finally {
    await browser.close();
  }
}

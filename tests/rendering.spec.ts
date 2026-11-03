import { expect, test } from "@playwright/test";

for (const preference of ["reduce", "no-preference"] as const) {
  test(`animation preferences hydrate cleanly: ${preference}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("reduced motion leaves every section visible after hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const reveals = page.locator(".reveal");
  expect(await reveals.count()).toBeGreaterThan(20);
  for (const reveal of await reveals.all()) {
    await expect(reveal).toHaveCSS("opacity", "1");
  }
});

test("normal motion reveals every section as the visitor scrolls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const reveal of await page.locator(".reveal").all()) {
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  }
});

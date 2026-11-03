import { expect, test } from "@playwright/test";

test("navigation follows the visible story in document order", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation", exact: true });
  await expect(navigation.getByRole("link", { name: "Home", exact: true }))
    .toHaveAttribute("aria-current", "location");

  for (const [section, name] of [
    ["collections", "Creations"],
    ["our-story", "Our Story"],
    ["testimonials", "Testimonials"],
    ["enquiry", "Contact"],
  ]) {
    await page.locator(`#${section}`).evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: "instant" });
    });
    await expect(navigation.getByRole("link", { name, exact: true }))
      .toHaveAttribute("aria-current", "location");
    await expect(navigation.locator('[aria-current="location"]')).toHaveCount(1);
  }

  const progress = page.locator("[data-scroll-progress]");
  await expect(progress).toBeVisible();
  await expect.poll(() => progress.evaluate((element) => {
    return new DOMMatrix(getComputedStyle(element).transform).a;
  })).toBeGreaterThan(0.5);
});

test("mobile navigation keeps keyboard focus contained and restores it on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();

  const navigation = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  const lastLink = navigation.getByRole("link", { name: "Create Your Cake", exact: true });
  await lastLink.focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close navigation", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(lastLink).toBeFocused();
  await page.keyboard.press("Escape");

  await expect(navigation).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation", exact: true })).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("mobile links navigate directly with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation", exact: true }).click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
  await navigation.getByRole("link", { name: "Creations", exact: true }).click();
  await expect(navigation).not.toBeVisible();
  await expect(page).toHaveURL(/#creations$/);
  await expect(page.locator('.desktop-nav a[href="#creations"]'))
    .toHaveAttribute("aria-current", "location");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

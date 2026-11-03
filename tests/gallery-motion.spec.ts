import { expect, test, type Locator, type Page } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  reducedMotion: "no-preference",
});

async function swipe(page: Page, target: Locator, direction: "left" | "right") {
  await target.scrollIntoViewIfNeeded();
  const bounds = await target.boundingBox();
  if (!bounds) throw new Error("The swipe surface is not visible");
  const startX = bounds.x + bounds.width * (direction === "left" ? 0.8 : 0.2);
  const endX = bounds.x + bounds.width * (direction === "left" ? 0.2 : 0.8);
  const y = bounds.y + bounds.height * 0.5;
  const session = await page.context().newCDPSession(page);

  try {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y, id: 1 }],
    });
    for (let step = 1; step <= 6; step += 1) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: startX + ((endX - startX) * step) / 6, y, id: 1 }],
      });
      // Give the browser a frame to deliver each part of a real touch gesture.
      await page.waitForTimeout(16);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } finally {
    await session.detach();
  }
}

test("touch swipes browse the lightbox in both directions", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "View The golden birthday in full screen" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const imageStage = dialog.locator("[data-gallery-swipe]");

  await expect(dialog.getByRole("heading", { name: "The golden birthday" })).toBeVisible();
  await swipe(page, imageStage, "left");
  await expect(dialog.getByRole("heading", { name: "A gilded forever" })).toBeVisible();
  await swipe(page, imageStage, "right");
  await expect(dialog.getByRole("heading", { name: "The golden birthday" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("testimonial swipes preserve the height and control position across all reviews", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Customer testimonials" });
  const viewport = carousel.locator("[data-testimonial-swipe]");
  await viewport.scrollIntoViewIfNeeded();
  const initialHeight = await viewport.evaluate((element) => element.getBoundingClientRect().height);
  const controlsOffset = await carousel.evaluate((element) => {
    const controls = element.querySelector(".testimonial-controls");
    return controls!.getBoundingClientRect().top - element.getBoundingClientRect().top;
  });

  for (const name of ["Antara Paul", "Shyamili Kumar", "Karthika Ravichandran"]) {
    await swipe(page, viewport, "left");
    await expect(carousel.locator(".testimonial-name")).toHaveText(name);
    await expect.poll(async () => {
      const height = await viewport.evaluate((element) => element.getBoundingClientRect().height);
      return Math.abs(height - initialHeight);
    }).toBeLessThan(1);
    const nextOffset = await carousel.evaluate((element) => {
      const controls = element.querySelector(".testimonial-controls");
      return controls!.getBoundingClientRect().top - element.getBoundingClientRect().top;
    });
    expect(Math.abs(nextOffset - controlsOffset)).toBeLessThan(1);
  }
});

test("reduced motion keeps filtered creations and changing reviews immediately readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const gallery = page.locator("#creations");
  await gallery.getByRole("button", { name: "Wedding", exact: true }).click();
  await expect(gallery.locator("article")).toHaveCount(2);
  await expect(gallery.locator("article").first()).toHaveCSS("transform", "none");

  const carousel = page.getByRole("region", { name: "Customer testimonials" });
  await carousel.getByRole("button", { name: "Next testimonial" }).click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Antara Paul");
  await expect(carousel.getByRole("blockquote")).toBeVisible();
});

import { expect, test } from "@playwright/test";

const siteUrl = "http://127.0.0.1:3000";

test.use({ viewport: { width: 1440, height: 1000 } });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(siteUrl);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("gallery filters show only matching real creations and can reset", async ({ page }) => {
  const gallery = page.locator("#creations");
  const filters = gallery.getByRole("group", { name: "Filter cake creations" });
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator("article")).toHaveCount(12);

  const categories = [
    { name: "Birthday", count: 3, expectedTitle: "The golden birthday" },
    { name: "Wedding", count: 2, expectedTitle: "A gilded forever" },
    { name: "Anniversary", count: 1, expectedTitle: "Eight years of sweet memories" },
    { name: "Kids", count: 2, expectedTitle: "A wild little celebration" },
    { name: "Designer", count: 1, expectedTitle: "A Barbie kind of birthday" },
    { name: "Custom", count: 3, expectedTitle: "Fifty, in the spotlight" },
  ];

  for (const category of categories) {
    const filter = filters.getByRole("button", { name: category.name, exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.locator("article")).toHaveCount(category.count);
    await expect(
      gallery.getByRole("button", {
        name: `View ${category.expectedTitle} in full screen`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
  }

  await filters.getByRole("button", { name: "All creations", exact: true }).click();
  await expect(gallery.locator("article")).toHaveCount(12);
});

test("each collection opens the matching gallery category", async ({ page }) => {
  const collections = page.locator("#collections .collection-link");
  const gallery = page.locator("#creations");
  const categories = [
    { name: "Birthday", count: 3 },
    { name: "Wedding", count: 2 },
    { name: "Anniversary", count: 1 },
    { name: "Kids", count: 2 },
    { name: "Designer", count: 1 },
    { name: "Custom", count: 3 },
  ];

  await expect(collections).toHaveCount(categories.length);
  for (let index = 0; index < categories.length; index += 1) {
    await collections.nth(index).click();
    await expect(page).toHaveURL(/#creations$/);
    await expect(
      gallery.getByRole("button", { name: categories[index].name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(gallery.locator("article")).toHaveCount(categories[index].count);
  }
});

test("lightbox supports buttons, arrow keys, focus trapping and Escape", async ({ page }) => {
  const gallery = page.locator("#creations");
  const trigger = gallery.getByRole("button", {
    name: "View The golden birthday in full screen",
    exact: true,
  });
  await trigger.click();

  const dialog = page.getByRole("dialog");
  const close = dialog.getByRole("button", { name: "Close image gallery" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "The golden birthday" })).toBeVisible();
  await expect(close).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Next cake image" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();

  await dialog.getByRole("button", { name: "Next cake image" }).click();
  await expect(dialog.getByRole("heading", { name: "A gilded forever" })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading", { name: "Petals & promises" })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading", { name: "A gilded forever" })).toBeVisible();
  await dialog.getByRole("button", { name: "Previous cake image" }).click();
  await expect(dialog.getByRole("heading", { name: "The golden birthday" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("a single category image has safe disabled navigation", async ({ page }) => {
  const gallery = page.locator("#creations");
  await gallery.getByRole("button", { name: "Designer", exact: true }).click();
  await gallery.getByRole("button", { name: "View A Barbie kind of birthday in full screen" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Previous cake image" })).toBeDisabled();
  await expect(dialog.getByRole("button", { name: "Next cake image" })).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading", { name: "A Barbie kind of birthday" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close image gallery" }).click();
  await expect(dialog).toBeHidden();
});

test("testimonials navigate through the three supplied reviews and wrap", async ({ page }) => {
  const carousel = page.getByRole("region", { name: "Customer testimonials" });
  const next = carousel.getByRole("button", { name: "Next testimonial" });
  const previous = carousel.getByRole("button", { name: "Previous testimonial" });
  await expect(carousel.locator(".testimonial-name")).toHaveText("Karthika Ravichandran");

  await next.click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Antara Paul");
  await expect(carousel.getByRole("blockquote")).toContainText("twice in a month");
  await next.click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Shyamili Kumar");
  await next.click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Karthika Ravichandran");
  await previous.click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Shyamili Kumar");

  await carousel.getByRole("button", { name: "Read testimonial by Antara Paul" }).click();
  await expect(carousel.locator(".testimonial-name")).toHaveText("Antara Paul");
  await expect(
    carousel.getByRole("button", { name: "Read testimonial by Antara Paul" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("all internal navigation links resolve to actual page anchors", async ({ page }) => {
  const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.length > 1)
      .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1).split("?")[0]))),
  );
  expect(invalidAnchors).toEqual([]);

  const navigation = page.getByRole("navigation", { name: "Main navigation", exact: true });
  await expect(navigation.getByRole("link")).toHaveCount(5);
  await navigation.getByRole("link", { name: "Creations", exact: true }).click();
  await expect(page).toHaveURL(/#creations$/);
  await navigation.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#enquiry$/);
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("menu locks scrolling, closes on Escape, restores focus and follows anchors", async ({ page }) => {
    const open = page.getByRole("button", { name: "Open navigation", exact: true });
    await open.click();
    const menu = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close navigation", exact: true })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(open).toBeFocused();
    await expect(open).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    await open.click();
    await menu.getByRole("link", { name: "Creations", exact: false }).click();
    await expect(page).toHaveURL(/#creations$/);
    await expect(menu).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
});

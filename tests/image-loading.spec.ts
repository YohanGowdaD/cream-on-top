import { expect, test, type Locator, type Page } from "@playwright/test";

test.use({ viewport: { width: 1512, height: 900 }, reducedMotion: "reduce" });

function collectLcpWarnings(page: Page) {
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (/was detected as the Largest Contentful Paint \(LCP\)/i.test(message.text())) warnings.push(message.text());
  });
  return warnings;
}

async function expectDecoded(image: Locator) {
  await expect.poll(() => image.evaluate((element) => {
    const photograph = element as HTMLImageElement;
    return photograph.complete && photograph.naturalWidth > 0 && photograph.naturalHeight > 0;
  }), { message: "The visible image must finish loading successfully." }).toBe(true);
  await image.evaluate((element) => (element as HTMLImageElement).decode());
}

async function expectInViewport(image: Locator) {
  await expect.poll(() => image.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
  }), { message: "The image must actually intersect the restored or anchor viewport." }).toBeGreaterThan(80);
}

async function finishPaint(page: Page) {
  // Allow image paint and the browser's buffered LCP observer to run.
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

test("the initial hero loads eagerly while the distant footer image remains lazy", async ({ page }) => {
  const lcpWarnings = collectLcpWarnings(page);
  await page.goto("/", { waitUntil: "networkidle" });
  const hero = page.locator("#home img").first();
  const footer = page.locator(".final-cta .final-photo img");

  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  await expectDecoded(hero);
  await expect(footer).toHaveAttribute("loading", "lazy");
  expect(await footer.evaluate((image) => image.getBoundingClientRect().top)).toBeGreaterThan(1200);
  await finishPaint(page);
  expect(lcpWarnings).toEqual([]);
});

test("the footer rosette image loads eagerly after scrolling and a restored-position reload", async ({ page }) => {
  const lcpWarnings = collectLcpWarnings(page);
  await page.goto("/", { waitUntil: "networkidle" });
  const footer = page.locator(".final-cta .final-photo img");
  await footer.scrollIntoViewIfNeeded();
  await expectInViewport(footer);
  await expect(footer).toHaveAttribute("loading", "eager");
  await expectDecoded(footer);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  await page.reload({ waitUntil: "networkidle" });
  // No manual scrolling: the browser's reload restoration must be handled.
  await expectInViewport(footer);
  await expect(footer).toHaveAttribute("loading", "eager");
  await expect(footer).toHaveAttribute("fetchpriority", "high");
  await expectDecoded(footer);
  await finishPaint(page);
  expect(lcpWarnings).toEqual([]);
});

test("direct collections navigation eagerly loads the visible card without promoting the far footer", async ({ page }) => {
  const lcpWarnings = collectLcpWarnings(page);
  await page.goto("/#collections", { waitUntil: "networkidle" });
  const collection = page.locator("#collections .collection-photo img").first();
  const footer = page.locator(".final-cta .final-photo img");

  await expectInViewport(collection);
  await expect(collection).toHaveAttribute("loading", "eager");
  await expectDecoded(collection);
  await expect(footer).toHaveAttribute("loading", "lazy");
  expect(await footer.evaluate((image) => image.getBoundingClientRect().top)).toBeGreaterThan(1200);
  await finishPaint(page);
  expect(lcpWarnings).toEqual([]);
});

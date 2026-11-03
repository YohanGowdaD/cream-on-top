import { expect, test, type Locator, type Page } from "@playwright/test";

const photographs = [
  { selector: ".intro-photo", hash: "#introduction", name: "brand introduction" },
  { selector: ".founder-photo", hash: "#our-story", name: "founder story" },
] as const;

/** Compare rendered pixels, rather than DOM visibility or PNG file metadata. */
async function changedPixelRatio(page: Page, visible: Buffer, withoutImage: Buffer) {
  return page.evaluate(async ({ first, second }) => {
    async function decode(base64: string) {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("A canvas context is required to inspect photograph pixels.");
      context.drawImage(image, 0, 0);
      return { width: canvas.width, height: canvas.height, pixels: context.getImageData(0, 0, canvas.width, canvas.height).data };
    }
    const [before, after] = await Promise.all([decode(first), decode(second)]);
    if (before.width !== after.width || before.height !== after.height) throw new Error("The photograph frame changed size during its paint check.");
    let changed = 0;
    for (let index = 0; index < before.pixels.length; index += 4) {
      const difference = Math.abs(before.pixels[index] - after.pixels[index])
        + Math.abs(before.pixels[index + 1] - after.pixels[index + 1])
        + Math.abs(before.pixels[index + 2] - after.pixels[index + 2]);
      if (difference > 30) changed += 1;
    }
    return changed / (before.width * before.height);
  }, { first: visible.toString("base64"), second: withoutImage.toString("base64") });
}

async function expectPhotographPainted(page: Page, frame: Locator) {
  const image = frame.locator("img");
  await expect(image).toHaveCount(1);
  await expect.poll(() => image.evaluate((element) => {
    const photograph = element as HTMLImageElement;
    return photograph.complete && photograph.naturalWidth > 0 && photograph.naturalHeight > 0;
  }), { message: "The photograph must load and decode successfully." }).toBe(true);
  await image.evaluate((element) => (element as HTMLImageElement).decode());

  // A fully clipped image still passes Playwright's toBeVisible assertion.
  // Inspect the image's entire ancestor chain, including the inner reveal mask.
  await expect.poll(() => image.evaluate((element) => {
    const hiddenAncestors: string[] = [];
    for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      const clip = style.clipPath;
      const openInset = clip.startsWith("inset(") && clip.slice(6, -1).split(/\s+round\s+/)[0]
        .trim().split(/\s+/).every((value) => Math.abs(Number.parseFloat(value)) < 0.01);
      if ((clip !== "none" && !openInset) || Number.parseFloat(style.opacity) < 0.99
        || style.visibility !== "visible" || style.display === "none") {
        hiddenAncestors.push(`${ancestor.tagName.toLowerCase()}.${ancestor.className}: clip=${clip}; opacity=${style.opacity}; visibility=${style.visibility}`);
      }
    }
    return hiddenAncestors;
  }), { timeout: 12000, message: "The photograph and every ancestor must finish revealing without a closed clip mask." }).toEqual([]);

  await expect.poll(() => frame.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
  }), { message: "The revealed photograph must intersect the visitor's viewport." }).toBeGreaterThan(80);

  const visible = await frame.screenshot({ animations: "disabled", caret: "hide" });
  const original = await image.evaluate((element) => ({
    value: (element as HTMLElement).style.getPropertyValue("visibility"),
    priority: (element as HTMLElement).style.getPropertyPriority("visibility"),
  }));
  let withoutImage: Buffer;
  try {
    await image.evaluate((element) => (element as HTMLElement).style.setProperty("visibility", "hidden", "important"));
    withoutImage = await frame.screenshot({ animations: "disabled", caret: "hide" });
  } finally {
    await image.evaluate((element, previous) => {
      if (previous.value) (element as HTMLElement).style.setProperty("visibility", previous.value, previous.priority);
      else (element as HTMLElement).style.removeProperty("visibility");
    }, original);
  }
  expect(await changedPixelRatio(page, visible, withoutImage!), "Hiding only the photograph must change at least 2% of the frame's painted pixels.").toBeGreaterThan(0.02);
}

test.describe("Photograph reveal paint regressions", () => {
  test.use({ reducedMotion: "no-preference" });

  for (const viewport of [{ width: 1512, height: 664 }, { width: 390, height: 844 }]) {
    test(`scrolling paints both story photographs at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      for (const photograph of photographs) {
        const frame = page.locator(photograph.selector);
        await frame.scrollIntoViewIfNeeded();
        await expectPhotographPainted(page, frame);
      }
    });
  }

  for (const photograph of photographs) {
    test(`initial hash navigation paints the ${photograph.name} photograph`, async ({ page }) => {
      await page.setViewportSize({ width: 1512, height: 900 });
      await page.goto(`/${photograph.hash}`);
      // Do not scroll manually: initial anchor navigation must trigger the reveal.
      await expectPhotographPainted(page, page.locator(photograph.selector));
    });
  }
});

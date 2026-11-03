import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
if (process.argv.includes("--motion")) {
  await mkdir("artifacts/motion-frames", { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Replay with assets cached, capturing the real entrance rather than a mockup.
  await page.reload({ waitUntil: "domcontentloaded" });
  const captured = [];
  for (let index = 0; index < 24; index++) {
    const path = `artifacts/motion-frames/frame-${String(index).padStart(2, "0")}.png`;
    const started = Date.now();
    await page.screenshot({ path });
    await page.waitForTimeout(55);
    captured.push({ path, duration: Date.now() - started });
  }
  await writeFile("artifacts/motion-frames/frames.json", JSON.stringify(captured));
  await browser.close();
  console.log("Captured 24 frames of the actual hero entrance.");
  process.exit(0);
}
for (const [name, width, height] of [["desktop", 1440, 1000], ["laptop", 1024, 900], ["tablet", 768, 1024], ["mobile", 390, 844], ["small-mobile", 360, 800]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < totalHeight; y += Math.round(height * 0.75)) {
    await page.evaluate(y => scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(200);
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth,
    headings: Array.from(document.querySelectorAll("h1,h2")).map(x => x.textContent),
    hiddenReveals: Array.from(document.querySelectorAll(".reveal")).filter(x => Number(getComputedStyle(x).opacity) < 1).map(x => x.className),
    brokenImages: Array.from(document.images).filter(x => x.getBoundingClientRect().width > 0 && (!x.complete || x.naturalWidth === 0)).map(x => x.getAttribute("src")),
    overflowing: Array.from(document.querySelectorAll("body *")).filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed"; }).slice(0, 15).map(el => ({ tag: el.tagName, class: String(el.className), width: Math.round(el.getBoundingClientRect().width) })),
  }));
  await page.screenshot({ path: `artifacts/${name}-full.png`, fullPage: true });
  await page.screenshot({ path: `artifacts/${name}-hero.png` });
  if (name === "desktop" || name === "mobile") {
    for (const section of ["collections", "our-story", "enquiry"]) {
      await page.locator(`#${section}`).screenshot({
        path: `artifacts/${name}-${section}.png`,
        style: ".site-header, .floating-enquiry, .skip-link { visibility: hidden !important; }",
      });
    }
  }
  report.push({ name, ...metrics, errors });
  await page.close();
}
await browser.close();
await writeFile("artifacts/visual-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

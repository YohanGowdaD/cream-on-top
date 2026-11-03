import { expect, test, type Page } from "@playwright/test";
import { getIndiaDate, getWhatsAppUrl } from "../src/lib/enquiry";

test.use({ reducedMotion: "reduce" });

const futureDate = "2099-12-25";
const imageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j1ioAAAAASUVORK5CYII=", "base64");
const reference = (name: string) => ({ name, mimeType: "image/png", buffer: imageBuffer });

async function fillRequired(page: Page) {
  await page.locator("#cake-name").fill("Aditi Sharma");
  await page.locator("#cake-whatsapp").fill("+91 98765 43210");
  await page.locator("#cake-occasion").selectOption("Birthday");
  await page.locator("#cake-date").fill(futureDate);
  await page.locator("#cake-flavour").selectOption("Chocolate truffle");
  await page.locator("#cake-weight").selectOption("2 kg");
  await page.locator("#cake-design").fill("An ivory floral cake with blush roses.");
}

test.describe("Cake enquiry flow", () => {
test.beforeEach(async ({ page }) => {
  await page.goto("/#enquiry");
  await expect(page.locator("#cake-name")).toBeVisible();
});

test("required details show useful errors and focus the first field", async ({ page }) => {
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  for (const field of ["name", "whatsapp", "occasion", "date", "flavour", "weight", "design"]) {
    await expect(page.locator(`#${field}-error`)).toBeVisible();
    await expect(page.locator(`#cake-${field}`)).toHaveAttribute("aria-invalid", "true");
  }
  await expect(page.locator("#cake-name")).toBeFocused();
  await expect(page.locator("#cake-email")).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#enquiry-ready")).toHaveCount(0);
});

test("invalid contact details and past dates are rejected; email remains optional", async ({ page }) => {
  await fillRequired(page);
  await page.locator("#cake-whatsapp").fill("123");
  await page.locator("#cake-email").fill("not-an-email");
  await page.locator("#cake-date").fill("2000-01-01");
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  await expect(page.locator("#whatsapp-error")).toHaveText("Enter a valid WhatsApp number, including your country code.");
  await expect(page.locator("#email-error")).toHaveText("Please enter a valid email address.");
  await expect(page.locator("#date-error")).toHaveText("Please choose today or a future date.");
  await expect(page.locator("#enquiry-ready")).toHaveCount(0);

  await page.locator("#cake-whatsapp").fill("+91 98765 43210");
  await page.locator("#cake-email").fill("");
  await page.locator("#cake-date").fill(futureDate);
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  await expect(page.locator("#enquiry-ready")).toHaveText("Your sweet idea is ready.");
  await expect(page.locator("#enquiry-message")).not.toHaveValue(/Email:/);
});

test("valid details produce the complete draft, an honest contact fallback, and editable retained values", async ({ page }) => {
  await fillRequired(page);
  await page.locator("#cake-email").fill("aditi@example.com");
  await page.locator("#cake-instructions").fill("Please discuss pickup arrangements with me.");
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  const expectedDraft = [
    "Hello Neha! I'd love to enquire about a custom cake.",
    "", "*MY CELEBRATION*", "Name: Aditi Sharma", "WhatsApp: +91 98765 43210", "Email: aditi@example.com",
    "Occasion: Birthday", "Required date: 25 December 2099", "Preferred flavour: Chocolate truffle", "Approximate weight: 2 kg",
    "", "*MY CAKE IDEA*", "An ivory floral cake with blush roses.",
    "", "*ADDITIONAL NOTES*", "Please discuss pickup arrangements with me.",
    "", "Please let me know the possibilities and a personalised quote. Thank you!",
  ].join("\n");
  await expect(page.locator("#enquiry-message")).toHaveValue(expectedDraft);
  await expect(page.getByText("WhatsApp contact coming soon", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Message on Instagram", exact: true })).toHaveAttribute("href", "https://www.instagram.com/cream_on_top_by_neha_gupta/");
  await expect(page.getByText("No enquiry has been sent or stored online.", { exact: true })).toBeVisible();
  await expect(page.locator("#enquiry a[href^='https://wa.me/']")).toHaveCount(0);
  await expect(page.locator("#enquiry-ready").locator("..")).toBeFocused();

  await page.getByRole("button", { name: "Back to edit your details" }).click();
  await expect(page.locator("#cake-name")).toHaveValue("Aditi Sharma");
  await expect(page.locator("#cake-name")).toBeFocused();
  await expect(page.locator("#cake-email")).toHaveValue("aditi@example.com");
  await expect(page.locator("#cake-date")).toHaveValue(futureDate);
  await expect(page.locator("#cake-flavour")).toHaveValue("Chocolate truffle");
  await expect(page.locator("#cake-design")).toHaveValue("An ivory floral cake with blush roses.");
  await expect(page.locator("#cake-instructions")).toHaveValue("Please discuss pickup arrangements with me.");
});

test("reference uploads reject unsupported, oversized and excess files, and allow preview removal", async ({ page }) => {
  const upload = page.locator("#cake-references");
  await upload.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
  await expect(page.locator("#reference-error")).toHaveText("Please choose JPG, PNG or WebP images.");
  await expect(upload).toHaveAttribute("aria-invalid", "true");
  await upload.setInputFiles({ name: "too-big.png", mimeType: "image/png", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
  await expect(page.locator("#reference-error")).toHaveText("Each reference image must be 5 MB or smaller.");
  await upload.setInputFiles([reference("one.png"), reference("two.png"), reference("three.png"), reference("four.png")]);
  await expect(page.locator("#reference-error")).toHaveText("You can add up to 3 reference images. Remove one to choose another.");
  await expect(page.locator("#enquiry img[alt^='Reference:']")).toHaveCount(0);

  await upload.setInputFiles([reference("one.png"), reference("two.png"), reference("three.png")]);
  await expect(page.locator("#reference-error")).toHaveCount(0);
  await expect(page.locator("#enquiry img[alt^='Reference:']")).toHaveCount(3);
  await upload.setInputFiles(reference("four.png"));
  await expect(page.locator("#reference-error")).toBeVisible();
  await page.getByRole("button", { name: "Remove two.png", exact: true }).click();
  await expect(page.getByAltText("Reference: two.png", { exact: true })).toHaveCount(0);
  await expect(page.locator("#reference-error")).toHaveCount(0);
  await upload.setInputFiles(reference("four.png"));
  await expect(page.getByAltText("Reference: four.png", { exact: true })).toBeVisible();
  await expect(page.locator("#enquiry img[alt^='Reference:']")).toHaveCount(3);
});

test("reference filenames are included in the draft and manual attachment is explained", async ({ page }) => {
  await fillRequired(page);
  await page.locator("#cake-references").setInputFiles(reference("floral-inspiration.png"));
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  await expect(page.locator("#enquiry-message")).toHaveValue(/Reference images: floral-inspiration\.png\nI will attach these images to our conversation separately\./);
  await expect(page.getByText("Your 1 reference image stays on your device. Please attach it separately in your conversation.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to edit your details" }).click();
  await expect(page.getByAltText("Reference: floral-inspiration.png", { exact: true })).toBeVisible();
});

test("the mobile form has readable inputs, no horizontal overflow, and keyboard accessible uploads", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator("#cake-name").scrollIntoViewIfNeeded();
  const bounds = await page.locator("#enquiry").evaluate((section) => ({ width: section.clientWidth, contentWidth: section.scrollWidth }));
  expect(bounds.contentWidth).toBeLessThanOrEqual(bounds.width);
  expect(await page.locator("#cake-name").evaluate((input) => Number.parseFloat(getComputedStyle(input).fontSize))).toBeGreaterThanOrEqual(16);
  await page.locator("#cake-design").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#cake-references")).toBeFocused();
  await expect(page.locator("#cake-references")).toHaveAccessibleName(/A little inspiration/);
});
});

test.describe("Enquiry handoff helpers", () => {
  test("configured WhatsApp links preserve special characters and reject placeholder contacts", () => {
    const message = "Hello Neha!\nA pink & ivory cake for Mum’s 60th? 🎂";
    const link = getWhatsAppUrl("+91 98765 43210", message);
    expect(link).not.toBeNull();
    const url = new URL(link!);
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/919876543210");
    expect(url.searchParams.get("text")).toBe(message);
    expect(getWhatsAppUrl("", message)).toBeNull();
    expect(getWhatsAppUrl("ADD_BUSINESS_NUMBER", message)).toBeNull();
    expect(getWhatsAppUrl("123", message)).toBeNull();
  });

  test("the enquiry calendar changes at midnight in Bangalore", () => {
    expect(getIndiaDate(new Date("2026-11-02T18:29:59Z"))).toBe("2026-11-02");
    expect(getIndiaDate(new Date("2026-11-02T18:30:00Z"))).toBe("2026-11-03");
  });
});

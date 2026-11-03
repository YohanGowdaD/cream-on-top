import { expect, test } from "@playwright/test";

test("completion progress counts valid required details and survives editing a draft", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const progress = page.getByRole("progressbar", { name: "Enquiry details completed" });
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.locator("#cake-name").fill("A");
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.locator("#cake-name").fill("Aditi Sharma");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await page.locator("#cake-whatsapp").fill("123");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await page.locator("#cake-whatsapp").fill("+91 98765 43210");
  await page.locator("#cake-occasion").selectOption("Birthday");
  await page.locator("#cake-date").fill("2099-12-25");
  await page.locator("#cake-flavour").selectOption("Chocolate truffle");
  await page.locator("#cake-weight").selectOption("2 kg");
  await page.locator("#cake-design").fill("An ivory cake with a garden of blush roses.");
  await expect(progress).toHaveAttribute("aria-valuenow", "7");
  await expect(page.getByText("Ready when you are", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Create My Cake Enquiry" }).click();
  await expect(page.locator("#enquiry-ready").locator("..")).toBeFocused();
  await page.getByRole("button", { name: "Back to edit your details" }).click();
  await expect(page.locator("#cake-name")).toBeFocused();
  await expect(progress).toHaveAttribute("aria-valuenow", "7");
  await page.locator("#cake-design").fill("");
  await expect(progress).toHaveAttribute("aria-valuenow", "6");
});

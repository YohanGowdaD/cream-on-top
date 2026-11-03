import { z } from "zod";

export const occasions = ["Birthday", "Wedding", "Engagement", "Anniversary", "Baby shower", "Kids' celebration", "Other"] as const;
export const flavours = ["Chocolate", "Chocolate truffle", "Vanilla", "Red velvet", "Butterscotch", "Custom flavour", "To be discussed"] as const;
export const weights = ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "Custom"] as const;

/** The bakery's calendar date, independent of the visitor's timezone. */
export function getIndiaDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}`;
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Please use 100 characters or fewer."),
  whatsapp: z.string().trim().refine((value) => {
    const digits = value.replace(/\D/g, "");
    return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  }, "Enter a valid WhatsApp number, including your country code."),
  email: z.string().trim().max(254, "Please use a shorter email address.").refine((value) => value === "" || z.email().safeParse(value).success, "Please enter a valid email address."),
  occasion: z.string().refine((value) => occasions.includes(value as typeof occasions[number]), "Please choose an occasion."),
  date: z.string().refine(isRealDate, "Please select a valid celebration date.").refine((value) => value >= getIndiaDate(), "Please choose today or a future date."),
  flavour: z.string().refine((value) => flavours.includes(value as typeof flavours[number]), "Please choose a flavour, or select ‘To be discussed’."),
  weight: z.string().refine((value) => weights.includes(value as typeof weights[number]), "Please choose an approximate cake weight."),
  design: z.string().trim().min(10, "Tell us a little more about your idea (at least 10 characters).").max(2000, "Please keep your idea to 2,000 characters."),
  instructions: z.string().trim().max(2000, "Please use 2,000 characters or fewer."),
});

export type CakeEnquiryValues = z.infer<typeof enquirySchema>;

export function buildEnquiryMessage(values: CakeEnquiryValues, referenceNames: string[] = []): string {
  const displayDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" }).format(new Date(`${values.date}T12:00:00Z`));
  return [
    "Hello Neha! I'd love to enquire about a custom cake.",
    "", "*MY CELEBRATION*",
    `Name: ${values.name}`, `WhatsApp: ${values.whatsapp}`,
    ...(values.email ? [`Email: ${values.email}`] : []),
    `Occasion: ${values.occasion}`, `Required date: ${displayDate}`,
    `Preferred flavour: ${values.flavour}`, `Approximate weight: ${values.weight}`,
    "", "*MY CAKE IDEA*", values.design,
    ...(values.instructions ? ["", "*ADDITIONAL NOTES*", values.instructions] : []),
    ...(referenceNames.length ? ["", `Reference images: ${referenceNames.join(", ")}`, "I will attach these images to our conversation separately."] : []),
    "", "Please let me know the possibilities and a personalised quote. Thank you!",
  ].join("\n");
}

export function getWhatsAppUrl(number: string, message = ""): string | null {
  if (!/^\+?[\d\s().-]+$/.test(number)) return null;
  const digits = number.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

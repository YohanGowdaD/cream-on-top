/** Verified details supplied in the project brief. Add launch details in .env.local. */
export const business = {
  name: "Cream on Top by Neha Gupta",
  founder: "Neha Gupta",
  location: "Bangalore, India",
  instagramHandle: "@cream_on_top_by_neha_gupta",
  instagramUrl: "https://www.instagram.com/cream_on_top_by_neha_gupta/",
  // PLACEHOLDER: the real business number, including country code, is required before launch.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "",
  // PLACEHOLDER: set the verified production origin before enabling the canonical URL.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
} as const;

export const businessConfig = business;

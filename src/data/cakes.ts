export const cakeCategories = [
  { id: "all", label: "All creations" },
  { id: "birthday", label: "Birthday" },
  { id: "wedding", label: "Wedding" },
  { id: "anniversary", label: "Anniversary" },
  { id: "kids", label: "Kids" },
  { id: "designer", label: "Designer" },
  { id: "custom", label: "Custom" },
] as const;

export type CakeCategory = (typeof cakeCategories)[number]["id"];

export type Cake = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<CakeCategory, "all">;
  image: string;
  alt: string;
  ratio: "portrait" | "square" | "landscape";
  position?: string;
};

export const cakes: Cake[] = [
  {
    id: "birthday",
    title: "The golden birthday",
    subtitle: "Birthday celebrations",
    category: "birthday",
    image: "/images/generated/golden-birthday.webp",
    alt: "AI-generated cake inspiration: an ivory birthday cake with delicate gold details",
    ratio: "portrait",
  },
  {
    id: "wedding",
    title: "A gilded forever",
    subtitle: "Wedding celebrations",
    category: "wedding",
    image: "/images/generated/pearl-wedding.webp",
    alt: "AI-generated cake inspiration: an elegant tiered wedding cake with pearl detailing",
    ratio: "portrait",
  },
  {
    id: "floral",
    title: "Petals & promises",
    subtitle: "Wedding celebrations",
    category: "wedding",
    image: "/images/generated/floral-wedding.webp",
    alt: "AI-generated cake inspiration: a romantic tiered wedding cake with floral decorations",
    ratio: "portrait",
  },
  {
    id: "kids",
    title: "A wild little celebration",
    subtitle: "Kids’ celebrations",
    category: "kids",
    image: "/images/generated/jungle-party.webp",
    alt: "AI-generated cake inspiration: a playful jungle birthday cake with animal figures and botanical details",
    ratio: "portrait",
    position: "50% 52%",
  },
  {
    id: "designer",
    title: "Blush couture",
    subtitle: "Designer creations",
    category: "designer",
    image: "/images/generated/couture-dress.webp",
    alt: "AI-generated cake inspiration: a blush pink couture-inspired dress cake",
    ratio: "portrait",
  },
  {
    id: "celebration",
    title: "After dark, in gold",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/generated/midnight-celebration.webp",
    alt: "AI-generated cake inspiration: a dark celebration cake with gold accents",
    ratio: "portrait",
  },
  {
    id: "construction",
    title: "Building birthday memories",
    subtitle: "Birthday celebrations",
    category: "birthday",
    image: "/images/generated/construction-party.webp",
    alt: "AI-generated cake inspiration: a construction-themed birthday cake with miniature vehicles",
    ratio: "portrait",
  },
  {
    id: "anniversary",
    title: "A ribbon of romance",
    subtitle: "Anniversary celebrations",
    category: "anniversary",
    image: "/images/generated/hero-bow.webp",
    alt: "AI-generated cake inspiration: a romantic celebration cake decorated with an oversized ribbon bow",
    ratio: "portrait",
  },
  {
    id: "princess-castle",
    title: "Once upon a celebration",
    subtitle: "Kids’ celebrations",
    category: "kids",
    image: "/images/generated/princess-castle.webp",
    alt: "AI-generated cake inspiration: a blush and ivory castle cake with delicate turrets",
    ratio: "portrait",
    position: "50% 48%",
  },
  {
    id: "badminton",
    title: "A perfect match",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/generated/badminton-party.webp",
    alt: "AI-generated cake inspiration: a badminton-themed celebration cake with racket details",
    ratio: "portrait",
    position: "50% 52%",
  },
  {
    id: "chocolate-celebration",
    title: "A little chocolate luxury",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/generated/chocolate-tasting.webp",
    alt: "AI-generated cake inspiration: an assortment of small chocolate desserts with refined finishes",
    ratio: "square",
  },
  {
    id: "rosette-heart",
    title: "A heart full of petals",
    subtitle: "Birthday celebrations",
    category: "birthday",
    image: "/images/generated/rosette-heart.webp",
    alt: "AI-generated cake inspiration: a heart-shaped cake finished with pink buttercream rosettes",
    ratio: "portrait",
    position: "50% 52%",
  },
];

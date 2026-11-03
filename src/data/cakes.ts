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
    image: "/images/cakes/golden-crown.webp",
    alt: "A white and gold birthday cake topped with a golden crown, by Cream on Top by Neha Gupta",
    ratio: "portrait",
  },
  {
    id: "wedding",
    title: "A gilded forever",
    subtitle: "Wedding celebrations",
    category: "wedding",
    image: "/images/weddings/wedding.webp",
    alt: "An elegant white multi-tier cake with sparkling gold details, by Cream on Top by Neha Gupta",
    ratio: "square",
  },
  {
    id: "floral",
    title: "Petals & promises",
    subtitle: "Wedding celebrations",
    category: "wedding",
    image: "/images/cakes/floral.webp",
    alt: "A white multi-tier wedding cake with ivory ruffles and burgundy flowers, by Cream on Top by Neha Gupta",
    ratio: "portrait",
  },
  {
    id: "kids",
    title: "A wild little celebration",
    subtitle: "Kids’ celebrations",
    category: "kids",
    image: "/images/kids/jungle-tiers.webp",
    alt: "A colourful jungle-themed children’s birthday cake with animal figures, by Cream on Top by Neha Gupta",
    ratio: "portrait",
    position: "50% 52%",
  },
  {
    id: "designer",
    title: "A Barbie kind of birthday",
    subtitle: "Designer creations",
    category: "designer",
    image: "/images/cakes/barbie-dress.webp",
    alt: "A Barbie doll cake with a beautifully detailed pink and white dress, by Cream on Top by Neha Gupta",
    ratio: "portrait",
  },
  {
    id: "celebration",
    title: "Fifty, in the spotlight",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/cakes/film-fiftieth.webp",
    alt: "A personalised filmmaker and Netflix-themed fiftieth birthday cake, by Cream on Top by Neha Gupta",
    ratio: "portrait",
  },
  {
    id: "construction",
    title: "Building birthday memories",
    subtitle: "Birthday celebrations",
    category: "birthday",
    image: "/images/cakes/construction-truck.webp",
    alt: "A yellow construction-themed birthday cake with miniature trucks, by Cream on Top by Neha Gupta",
    ratio: "square",
  },
  {
    id: "anniversary",
    title: "Eight years of sweet memories",
    subtitle: "Our brand anniversary cake",
    category: "anniversary",
    image: "/images/cakes/eighth-anniversary.webp",
    alt: "The pink three-tier cake celebrating Cream on Top’s historical eighth anniversary, with heart cutouts, a crown and bows",
    ratio: "square",
  },
  {
    id: "princess-castle",
    title: "Once upon a celebration",
    subtitle: "Kids’ celebrations",
    category: "kids",
    image: "/images/cakes/princess-castle.webp",
    alt: "A pink and ivory princess castle cake with tall turrets and floral details, by Cream on Top by Neha Gupta",
    ratio: "portrait",
    position: "50% 48%",
  },
  {
    id: "badminton",
    title: "A perfect match",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/cakes/badminton-celebration.webp",
    alt: "A personalised green badminton cake with racket decorations and matching blue cupcakes, by Cream on Top by Neha Gupta",
    ratio: "square",
    position: "50% 42%",
  },
  {
    id: "chocolate-celebration",
    title: "Little bites, big celebration",
    subtitle: "Custom celebrations",
    category: "custom",
    image: "/images/cakes/chocolate-celebration.webp",
    alt: "An assortment of chocolate-topped celebration squares with biscuit and strawberry decorations, by Cream on Top by Neha Gupta",
    ratio: "square",
  },
  {
    id: "rosette-heart",
    title: "A heart full of petals",
    subtitle: "Birthday celebrations",
    category: "birthday",
    image: "/images/cakes/rosette-heart.webp",
    alt: "A heart-shaped birthday cake covered in pink buttercream petals and pearl details, by Cream on Top by Neha Gupta",
    ratio: "portrait",
    position: "50% 42%",
  },
];

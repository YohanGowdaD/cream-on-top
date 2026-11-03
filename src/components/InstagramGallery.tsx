import { ViewportImage as Image } from "./ViewportImage";
import { ArrowUpRight, Instagram } from "lucide-react";
import { business } from "@/config/business";
import { Reveal } from "./Reveal";

const images = [
  {
    "src": "/images/generated/floral-wedding.webp",
    "alt": "An ivory wedding cake with sculpted blush sugar roses",
    "position": "50% 54%"
  },
  {
    "src": "/images/generated/chocolate-tasting.webp",
    "alt": "Nine chocolate pastries with ganache, raspberries, chocolate curls and gold leaf",
    "position": "50% 54%"
  },
  {
    "src": "/images/generated/rosette-heart.webp",
    "alt": "A heart-shaped cake covered in blush buttercream rosettes",
    "position": "50% 54%"
  },
  {
    "src": "/images/generated/princess-castle.webp",
    "alt": "A refined ivory and blush princess castle cake",
    "position": "50% 54%"
  },
  {
    "src": "/images/generated/jungle-party.webp",
    "alt": "A sage and ivory jungle cake with handmade animal figures",
    "position": "50% 54%"
  }
];

export function InstagramGallery() {
  return <section className="instagram section-space"><div className="container"><Reveal className="instagram-heading"><div><p className="eyebrow">LITTLE SQUARES OF HAPPINESS</p><h2>Follow the <em>sweetness.</em></h2></div><a className="text-link" href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={17}/><span>@cream_on_top_by_neha_gupta</span><ArrowUpRight size={15}/></a></Reveal><div className="instagram-grid">{images.map((image, i) => <a key={image.src} className="instagram-photo" href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit Cream on Top on Instagram for more inspiration, link ${i + 1}`}><Image src={image.src} alt={`AI-generated cake inspiration: ${image.alt}`} fill quality={90} sizes="(max-width: 767px) 45vw, 20vw" style={{ objectPosition: image.position }}/><span><Instagram size={24} strokeWidth={1.5}/></span></a>)}</div><div className="instagram-bottom"><p>AI-generated cake inspiration. See Neha’s latest work on Instagram.</p><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link">Follow Us on Instagram <ArrowUpRight size={16}/></a></div></div></section>;
}

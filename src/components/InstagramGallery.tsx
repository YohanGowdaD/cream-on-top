import Image from "next/image";
import { ArrowUpRight, Instagram } from "lucide-react";
import { business } from "@/config/business";
import { Reveal } from "./Reveal";

const images = [
  { src: "/images/cakes/floral-princess.webp", alt: "A pastel princess cake with pink and ivory fondant flowers", position: "50% 42%" },
  { src: "/images/cakes/chocolate-celebration.webp", alt: "Chocolate-topped celebration squares with biscuit and strawberry decorations", position: "50% 50%" },
  { src: "/images/cakes/rosette-heart.webp", alt: "A heart-shaped cake covered with delicate pink buttercream petals", position: "50% 42%" },
  { src: "/images/cakes/princess-castle.webp", alt: "A pink and ivory castle cake with tall princess turrets", position: "50% 50%" },
  { src: "/images/cakes/badminton-celebration.webp", alt: "A personalised badminton cake and matching blue racket cupcakes", position: "50% 48%" },
];

export function InstagramGallery() {
  return <section className="instagram section-space"><div className="container"><Reveal className="instagram-heading"><div><p className="eyebrow">LITTLE SQUARES OF HAPPINESS</p><h2>Follow the <em>sweetness.</em></h2></div><a className="text-link" href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={17}/><span>@cream_on_top_by_neha_gupta</span><ArrowUpRight size={15}/></a></Reveal><div className="instagram-grid">{images.map((image, i) => <a key={image.src} className="instagram-photo" href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`View Cream on Top cake inspiration ${i + 1} on Instagram`}><Image src={image.src} alt={`${image.alt}, by Cream on Top by Neha Gupta`} fill sizes="(max-width: 600px) 45vw, 20vw" style={{ objectPosition: image.position }}/><span><Instagram size={24} strokeWidth={1.5}/></span></a>)}</div><div className="instagram-bottom"><p>A few favourites from our Instagram. There’s always more sweetness in the making.</p><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link">Follow Us on Instagram <ArrowUpRight size={16}/></a></div></div></section>;
}

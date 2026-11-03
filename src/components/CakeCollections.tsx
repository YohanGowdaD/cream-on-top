"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const collections = [
  { id: "birthday", title: "Birthday Cakes", note: "Another year. A little more magic.", image: "/images/cakes/rosette-heart.webp", alt: "A heart-shaped birthday cake decorated with pink buttercream petals and pearls", position: "50% 45%" },
  { id: "wedding", title: "Wedding Cakes", note: "A beautiful beginning, in every tier.", image: "/images/weddings/wedding.webp", alt: "A white multi-tier cake with sparkling gold details", position: "50% 50%" },
  { id: "anniversary", title: "Engagement & Anniversary", note: "For a love worth celebrating.", image: "/images/cakes/eighth-anniversary.webp", alt: "A pink celebration cake with a crown, heart cutout and draped fondant bow", position: "50% 48%" },
  { id: "kids", title: "Kids’ Theme Cakes", note: "Little imaginations, brought to life.", image: "/images/cakes/princess-castle.webp", alt: "A pink and ivory princess castle cake with tall turrets", position: "50% 48%" },
  { id: "designer", title: "Designer & Fondant", note: "Where cake becomes a work of art.", image: "/images/cakes/barbie-dress.webp", alt: "A Barbie doll cake with an intricately piped pink and white dress", position: "50% 48%" },
  { id: "custom", title: "Custom Celebrations", note: "Your story. Your very own creation.", image: "/images/cakes/badminton-celebration.webp", alt: "A personalised badminton cake with matching blue racket cupcakes", position: "50% 48%" },
];

export function CakeCollections() {
  function choose(id: string) { window.dispatchEvent(new CustomEvent("cake-category", { detail: id })); }
  return <section id="collections" className="collections section-space"><div className="container"><Reveal className="section-heading centered"><p className="eyebrow">SOMETHING FOR YOUR EVERY OCCASION</p><h2>Made for every <em>celebration.</em></h2><p>Whatever the occasion, let’s make it unforgettable.</p></Reveal><div className="collection-grid">{collections.map((item, i) => <Reveal key={item.id} delay={(i % 3) * .08} className={`collection-item collection-${i + 1}`}><a href="#creations" onClick={() => choose(item.id)} className="collection-link" aria-label={`Explore ${item.title}`}><div className="collection-photo"><Image src={item.image} alt={`${item.alt}, by Cream on Top by Neha Gupta`} fill sizes="(max-width: 390px) calc((100vw - 49px) / 2), (max-width: 767px) calc((100vw - 65px) / 2), (max-width: 1023px) calc((100vw - 120px) / 3), (max-width: 1200px) calc((100vw - 136px) / 3), (max-width: 1408px) calc((100vw - 184px) / 3), 408px" style={{ objectPosition: item.position }}/><span className="collection-number">0{i + 1}</span><span className="collection-explore">Explore collection <ArrowUpRight size={16}/></span></div><div className="collection-title"><h3>{item.title}</h3><ArrowUpRight size={20} strokeWidth={1.2}/></div><p>{item.note}</p></a></Reveal>)}</div></div></section>;
}

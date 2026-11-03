"use client";

import { ViewportImage as Image } from "./ViewportImage";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const collections = [
  {
    "id": "birthday",
    "title": "Birthday Cakes",
    "note": "Another year. A little more magic.",
    "image": "/images/generated/rosette-heart.webp",
    "alt": "A heart-shaped cake with pink buttercream rosettes and ivory pearls",
    "position": "50% 52%"
  },
  {
    "id": "wedding",
    "title": "Wedding Cakes",
    "note": "A beautiful beginning, in every tier.",
    "image": "/images/generated/pearl-wedding.webp",
    "alt": "A three-tier ivory wedding cake with delicate pearl piping and gold leaf",
    "position": "50% 52%"
  },
  {
    "id": "anniversary",
    "title": "Engagement & Anniversary",
    "note": "For a love worth celebrating.",
    "image": "/images/generated/hero-bow.webp",
    "alt": "An ivory and blush cake with sugar roses and a cascading fondant bow",
    "position": "50% 52%"
  },
  {
    "id": "kids",
    "title": "Kids’ Theme Cakes",
    "note": "Little imaginations, brought to life.",
    "image": "/images/generated/princess-castle.webp",
    "alt": "An ivory and blush castle cake with refined turrets and tiny sugar flowers",
    "position": "50% 52%"
  },
  {
    "id": "designer",
    "title": "Designer & Fondant",
    "note": "Where cake becomes a work of art.",
    "image": "/images/generated/couture-dress.webp",
    "alt": "An elegant blush fondant dress cake with a ruffled skirt and sugar bow",
    "position": "50% 52%"
  },
  {
    "id": "custom",
    "title": "Custom Celebrations",
    "note": "Your story. Your very own creation.",
    "image": "/images/generated/badminton-party.webp",
    "alt": "An ivory and sage badminton cake with edible rackets, a shuttlecock and matching cupcakes",
    "position": "50% 52%"
  }
];

export function CakeCollections() {
  function choose(id: string) { window.dispatchEvent(new CustomEvent("cake-category", { detail: id })); }
  return <section id="collections" className="collections section-space"><div className="container"><Reveal className="section-heading centered"><p className="eyebrow">SOMETHING FOR YOUR EVERY OCCASION</p><h2>Made for every <em>celebration.</em></h2><p>AI-generated designs to spark your next celebration.</p></Reveal><div className="collection-grid">{collections.map((item, i) => <Reveal key={item.id} delay={(i % 3) * .08} className={`collection-item collection-${i + 1}`}><a href="#creations" onClick={() => choose(item.id)} className="collection-link" aria-label={`Explore ${item.title}`}><div className="collection-photo"><Image src={item.image} alt={`AI-generated cake inspiration: ${item.alt}`} fill quality={90} sizes="(max-width: 390px) calc((100vw - 49px) / 2), (max-width: 767px) calc((100vw - 65px) / 2), (max-width: 1023px) calc((100vw - 120px) / 3), (max-width: 1200px) calc((100vw - 136px) / 3), (max-width: 1408px) calc((100vw - 184px) / 3), 408px" style={{ objectPosition: item.position }}/><span className="collection-number">0{i + 1}</span><span className="collection-explore">Explore collection <ArrowUpRight size={16}/></span></div><div className="collection-title"><h3>{item.title}</h3><ArrowUpRight size={20} strokeWidth={1.2}/></div><p>{item.note}</p></a></Reveal>)}</div></div></section>;
}

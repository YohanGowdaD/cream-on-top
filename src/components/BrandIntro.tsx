import { PhotoReveal } from "./PhotoReveal";
import { ArrowUpRight, Heart } from "lucide-react";
import { Reveal } from "./Reveal";

export function BrandIntro() {
  return <section id="introduction" className="introduction section-space"><div className="container intro-grid"><Reveal className="intro-visual"><PhotoReveal className="intro-photo" src="/images/founder/studio-celebrations.webp" alt="Neha Gupta with her handcrafted collection of themed celebration cakes" sizes="(max-width: 767px) 85vw, 38vw"/><span className="vertical-note">SMALL DETAILS. BEAUTIFUL MEMORIES.</span><div className="intro-image-note"><Heart size={16} strokeWidth={1.2}/><span>Made by hand.<br/>Meant for the heart.</span></div></Reveal><Reveal className="intro-copy" delay={.1}><p className="eyebrow">WELCOME TO CREAM ON TOP</p><h2>A little sweetness.<br/><em>A lot of love.</em></h2><span className="short-rule"/><p>At Cream on Top, every cake tells a story. From intimate celebrations to unforgettable milestones, we create personalised cakes that bring your sweetest ideas to life.</p><p>Beautiful on the outside. Unforgettable on the inside. And always, unmistakably you.</p><a href="#our-story" className="text-link">Discover Our Story <ArrowUpRight size={16}/></a></Reveal></div></section>;
}

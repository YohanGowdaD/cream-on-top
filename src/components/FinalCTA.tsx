import { ViewportImage as Image } from "./ViewportImage";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return <section className="final-cta"><div className="final-photo"><Image src="/images/generated/rosette-heart.webp" alt="AI-generated cake inspiration: a heart-shaped cake covered in crisp blush buttercream rosettes and ivory pearls" fill quality={90} sizes="(max-width: 767px) 100vw, 50vw" style={{ objectPosition: "50% 55%" }}/></div><Reveal className="final-copy"><p className="eyebrow">LET’S MAKE A BEAUTIFUL MEMORY</p><h2>Your celebration.<br/><em>Our creation.</em></h2><p>Have an idea for your dream cake?<br/>Let’s bring it to life.</p><a href="#enquiry" className="button button-light">Let’s Bake Something Beautiful <ArrowUpRight size={16}/></a></Reveal></section>;
}

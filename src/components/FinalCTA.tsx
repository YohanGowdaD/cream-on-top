import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return <section className="final-cta"><div className="final-photo"><Image src="/images/cakes/rosette-heart.webp" alt="A heart-shaped cake with layers of delicate pink buttercream petals and pearl details" fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectPosition: "50% 42%" }}/></div><Reveal className="final-copy"><p className="eyebrow">LET’S MAKE A BEAUTIFUL MEMORY</p><h2>Your celebration.<br/><em>Our creation.</em></h2><p>Have an idea for your dream cake?<br/>Let’s bring it to life.</p><a href="#enquiry" className="button button-light">Let’s Bake Something Beautiful <ArrowUpRight size={16}/></a></Reveal></section>;
}

import { ArrowUpRight, Instagram, MapPin } from "lucide-react";
import { business } from "@/config/business";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><BrandMark/><p>A little sweetness.<br/>A lot of love. Always.</p></div><div className="footer-nav"><span className="eyebrow">TAKE A LITTLE LOOK</span><a href="#our-story">Our Story</a><a href="#collections">Our Collections</a><a href="#creations">Creations</a><a href="#testimonials">Sweet Words</a></div><div className="footer-contact"><span className="eyebrow">LET’S MAKE SOMETHING SPECIAL</span><a href="#enquiry">Start a cake enquiry <ArrowUpRight size={15}/></a><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer"><Instagram size={15}/> Find us on Instagram <ArrowUpRight size={15}/></a><p><MapPin size={15}/> Bangalore, India</p><a className="footer-whatsapp" href="#enquiry">Prepare a WhatsApp enquiry <ArrowUpRight size={14}/></a></div></div><div className="footer-bottom"><p>© 2026 Cream on Top by Neha Gupta. All rights reserved.</p><span>THOUGHTFULLY CRAFTED. SWEETLY REMEMBERED.</span></div></div></footer>;
}

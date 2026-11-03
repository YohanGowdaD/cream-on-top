"use client";

import { MessageCircle, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { business } from "@/config/business";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const onScroll = () => setVisible(window.scrollY > 480); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const digits = business.whatsappNumber.replace(/\D/g, "");
  return <a className={`floating-enquiry${visible ? " visible" : ""}`} href={digits ? `https://wa.me/${digits}?text=${encodeURIComponent("Hi Neha! I’d love to enquire about a custom cake.")}` : "#enquiry"} {...(digits ? { target: "_blank", rel: "noopener noreferrer" } : {})} tabIndex={visible ? 0 : -1} aria-label={digits ? "Enquire on WhatsApp" : "Start a cake enquiry"}><MessageCircle size={20}/><span>Let’s talk cake</span><ArrowUpRight size={15}/></a>;
}

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandIntro } from "@/components/BrandIntro";
import { CakeCollections } from "@/components/CakeCollections";
import { CreationsGallery } from "@/components/CreationsGallery";
import { FounderStory } from "@/components/FounderStory";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Testimonials } from "@/components/Testimonials";
import { OrderingProcess } from "@/components/OrderingProcess";
import { CakeEnquiryForm } from "@/components/CakeEnquiryForm";
import { InstagramGallery } from "@/components/InstagramGallery";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Navbar/><main id="main-content" className="relative"><Hero/><div className="brand-ribbon" aria-label="Our approach"><span>Thoughtfully designed</span><span aria-hidden="true">✧</span><span>Beautifully handmade</span><span aria-hidden="true">✧</span><span>Uniquely yours</span></div><BrandIntro/><CakeCollections/><CreationsGallery/><FounderStory/><WhyChooseUs/><Testimonials/><OrderingProcess/><CakeEnquiryForm/><InstagramGallery/><FinalCTA/></main><Footer/><WhatsAppButton/></>;
}

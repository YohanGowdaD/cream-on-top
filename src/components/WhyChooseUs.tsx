import { Heart, Palette, Sparkles, WandSparkles } from "lucide-react";
import { Reveal } from "./Reveal";

const qualities = [
  { Icon: Heart, title: "Made Just for You", copy: "Every design is customised around your celebration and preferences." },
  { Icon: Sparkles, title: "Crafted with Passion", copy: "Thoughtful details and creativity go into every creation." },
  { Icon: Palette, title: "Your Vision, Our Creation", copy: "Reference images and personal ideas help inspire your cake." },
  { Icon: WandSparkles, title: "Memories Worth Celebrating", copy: "Cakes designed to make life’s special moments even sweeter." },
];

export function WhyChooseUs() {
  return <section className="experience section-space"><div className="container"><Reveal className="section-heading centered"><p className="eyebrow">THOUGHTFUL FROM THE VERY FIRST LAYER</p><h2>More than just <em>a cake.</em></h2></Reveal><div className="quality-grid">{qualities.map(({ Icon, title, copy }, i) => <Reveal className="quality" key={title} delay={i * .07}><Icon size={29} strokeWidth={1.1}/><h3>{title}</h3><p>{copy}</p></Reveal>)}</div></div></section>;
}

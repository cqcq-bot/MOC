import { ArrowUpRight, Instagram } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { instagramUrl } from "@/lib/content/minus-one";

export function FinalCTA() {
  return (
    <section id="order" className="section final-section">
      <img className="final-logo" src="/assets/moc-logo-original.png" alt="MOC logo" />
      <p className="eyebrow">Your next batch is one DM away</p>
      <h2>Find your next favourite.</h2>
      <LiquidButton>Open Instagram DM</LiquidButton>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Minus One Coffee</span>
        <span>home-based / small batch / made with care</span>
        <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Minus One Coffee on Instagram"><Instagram size={18} aria-hidden="true" /></a>
      </footer>
      <a className="back-to-top" href="#discover" aria-label="Back to top"><ArrowUpRight size={17} aria-hidden="true" /></a>
    </section>
  );
}

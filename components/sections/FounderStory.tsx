import { ArrowUpRight, Heart, Sparkles } from "lucide-react";
import { instagramUrl } from "@/lib/content/minus-one";

export function FounderStory() {
  return (
    <section id="founder" className="section founder-section">
      <div className="story-visual" aria-label="A small-batch coffee story">
        <div className="story-stamp">
          <img src="/assets/moc-logo-original.png" alt="MOC logo" />
          <span>small batch</span>
        </div>
        <div className="story-portrait">
          <span className="portrait-sun" />
          <span className="portrait-shape portrait-shape-one" />
          <span className="portrait-shape portrait-shape-two" />
          <span className="portrait-cup">01</span>
        </div>
        <span className="story-caption">made at home / shared with care</span>
      </div>
      <div className="story-copy">
        <p className="eyebrow">The story behind the cup</p>
        <h2>One kitchen. A lot of curiosity.</h2>
        <p>
          Minus One started with a simple idea: make the coffee you keep thinking about, then share it while it is still fresh. Every batch is mixed, poured, and packed by hand.
        </p>
        <div className="story-signals">
          <span><Heart size={16} aria-hidden="true" /> Made with care</span>
          <span><Sparkles size={16} aria-hidden="true" /> Always experimenting</span>
        </div>
        <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
          Meet us on Instagram <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

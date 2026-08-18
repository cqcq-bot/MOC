import { ArrowUpRight } from "lucide-react";
import { MasterCupScene } from "@/components/three/MasterCupScene";

const signatures = [
  { name: "Spanish Latte", detail: "sweet / silky / bold", tone: "coffee" as const, color: "copper" },
  { name: "Strawberry Matcha", detail: "bright / creamy / fresh", tone: "seasonal" as const, color: "olive" },
  { name: "Earl Grey Matcha", detail: "floral / earthy / soft", tone: "matcha" as const, color: "walnut" }
];

export function SignatureDrinks() {
  return (
    <section id="signature" className="section signature-section">
      <div className="section-heading">
        <p className="eyebrow">Worth coming back for</p>
        <h2>Three signatures. Zero boring sips.</h2>
      </div>
      <div className="signature-grid">
        {signatures.map((drink, index) => (
          <article className={`signature-card ${drink.color}`} key={drink.name}>
            <div className="signature-scene"><MasterCupScene tone={drink.tone} /></div>
            <div className="signature-meta">
              <span className="signature-index">0{index + 1}</span>
              <div>
                <h3>{drink.name}</h3>
                <p>{drink.detail}</p>
              </div>
              <a href="#menu" aria-label={`View ${drink.name} in menu`}><ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

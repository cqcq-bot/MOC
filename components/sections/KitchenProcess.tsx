import { Beaker, Coffee, PackageCheck } from "lucide-react";

const process = [
  { number: "01", icon: Coffee, title: "Pick your mood", body: "Bright coffee, creamy matcha, or something sweet." },
  { number: "02", icon: Beaker, title: "We make the batch", body: "Small pours, careful layers, and a little room to play." },
  { number: "03", icon: PackageCheck, title: "Packed for pickup", body: "Your order is ready fresh, with details shared in your DM." }
];

export function KitchenProcess() {
  return (
    <section id="kitchen" className="section kitchen-section">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow">From our kitchen</p>
          <h2>The good stuff takes a few extra minutes.</h2>
        </div>
        <p>Our process is intentionally small: less waiting around, more attention in every cup.</p>
      </div>
      <div className="process-grid">
        {process.map(({ number, icon: Icon, title, body }) => (
          <article key={number} className="process-card">
            <div className="process-topline"><span>{number}</span><Icon size={21} strokeWidth={1.8} aria-hidden="true" /></div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

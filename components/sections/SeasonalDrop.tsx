import { ArrowUpRight, CalendarDays, Cherry, Sparkles } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";

export function SeasonalDrop() {
  return (
    <section id="drop" className="section drop-section">
      <div className="drop-art" aria-hidden="true">
        <span className="drop-orbit drop-orbit-one" />
        <span className="drop-orbit drop-orbit-two" />
        <Sparkles className="drop-spark fruit-one" size={76} strokeWidth={1.2} />
        <Sparkles className="drop-spark fruit-two" size={42} strokeWidth={1.2} />
        <span className="drop-number">04</span>
      </div>
      <div className="drop-copy">
        <p className="eyebrow"><Cherry size={15} aria-hidden="true" /> Limited seasonal drop</p>
        <h2>Strawberry Matcha is having a little moment.</h2>
        <p>Fresh, milky, and just sweet enough. Available in small batches while the season lasts.</p>
        <div className="drop-details">
          <span><CalendarDays size={16} aria-hidden="true" /> DM for this week&apos;s batch</span>
          <span>RM18</span>
        </div>
        <div className="drop-actions">
          <LiquidButton>Ask about the drop</LiquidButton>
          <a className="text-link dark-link" href="#instagram">See the latest <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

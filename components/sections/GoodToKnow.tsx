"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/lib/content/minus-one";

export function GoodToKnow() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section faq-section">
      <div className="faq-intro">
        <p className="eyebrow">Good to know</p>
        <h2>Before you slide into our DMs.</h2>
        <p>Short answers for the practical bits. New here? Start with the menu, then say hi.</p>
      </div>
      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = open === index;
          return (
            <div className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
                <span>{item.q}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
              <div className="faq-answer" hidden={!isOpen}><p>{item.a}</p></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

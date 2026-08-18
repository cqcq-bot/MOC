"use client";

import { useMemo, useState } from "react";
import { MasterCupScene } from "@/components/three/MasterCupScene";
import { menuItems, type DrinkCategory } from "@/lib/content/minus-one";

const filters: Array<"All" | DrinkCategory> = ["All", "Coffee", "Matcha", "Chocolate", "Seasonal"];

const toneByCategory = {
  Coffee: "coffee",
  Matcha: "matcha",
  Chocolate: "chocolate",
  Seasonal: "seasonal"
} as const;

export function MenuExperience() {
  const [active, setActive] = useState<"All" | DrinkCategory>("All");
  const [selected, setSelected] = useState(menuItems[2]);
  const visible = useMemo(() => (active === "All" ? menuItems : menuItems.filter((item) => item.category === active)), [active]);
  const tone = toneByCategory[selected.category];

  const handleFilterChange = (filter: "All" | DrinkCategory) => {
    setActive(filter);
    if (filter !== "All") {
      const firstMatch = menuItems.find((item) => item.category === filter);
      if (firstMatch) setSelected(firstMatch);
    }
  };

  return (
    <section id="menu" className="section menu-section">
      <div className="section-heading">
        <p className="eyebrow">Menu Experience</p>
        <h2>Coffee, matcha, chocolate, and seasonal worlds.</h2>
      </div>
      <div className="menu-layout">
        <div className="menu-panel">
          <div className="filter-row" role="tablist" aria-label="Drink categories">
            {filters.map((filter) => (
              <button key={filter} className={active === filter ? "active" : ""} onClick={() => handleFilterChange(filter)} type="button">
                {filter}
              </button>
            ))}
          </div>
          <div className="menu-list">
            {visible.map((item) => (
              <button key={item.name} className={selected.name === item.name ? "menu-row selected" : "menu-row"} onClick={() => setSelected(item)} type="button">
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.category} / {item.status === "from-menu-reference" ? "menu reference" : "to confirm"}</small>
                </span>
                <b>{item.price}</b>
              </button>
            ))}
          </div>
        </div>
        <aside className="preview-panel">
          <div className="mini-scene">
            <MasterCupScene tone={tone} />
          </div>
          <p className="eyebrow">{selected.category}</p>
          <h3>{selected.name}</h3>
          <p>{selected.note}</p>
        </aside>
      </div>
    </section>
  );
}

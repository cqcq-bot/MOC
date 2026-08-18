"use client";

import { ArrowDown } from "lucide-react";
import { DriftWall } from "@/components/sections/DriftWall";
import { MasterCupScene } from "@/components/three/MasterCupScene";
import { LiquidButton } from "@/components/ui/LiquidButton";

export function Hero3D() {
  return (
    <section id="discover" className="hero-section">
      <DriftWall />
      <div className="hero-topline">
        <div className="hero-logo-intro" aria-label="MOC / Minus One Coffee">
          <img className="hero-logo" src="/assets/moc-logo-original.png" alt="MOC logo" />
          <span className="hero-logo-caption">minus one coffee / small batch studio</span>
        </div>
        <span className="hero-edition">home batch no. 01 / kuala lumpur</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Small batch / made at home</p>
        <h1><span>Minus</span><span>One</span><span>Coffee</span></h1>
        <p>
          Coffee, matcha, and chocolate made in small batches, then shared fresh through Instagram.
        </p>
        <div className="hero-actions">
          <LiquidButton>Shop via DM</LiquidButton>
          <a className="scroll-cue" href="#intro">
            <ArrowDown size={17} aria-hidden="true" />
            <span>Discover</span>
          </a>
        </div>
      </div>
      <div className="hero-scene">
        <MasterCupScene tone="coffee" />
        <span className="hero-scene-note">batch / 01</span>
      </div>
      <div className="section-peek" aria-hidden="true">
        Menu / Matcha / Chocolate / Seasonal
      </div>
    </section>
  );
}

"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { instagramUrl } from "@/lib/content/minus-one";

gsap.registerPlugin(ScrollTrigger, SplitText);

const asset = (name: string) => `/assets/moc-source/${name}`;
const wallSets = [
  ["wall-01.png", "wall-04.png", "wall-07.png", "wall-10.png", "wall-13.png", "wall-16.png"],
  ["wall-02.png", "wall-05.png", "wall-08.png", "wall-11.png", "wall-14.png", "wall-17.png"],
  ["wall-03.png", "wall-06.png", "wall-09.png", "wall-12.png", "wall-15.png"]
];
const wallColumns = [...wallSets, ...wallSets, wallSets[0]];
const wallCopyCount = 4;

type LightboxState = { src: string; alt: string } | null;

function CornerArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg className="nav-order__glyph nav-order__glyph--instagram" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LiquidGlassDefs() {
  const [displacementMap, setDisplacementMap] = useState<string | null>(null);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav-shell");
    if (!nav) return;

    const roundedRectSdf = (x: number, y: number, width: number, height: number, radius: number) => {
      const qx = Math.abs(x - width / 2) - (width / 2 - radius);
      const qy = Math.abs(y - height / 2) - (height / 2 - radius);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
    };

    const updateDisplacementMap = () => {
      const rect = nav.getBoundingClientRect();
      const density = window.innerWidth < 700 ? 0.55 : 1;
      const width = Math.max(96, Math.round(rect.width * density));
      const height = Math.max(24, Math.round(rect.height * density));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return;

      const image = context.createImageData(width, height);
      const radius = Math.min(height / 2, width * 0.18);
      const edgeRange = Math.max(3, Math.min(width, height) * 0.3);

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const sdf = roundedRectSdf(x + 0.5, y + 0.5, width, height, radius);
          const edge = Math.max(0, Math.min(1, 1 - Math.max(0, -sdf) / edgeRange));
          const nx = (x + 0.5 - width / 2) / Math.max(1, width / 2);
          const ny = (y + 0.5 - height / 2) / Math.max(1, height / 2);
          const corner = Math.min(1, Math.hypot(nx, ny) / Math.SQRT2);
          const strength = edge * (7 + corner * 15);
          const index = (y * width + x) * 4;
          image.data[index] = Math.max(0, Math.min(255, Math.round(128 + nx * strength)));
          image.data[index + 1] = Math.max(0, Math.min(255, Math.round(128 + ny * strength)));
          image.data[index + 2] = 128;
          image.data[index + 3] = 255;
        }
      }

      context.putImageData(image, 0, 0);
      setDisplacementMap(canvas.toDataURL("image/png"));
    };

    updateDisplacementMap();
    const observer = new ResizeObserver(updateDisplacementMap);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <svg className="liquid-glass-defs" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        <filter id="moc-nav-liquid-glass" colorInterpolationFilters="sRGB">
          <feImage
            id="moc-nav-displacement-map"
            href={displacementMap ?? undefined}
            preserveAspectRatio="none"
            x="0"
            y="0"
            width="100%"
            height="100%"
            result="edge-map"
          />
          <feDisplacementMap in="SourceGraphic" in2="edge-map" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function HeroWall() {
  return (
    <div className="hero__wall" aria-hidden="true">
      <div className="hero__wall-plane">
        {wallColumns.map((wallSet, columnIndex) => (
          <div className="hero__wall-column" key={columnIndex}>
            <div className="hero__wall-track">
              {Array.from({ length: wallCopyCount }, (_, copyIndex) => (
                <div className="hero__wall-copy" aria-hidden={copyIndex > 0} key={copyIndex}>
                  {wallSet.map((image) => (
                    <div className="hero__wall-tile" key={`${copyIndex}-${image}`}>
                      <img src={asset(image)} alt="" draggable={false} loading="eager" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MocSourcePage() {
  const rootRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuFocusRef = useRef<HTMLElement | null>(null);
  const lightboxFocusRef = useRef<HTMLElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const handleNavPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--nav-glass-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--nav-glass-y", `${y.toFixed(2)}%`);
  };

  const handleNavPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--nav-glass-x", "50%");
    event.currentTarget.style.setProperty("--nav-glass-y", "32%");
  };

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    if (menuOpen) {
      menuFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".menu-link")?.focus());
    } else {
      menuFocusRef.current?.focus();
    }

    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    document.body.classList.toggle("lightbox-is-open", Boolean(lightbox));
    if (lightbox) requestAnimationFrame(() => lightboxCloseRef.current?.focus());
    else lightboxFocusRef.current?.focus();

    return () => document.body.classList.remove("lightbox-is-open");
  }, [lightbox]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lightbox) {
        if (event.key === "Escape") setLightbox(null);
        if (event.key === "Tab") {
          event.preventDefault();
          lightboxCloseRef.current?.focus();
        }
        return;
      }

      if (!menuOpen) return;
      const links = Array.from(document.querySelectorAll<HTMLElement>(".menu-link"));
      const focusable = [menuToggleRef.current, ...links].filter(Boolean) as HTMLElement[];
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1100) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [lightbox, menuOpen]);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let splitInstances: SplitText[] = [];
    let cancelled = false;

    const initMotion = () => {
      if (cancelled) return;
      media.add("(prefers-reduced-motion: reduce)", () => {
        (window as Window & { __mocMotionReady?: boolean }).__mocMotionReady = true;
        ScrollTrigger.refresh();
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const splitText = (element: Element, type: "chars" | "words") => {
          const instance = SplitText.create(element, {
            type,
            aria: "auto",
            smartWrap: true,
            reduceWhiteSpace: false,
            ...(type === "chars" ? { charsClass: "split-char" } : { wordsClass: "split-word" })
          });
          splitInstances.push(instance);
          return instance;
        };

        const heroSplits = Array.from(document.querySelectorAll(".hero__headline > span")).map((element) => splitText(element, "chars"));
        const heroChars = heroSplits.flatMap((split) => split.chars || []);
        const headingSplits = Array.from(document.querySelectorAll(".section-heading__title, .testimonials__title, .manifesto__quote, .footer-title"))
          .map((element) => ({ element, split: splitText(element, "words") }));
        const headingWords = headingSplits.flatMap(({ split }) => split.words || []);
        const sectionKickers = Array.from(document.querySelectorAll(".section:not(.hero) .section-kicker"));
        const sectionCopies = Array.from(document.querySelectorAll(".section-heading__copy"));
        const revealTargets = Array.from(document.querySelectorAll(".menu-visual, .menu-plan, .menu-extra, .testimonial-card, .detail-item, .footer-nav, .footer-bottom"));

        gsap.set([...heroChars, ...headingWords, ...sectionKickers, ...sectionCopies, ...revealTargets], { autoAlpha: 0, y: 24 });

        const masterTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            (window as Window & { __mocMotionReady?: boolean }).__mocMotionReady = true;
          }
        });

        masterTimeline
          .fromTo(".nav-shell", { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0)
          .fromTo(".hero__eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.12)
          .to(heroChars, { autoAlpha: 1, y: 0, duration: 0.54, ease: "back.out(1.2)", stagger: { each: 0.022, from: "start" } }, 0.18)
          .fromTo(".hero__copy, .hero .button", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06 }, "-=0.24")
          .fromTo(".hero__bottom", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.28");

        headingSplits.forEach(({ element, split }) => {
          const section = element.closest("section, footer") || element;
          const kicker = section.querySelector(".section-kicker");
          const copy = element.closest(".section-heading")?.querySelector(".section-heading__copy");
          const reveal = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none", once: true }
          });
          if (kicker) reveal.to(kicker, { autoAlpha: 1, y: 0, duration: 0.32 }, 0);
          reveal.to(split.words, { autoAlpha: 1, y: 0, duration: 0.54, ease: "power3.out", stagger: 0.045 }, 0.06);
          if (copy) reveal.to(copy, { autoAlpha: 1, y: 0, duration: 0.42 }, 0.24);
        });

        const menuVisual = document.querySelector(".menu-visual");
        if (menuVisual) {
          gsap.timeline({ scrollTrigger: { trigger: menuVisual, start: "top 88%", toggleActions: "play none none none", once: true } })
            .to(menuVisual, { autoAlpha: 1, y: 0, duration: 0.56, ease: "power3.out" });
        }

        ScrollTrigger.batch(".menu-plan, .menu-extra, .testimonial-card, .detail-item, .footer-nav, .footer-bottom", {
          start: "top 90%",
          once: true,
          interval: 0.08,
          batchMax: 6,
          onEnter: (elements) => gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            duration: 0.52,
            ease: "power3.out",
            stagger: { each: 0.07, from: "start" },
            overwrite: "auto"
          })
        });

        const refresh = () => ScrollTrigger.refresh();
        document.querySelectorAll("img").forEach((image) => {
          if (!image.complete) image.addEventListener("load", refresh, { once: true });
        });
        document.fonts?.ready.then(refresh);
        refresh();

        const seek = new URLSearchParams(window.location.search).get("motion");
        if (seek === "final") masterTimeline.progress(1).pause();

        return () => splitInstances.forEach((split) => split.revert());
      });
    };

    if (document.fonts) document.fonts.ready.then(initMotion);
    else initMotion();

    return () => {
      cancelled = true;
      media.revert();
      splitInstances.forEach((split) => split.revert());
    };
  }, []);

  const openLightbox = (src: string, alt: string, element: HTMLElement) => {
    lightboxFocusRef.current = element;
    setLightbox({ src, alt });
  };

  return (
    <>
      <header className="site-header">
        <LiquidGlassDefs />
        <div className="nav-shell" aria-label="Primary navigation" onPointerMove={handleNavPointerMove} onPointerLeave={handleNavPointerLeave}>
          <div className="nav-shell__material" aria-hidden="true" />
          <a className="brand-link" href="#top" aria-label="Minus One Coffee home">
            <img src={asset("moc-logo.png")} alt="MOC logo" />
          </a>
          <a className="nav-order" href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Order via Instagram direct message">
            <span className="nav-order__label">Order via DM</span>
            <span className="nav-order__icon" aria-hidden="true">
              <CornerArrow className="nav-order__glyph nav-order__glyph--arrow" />
              <InstagramGlyph />
            </span>
          </a>
          <button ref={menuToggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>
            <span className="menu-toggle__icon" aria-hidden="true"><span className="menu-toggle__line" /></span>
          </button>
        </div>
      </header>

      <aside className="menu-panel" id="site-menu" aria-hidden={!menuOpen}>
        <div className="menu-panel__top">
          <p className="menu-kicker">Small batch studio</p>
          <p className="menu-note">Coffee, matcha, and chocolate made in small batches.</p>
        </div>
        <nav className="menu-links" aria-label="Site menu">
          {[
            ["Home", "#top"],
            ["Batch no. 01", "#batch"],
            ["Testimonials", "#testimonials"],
            ["Our story", "#story"],
            ["Visit us", "#visit"]
          ].map(([label, href]) => (
            <a className="menu-link" href={href} key={label} onClick={() => setMenuOpen(false)}><span>{label}</span></a>
          ))}
        </nav>
        <div className="menu-panel__bottom">
          <p>JB / Kuala Lumpur</p>
          <p className="menu-panel__status">Open Mon - Sat</p>
        </div>
      </aside>

      <main ref={rootRef} id="top">
        <section className="hero" aria-labelledby="hero-title">
          <HeroWall />
          <div className="hero__top">
            <p className="hero__eyebrow">Minus One Coffee / JB Permas</p>
            <h1 className="hero__headline" id="hero-title"><span>Minus</span><span className="accent">One</span><span>Coffee</span></h1>
            <p className="hero__copy">Small-batch coffee, matcha, and chocolate made fresh at home.</p>
            <a className="button button--copper" href={instagramUrl} target="_blank" rel="noreferrer">Shop via DM <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero__bottom">
            <span className="hero__location">Small batch / made at home</span>
            <div className="hero__actions"><a className="scroll-cue" href="#batch"><span aria-hidden="true">↓</span> Discover</a></div>
          </div>
        </section>

        <section className="section section--paper" id="batch" aria-labelledby="batch-title">
          <div className="section__inner">
            <div className="section-heading">
              <div><p className="section-kicker">Batch no. 01 / the menu</p><h2 className="section-heading__title" id="batch-title">Pick your pace.</h2></div>
              <p className="section-heading__copy">Three series, one small-batch ritual. Start with coffee, stay for matcha, finish with chocolate.</p>
            </div>
            <div className="menu-layout">
              <figure className="menu-visual"><img src={asset("matcha-latte.png")} alt="Two matcha drinks in different sizes" /><figcaption className="menu-visual__caption">Made fresh, shared slowly</figcaption></figure>
              <div className="menu-pricing-grid" aria-label="Drink menu">
                <MenuPlan index="01" title="Coffee" note="Everyday" subtitle="Deep, familiar, made to order." items={[["Americano", "RM8"], ["White", "RM10"], ["Spanish Latte", "RM12"], ["Nutella Latte", "RM15"], ["Yuzu Black", "RM15"]]} />
                <MenuPlan index="02" title="Matcha" note="House pick" subtitle="Soft, milky, and a little green." featured items={[["Matcha Latte", "RM13"], ["Earl Grey Matcha", "RM14"], ["Oreo Matcha", "RM14"], ["Oreo Earl Grey Matcha", "RM15"]]} />
                <MenuPlan index="03" title="Chocolate" note="Velvety" subtitle="Dark, smooth, and close to dessert." items={[["Chocolate Mousse", "RM14"], ["Earl Grey Chocolate", "RM15"], ["Oreo Chocolate", "RM15"]]} />
              </div>
              <div className="menu-extras">
                <MenuExtra title="Others + seasonal" note="While it lasts" items={[["Yuzu Sparkling", "RM11"], ["Earl Grey Tea", "RM6"], ["Strawberry Matcha", "RM18"], ["Hojicha Latte", "RM15"]]} />
                <MenuExtra title="Add on" note="Make it yours" items={[["Oat Milk", "+RM2"], ["One Espresso Shot", "+RM3"], ["Large Size", "+RM4"], ["Oreo", "+RM1"]]} />
              </div>
            </div>
          </div>
        </section>

        <section className="section section--cocoa testimonials" id="testimonials" aria-labelledby="testimonials-title">
          <div className="section__inner">
            <div className="testimonials__heading"><p className="section-kicker">Loved by our regulars</p><h2 className="testimonials__title" id="testimonials-title">What people are saying</h2></div>
            <div className="testimonial-wall" aria-label="Customer feedback screenshots">
              {[
                ["testimonial-chat-matcha.png", "Customer feedback about the matcha drink"],
                ["testimonial-whatsapp-reply.png", "Customer feedback about a drink order"],
                ["testimonial-strawberry-matcha.png", "Customer feedback about strawberry matcha"],
                ["testimonial-flat-white.png", "Customer feedback about a flat white"]
              ].map(([image, alt]) => (
                <button className="testimonial-card" type="button" key={image} aria-label={`Magnify ${alt.toLowerCase()}`} onClick={(event) => openLightbox(asset(image), alt, event.currentTarget)}>
                  <span className="testimonial-card__media"><img src={asset(image)} alt="" loading="lazy" decoding="async" /></span>
                  <span className="testimonial-card__action">Magnify</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--cocoa" id="story" aria-labelledby="story-title">
          <div className="section__inner manifesto">
            <p className="section-kicker">The studio note</p>
            <h2 className="manifesto__quote" id="story-title">Made in small batches, shared <em>fresh.</em></h2>
            <div className="manifesto__details">
              <div className="detail-item"><span className="detail-item__label">Place</span><span className="detail-item__value">JB / Kuala Lumpur</span></div>
              <div className="detail-item"><span className="detail-item__label">Hours</span><span className="detail-item__value">Monday - Saturday / 8:00 - 17:00</span></div>
              <div className="detail-item"><span className="detail-item__label">Order</span><span className="detail-item__value">DM @minus.onecoffee</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="visit">
        <div className="footer-inner">
          <h2 className="footer-title">Come by for the next batch.</h2>
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#batch">The menu</a><a href="#testimonials">Testimonials</a><a href="#story">Our story</a><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="footer-bottom"><span>Minus One Coffee</span><span>Small batch studio / 2026</span></div>
        </div>
      </footer>

      <div className="testimonial-lightbox" id="testimonial-lightbox" role="dialog" aria-modal="true" aria-hidden={!lightbox} aria-labelledby="testimonial-lightbox-title" onClick={(event) => { if (event.target === event.currentTarget) setLightbox(null); }}>
        <span className="testimonial-lightbox__backdrop" aria-hidden="true" onClick={() => setLightbox(null)} />
        <div className="testimonial-lightbox__dialog">
          <h2 className="sr-only" id="testimonial-lightbox-title">Expanded customer feedback</h2>
          <button ref={lightboxCloseRef} className="testimonial-lightbox__close" type="button" aria-label="Close enlarged feedback" title="Close enlarged feedback" onClick={() => setLightbox(null)} />
          {lightbox && <img className="testimonial-lightbox__image" src={lightbox.src} alt={lightbox.alt} />}
        </div>
      </div>
    </>
  );
}

function MenuPlan({ index, title, note, subtitle, items, featured = false }: { index: string; title: string; note: string; subtitle: string; items: string[][]; featured?: boolean }) {
  return (
    <article className={`menu-plan${featured ? " menu-plan--featured" : ""}`}>
      <div className="menu-plan__top">
        <div className="menu-plan__topline">
          <span className="menu-plan__index">{index} / Series</span>
          <span className="menu-plan__note">{note}</span>
        </div>
        <h3 className="menu-plan__title">{title}</h3>
      </div>
      <p className="menu-plan__subtitle">{subtitle}</p>
      <ul className="menu-list">{items.map(([name, price]) => <li key={name}><span>{name}</span><span>{price}</span></li>)}</ul>
      <a className="menu-plan__cta" href={instagramUrl} target="_blank" rel="noreferrer">Order {title.toLowerCase()} <span aria-hidden="true">↗</span></a>
    </article>
  );
}

function MenuExtra({ title, note, items }: { title: string; note: string; items: string[][] }) {
  return (
    <div className="menu-extra">
      <div className="menu-extra__heading"><h3>{title}</h3><span>{note}</span></div>
      <ul className="menu-extra__list">{items.map(([name, price]) => <li key={name}><span>{name}</span><span>{price}</span></li>)}</ul>
    </div>
  );
}

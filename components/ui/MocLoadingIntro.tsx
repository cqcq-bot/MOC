"use client";

import { useEffect, useState, type AnimationEvent } from "react";

const INTRO_LOGO_SRC = "/assets/moc-logo-original.png";

function waitForImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();

    image.onload = finish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) finish();
  });
}

export function MocLoadingIntro() {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("has-moc-loader");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(92, current + (prefersReducedMotion ? 5 : 2)));
    }, prefersReducedMotion ? 16 : 24);
    let disposed = false;

    Promise.all([
      waitForImage(INTRO_LOGO_SRC),
      document.fonts?.ready ?? Promise.resolve()
    ]).then(() => {
      if (disposed) return;

      window.clearInterval(progressTimer);
      setProgress(100);
      window.requestAnimationFrame(() => {
        if (!disposed) setIsExiting(true);
      });
    });

    return () => {
      disposed = true;
      window.clearInterval(progressTimer);
      document.documentElement.classList.remove("has-moc-loader");
    };
  }, []);

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    const isLoaderExit = event.animationName === "moc-loader-exit" || event.animationName === "moc-loader-reduced-exit";
    if (!isExiting || event.target !== event.currentTarget || !isLoaderExit) return;
    setIsVisible(false);
    document.documentElement.classList.remove("has-moc-loader");
  };

  if (!isVisible) return null;

  return (
    <div
      className={`moc-loader${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Minus One Coffee"
      onAnimationEnd={handleAnimationEnd}
    >
      <span className="moc-loader-mark" aria-hidden="true">
        <img src={INTRO_LOGO_SRC} alt="" />
      </span>
      <p className="moc-loader-name">Minus One Coffee</p>
      <div className="moc-loader-progress" aria-label={`${progress}% loaded`}>
        <span className="moc-loader-progress-track" aria-hidden="true">
          <span className="moc-loader-progress-bar" style={{ transform: `scaleX(${progress / 100})` }} />
        </span>
        <span className="moc-loader-progress-label">{progress}%</span>
      </div>
    </div>
  );
}

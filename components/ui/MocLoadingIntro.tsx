"use client";

import { useEffect, useState } from "react";

export function MocLoadingIntro() {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("has-moc-loader");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let progressTimer = 0;
    const progressStartTimer = window.setTimeout(() => {
      progressTimer = window.setInterval(() => {
        setProgress((current) => Math.min(100, current + (prefersReducedMotion ? 5 : 2)));
      }, prefersReducedMotion ? 16 : 24);
    }, 0);
    const exitTimer = window.setTimeout(() => setIsExiting(true), prefersReducedMotion ? 1400 : 2860);
    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
      document.documentElement.classList.remove("has-moc-loader");
    }, prefersReducedMotion ? 1650 : 3260);

    return () => {
      window.clearTimeout(progressStartTimer);
      if (progressTimer) window.clearInterval(progressTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove("has-moc-loader");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`moc-loader${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Minus One Coffee"
    >
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

"use client";

import type { MutableRefObject, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { instagramUrl } from "@/lib/content/minus-one";

type GlassQuality = "full" | "lite" | "off";

type LiquidGlassNavbarProps = {
  menuOpen: boolean;
  menuToggleRef: RefObject<HTMLButtonElement>;
  onToggleMenu: () => void;
};

type OpticalSurfaceProps = {
  pointer: MutableRefObject<THREE.Vector2>;
  hovering: MutableRefObject<number>;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uHover;
  uniform float uMotion;
  varying vec2 vUv;

  float roundedBoxSdf(vec2 point, vec2 bounds, float radius) {
    vec2 delta = abs(point) - bounds + radius;
    return min(max(delta.x, delta.y), 0.0) + length(max(delta, 0.0)) - radius;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 point = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
    float distanceToEdge = roundedBoxSdf(point, vec2(aspect * 0.5, 0.5), 0.5);
    float edge = 1.0 - smoothstep(0.0, 0.075, -distanceToEdge);
    float innerEdge = 1.0 - smoothstep(0.018, 0.145, -distanceToEdge);

    vec2 pointer = vec2((uPointer.x - 0.5) * aspect, uPointer.y - 0.5);
    vec2 pointerDelta = point - pointer;
    float pointerLight = exp(-dot(pointerDelta, pointerDelta) * 30.0);
    float pointerHalo = exp(-dot(pointerDelta, pointerDelta) * 7.0);

    float liquid = sin((point.x * 12.0 + point.y * 8.0) + uTime * 0.27) * 0.5 + 0.5;
    liquid *= sin((point.x * -7.0 + point.y * 15.0) - uTime * 0.19) * 0.5 + 0.5;
    liquid = (liquid - 0.25) * uMotion;

    vec3 warmReflection = vec3(0.98, 0.88, 0.74);
    vec3 copperReflection = vec3(0.74, 0.37, 0.20);
    vec3 dispersion = vec3(1.0, 0.62, 0.36) * edge * (0.018 + pointerHalo * 0.028);
    vec3 color = warmReflection * (edge * (0.17 + liquid * 0.045));
    color += copperReflection * (innerEdge * 0.06 + liquid * 0.018);
    color += warmReflection * pointerLight * (0.095 + uHover * 0.055);
    color += dispersion;

    float alpha = edge * 0.33 + innerEdge * 0.055 + pointerLight * (0.12 + uHover * 0.08) + liquid * 0.035;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.44));
  }
`;

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

function OpticalSurface({ pointer, hovering }: OpticalSurfaceProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uPointer: { value: new THREE.Vector2(0.5, 0.32) },
      uResolution: { value: new THREE.Vector2(420, 60) },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMotion: { value: 1 }
    }),
    []
  );

  useFrame((state, delta) => {
    const shader = material.current;
    if (!shader) return;

    (shader.uniforms.uPointer.value as THREE.Vector2).lerp(pointer.current, Math.min(1, delta * 9));
    shader.uniforms.uHover.value = THREE.MathUtils.damp(shader.uniforms.uHover.value, hovering.current, 10, delta);
    (shader.uniforms.uResolution.value as THREE.Vector2).set(state.size.width, state.size.height);
    shader.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} />
    </mesh>
  );
}

function getGlassQuality(): GlassQuality {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return "off";

  const probe = document.createElement("canvas");
  const context = probe.getContext("webgl2") || probe.getContext("webgl");
  if (!context) return "off";

  const device = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof device.deviceMemory === "number" && device.deviceMemory <= 4;
  const lowCoreCount = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (coarsePointer && (lowMemory || lowCoreCount)) return "off";
  return coarsePointer || lowMemory || lowCoreCount ? "lite" : "full";
}

function LiquidGlassSurface({ pointer, hovering }: Pick<OpticalSurfaceProps, "pointer" | "hovering">) {
  const [quality, setQuality] = useState<GlassQuality>("off");

  useEffect(() => {
    setQuality(getGlassQuality());
  }, []);

  if (quality === "off") return null;

  return (
    <div className="nav-shell__gpu" aria-hidden="true">
      <Canvas
        className="nav-shell__gpu-canvas"
        dpr={quality === "full" ? [1, 1.5] : 1}
        frameloop="always"
        gl={{ alpha: true, antialias: quality === "full", powerPreference: "high-performance", premultipliedAlpha: true }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
      >
        <OpticalSurface pointer={pointer} hovering={hovering} />
      </Canvas>
    </div>
  );
}

export function LiquidGlassNavbar({ menuOpen, menuToggleRef, onToggleMenu }: LiquidGlassNavbarProps) {
  const pointer = useRef(new THREE.Vector2(0.5, 0.32));
  const hovering = useRef(0);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height, 0, 1);
    pointer.current.set(x, y);
    event.currentTarget.style.setProperty("--nav-glass-x", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--nav-glass-y", `${(y * 100).toFixed(2)}%`);
  };

  const handlePointerEnter = () => {
    hovering.current = 1;
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointer.current.set(0.5, 0.32);
    hovering.current = 0;
    event.currentTarget.style.setProperty("--nav-glass-x", "50%");
    event.currentTarget.style.setProperty("--nav-glass-y", "32%");
  };

  return (
    <>
      <svg className="liquid-glass-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <filter id="moc-navbar-refraction" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="1" seed="7" result="surface-noise">
              <animate attributeName="baseFrequency" dur="20s" values="0.009 0.014;0.011 0.009;0.009 0.014" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="surface-noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div className="nav-shell" aria-label="Primary navigation" onPointerMove={handlePointerMove} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        <div className="nav-shell__material" aria-hidden="true" />
        <LiquidGlassSurface pointer={pointer} hovering={hovering} />
        <a className="brand-link" href="#top" aria-label="Minus One Coffee home">
          <img src="/assets/moc-source/moc-logo.png" alt="MOC logo" />
        </a>
        <a className="nav-order" href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Order via Instagram direct message">
          <span className="nav-order__label">Order via DM</span>
          <span className="nav-order__icon" aria-hidden="true">
            <CornerArrow className="nav-order__glyph nav-order__glyph--arrow" />
            <InstagramGlyph />
          </span>
        </a>
        <button ref={menuToggleRef} className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={onToggleMenu}>
          <span className="menu-toggle__icon" aria-hidden="true"><span className="menu-toggle__line" /></span>
        </button>
      </div>
    </>
  );
}

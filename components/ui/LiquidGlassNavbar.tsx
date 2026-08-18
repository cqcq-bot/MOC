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
  uniform float uHover;
  uniform float uRefraction;
  uniform float uDepth;
  uniform float uFrost;
  uniform float uLightIntensity;
  varying vec2 vUv;

  float roundedBoxSdf(vec2 point, vec2 bounds, float radius) {
    vec2 delta = abs(point) - bounds + radius;
    return min(max(delta.x, delta.y), 0.0) + length(max(delta, 0.0)) - radius;
  }

  vec2 roundedBoxNormal(vec2 point, vec2 bounds, float radius) {
    vec2 corner = max(abs(point) - (bounds - radius), 0.0);
    float cornerLength = length(corner);
    if (cornerLength > 0.0001) {
      return sign(point) * corner / cornerLength;
    }
    return vec2(0.0, sign(point.y));
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 point = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
    vec2 bounds = vec2(aspect * 0.5, 0.5);
    float radius = 0.5;
    float distanceToEdge = roundedBoxSdf(point, bounds, radius);
    float edgeDistance = max(-distanceToEdge, 0.0);
    float edgeWidth = mix(0.12, 0.2, uDepth);
    float edge = 1.0 - smoothstep(0.0, edgeWidth, edgeDistance);
    float innerEdge = 1.0 - smoothstep(edgeWidth * 0.22, edgeWidth * 1.55, edgeDistance);
    float edgeCore = 1.0 - smoothstep(0.0, edgeWidth * 0.38, edgeDistance);
    vec2 normal = roundedBoxNormal(point, bounds, radius);
    float cornerDistance = length(max(abs(point) - vec2(max(bounds.x - radius, 0.0), 0.0), 0.0));
    float corner = smoothstep(0.05, 0.48, cornerDistance);

    vec2 pointer = vec2((uPointer.x - 0.5) * aspect, uPointer.y - 0.5);
    vec2 pointerDelta = point - pointer;
    float pointerLight = exp(-dot(pointerDelta, pointerDelta) * 38.0);
    float pointerRefraction = exp(-dot(pointerDelta, pointerDelta) * 10.0);
    vec2 lightDirection = normalize(vec2(-0.44, 0.88));
    float rimLight = pow(max(dot(normal, lightDirection), 0.0), 2.2) * edge;
    float reflectedLight = pow(max(dot(reflect(-lightDirection, normal), vec2(0.0, 1.0)), 0.0), 5.0) * edge;
    float cornerLens = corner * edge * (0.72 + 0.28 * edgeCore);
    float refractionBand = edge * (0.56 + 0.44 * corner) * uRefraction;
    float thickness = mix(0.55, 1.0, uDepth);

    vec3 neutralLight = vec3(0.98, 0.97, 0.94);
    vec3 warmLight = vec3(1.0, 0.84, 0.62);
    vec3 color = neutralLight * (refractionBand * 0.18 * thickness);
    color += neutralLight * (rimLight * uLightIntensity * 0.5 + reflectedLight * uLightIntensity * 0.32);
    color += warmLight * (cornerLens * uLightIntensity * 0.22);
    color += neutralLight * pointerLight * (0.09 + uHover * 0.06);
    color += neutralLight * pointerRefraction * edge * (0.035 + uHover * 0.025);

    // A restrained center veil keeps the surface readable without turning it opaque.
    color += vec3(0.92, 0.9, 0.86) * uFrost * 0.12;
    float alpha = edge * (0.16 + uDepth * 0.09) + innerEdge * 0.025;
    alpha += rimLight * uLightIntensity * 0.12 + cornerLens * 0.04;
    alpha += pointerLight * (0.06 + uHover * 0.05) + uFrost * 0.02;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.42));
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
      uHover: { value: 0 },
      uRefraction: { value: 0.6 },
      uDepth: { value: 0.8 },
      uFrost: { value: 0.06 },
      uLightIntensity: { value: 0.45 }
    }),
    []
  );

  useFrame((state, delta) => {
    const shader = material.current;
    if (!shader) return;

    (shader.uniforms.uPointer.value as THREE.Vector2).lerp(pointer.current, Math.min(1, delta * 9));
    shader.uniforms.uHover.value = THREE.MathUtils.damp(shader.uniforms.uHover.value, hovering.current, 10, delta);
    (shader.uniforms.uResolution.value as THREE.Vector2).set(state.size.width, state.size.height);
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
          <filter id="moc-navbar-refraction" colorInterpolationFilters="sRGB" x="-12%" y="-60%" width="124%" height="220%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="alpha-blur" />
            <feComposite in="alpha-blur" in2="SourceAlpha" operator="out" result="edge-map" />
            <feFlood floodColor="#808080" result="neutral-map" />
            <feComposite in="neutral-map" in2="SourceAlpha" operator="in" result="surface-map" />
            <feFlood floodColor="#bcbcbc" result="bright-edge-map" />
            <feComposite in="bright-edge-map" in2="edge-map" operator="in" result="bright-edge" />
            <feComposite in="bright-edge" in2="surface-map" operator="over" result="optical-map" />
            <feDisplacementMap in="SourceGraphic" in2="optical-map" scale="16" xChannelSelector="R" yChannelSelector="G" />
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

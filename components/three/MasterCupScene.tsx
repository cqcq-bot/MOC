"use client";

import { Float, Html, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  tone?: "coffee" | "matcha" | "chocolate" | "seasonal";
};

const palette = {
  espresso: "#160B07",
  darkCocoa: "#2B140B",
  walnut: "#4A2416",
  copper: "#A86542",
  ivory: "#E8DDCC",
  olive: "#7E8A61"
} as const;

const tones = {
  coffee: { liquid: palette.darkCocoa, accent: palette.copper, dust: palette.walnut },
  matcha: { liquid: palette.olive, accent: palette.copper, dust: palette.walnut },
  chocolate: { liquid: palette.espresso, accent: palette.copper, dust: palette.walnut },
  seasonal: { liquid: palette.copper, accent: palette.olive, dust: palette.espresso }
};

function Cup({ tone = "coffee" }: Props) {
  const group = useRef<THREE.Group>(null);
  const liquid = tones[tone];
  const particles = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        x: (Math.random() - 0.5) * 4.4,
        y: Math.random() * 3.8 - 0.5,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() * 0.045 + 0.025
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.35) * 0.18;
    group.current.rotation.z = Math.sin(t * 0.25) * 0.025;
    group.current.position.y = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.68, 0.48, 1.95, 64, 1, true]} />
        <meshPhysicalMaterial color={palette.copper} transparent opacity={0.25} roughness={0.08} transmission={0.75} thickness={0.55} />
      </mesh>
      <mesh position={[0, -0.46, 0]}>
        <cylinderGeometry args={[0.59, 0.43, 1.2, 64]} />
        <meshStandardMaterial color={liquid.liquid} roughness={0.28} metalness={0.02} transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.74, 0.68, 0.18, 64]} />
        <meshPhysicalMaterial color={palette.copper} transparent opacity={0.3} roughness={0.05} transmission={0.6} />
      </mesh>
      <mesh position={[0.22, 1.36, 0]} rotation={[0.12, 0, -0.18]}>
        <cylinderGeometry args={[0.035, 0.035, 2.1, 20]} />
        <meshStandardMaterial color={palette.copper} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, 0.04, 0.505]}>
        <planeGeometry args={[0.8, 0.38]} />
        <meshBasicMaterial color={palette.copper} transparent opacity={0.92} />
      </mesh>
      <Html position={[0, 0.04, 0.52]} center transform distanceFactor={2.8}>
        <div className="cup-label">
          <img src="/assets/moc-logo-original.png" alt="MOC logo" />
          <small>small batch</small>
        </div>
      </Html>
      {[-0.24, 0.08, 0.31].map((x, index) => (
        <mesh key={x} position={[x, 0.25 + index * 0.16, 0.1 - index * 0.12]} rotation={[index * 0.5, 0.3, 0.2]}>
          <boxGeometry args={[0.22, 0.18, 0.2]} />
          <meshPhysicalMaterial color={palette.ivory} transparent opacity={0.42} roughness={0.02} transmission={0.7} />
        </mesh>
      ))}
      {particles.map((particle) => (
        <mesh key={particle.id} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.scale, 12, 12]} />
          <meshBasicMaterial color={particle.id % 4 === 0 ? liquid.accent : liquid.dust} transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  );
}

export function MasterCupScene({ tone = "coffee" }: Props) {
  return (
    <Canvas dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }} aria-hidden="true">
      <PerspectiveCamera makeDefault position={[0, 0.1, 4.1]} fov={38} />
      <ambientLight intensity={1.9} />
      <directionalLight position={[2, 4, 3]} intensity={2.2} />
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.28}>
        <Cup tone={tone} />
      </Float>
    </Canvas>
  );
}

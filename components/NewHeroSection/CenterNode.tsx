"use client";

import { GradientTexture, Text, useTexture } from "@react-three/drei";
import { useMemo, Suspense } from "react";
import * as THREE from "three";
import { CENTER_NODE } from "./config/nodes.data";
import { MATERIALS } from "./config/scene.config";
import { getCenterGeometry } from "./utils/reuse";
import { useAdminStore } from "@/app/admin/_components/store";

type CenterNodeProps = {
  /** Visual radius of the center sphere (breakpoint `centerSize`). */
  size: number;
};

/**
 * Optional logo plane on the center sphere.
 */
function CenterLogo({ url, size }: { url: string; size: number }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 0, size * 1.01]} scale={size * 1.2} frustumCulled>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Fixed brand hub at the origin — not draggable.
 * Gradient MeshStandard sphere + Troika brand text (no Html / backdrop-blur).
 */
export default function CenterNode({ size }: CenterNodeProps) {
  const geometry = useMemo(() => getCenterGeometry(), []);
  const { center } = MATERIALS;
  const heroNodesCMS = useAdminStore((s) => s.heroNodesCMS);
  const centerLabel = heroNodesCMS?.centerNodeLabel || "Placeholder";
  const centerLogo = heroNodesCMS?.centerLogoUrl || null;

  return (
    <group>
      <mesh
        geometry={geometry}
        scale={size}
        frustumCulled
        castShadow={false}
        receiveShadow={false}
      >
        <meshStandardMaterial
          color={center.color}
          emissive={center.emissive}
          emissiveIntensity={center.emissiveIntensity}
          metalness={center.metalness}
          roughness={center.roughness}
          transparent
          opacity={center.opacity}
        >
          <GradientTexture
            stops={[...center.gradient.stops]}
            colors={[...center.gradient.colors]}
            size={256}
          />
        </meshStandardMaterial>
      </mesh>
      {centerLogo ? (
        <Suspense fallback={null}>
          <CenterLogo url={centerLogo} size={size} />
        </Suspense>
      ) : null}
      <Text
        position={[0, -size * 1.35, 0]}
        fontSize={Math.max(0.18, size * 0.28)}
        color="#f4f4f5"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#09090b"
        maxWidth={4}
        textAlign="center"
      >
        {centerLabel}
      </Text>
    </group>
  );
}

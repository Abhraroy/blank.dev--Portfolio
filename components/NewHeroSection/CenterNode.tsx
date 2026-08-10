"use client";

import { GradientTexture, Text, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { CENTER_NODE } from "./config/nodes.data";
import { MATERIALS } from "./config/scene.config";
import { getCenterGeometry } from "./utils/reuse";

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
    <mesh position={[0, 0, size * 0.92]} scale={size * 0.7} frustumCulled>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
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
      {CENTER_NODE.logoUrl ? (
        <CenterLogo url={CENTER_NODE.logoUrl} size={size} />
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
        {CENTER_NODE.label}
      </Text>
    </group>
  );
}

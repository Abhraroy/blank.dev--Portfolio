"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CONNECTIONS } from "./config/scene.config";
import { getNodePosition } from "./utils/nodePositions";

type ConnectionLinesProps = {
  /** Skill node ids — one line per id from origin → live node position. */
  nodeIds: readonly string[];
};

type LineEntry = {
  id: string;
  positions: Float32Array;
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
};

/**
 * Renders center→node lines and updates endpoints in `useFrame` (no React state).
 * Opacity can pulse via `CONNECTIONS` in scene.config.
 *
 * @param props.nodeIds - Ordered list of skill ids with registered positions
 */
export default function ConnectionLines({ nodeIds }: ConnectionLinesProps) {
  const entriesRef = useRef<LineEntry[]>([]);
  const pulsePhase = useRef(0);

  const lines = useMemo(() => {
    return nodeIds.map((id) => {
      const positions = new Float32Array(6);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color: CONNECTIONS.color,
        transparent: true,
        opacity: CONNECTIONS.opacity,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = true;
      return { id, positions, line, material };
    });
  }, [nodeIds]);

  useEffect(() => {
    return () => {
      for (const entry of lines) {
        entry.line.geometry.dispose();
        entry.material.dispose();
      }
    };
  }, [lines]);

  entriesRef.current = lines;

  useFrame((_, delta) => {
    if (CONNECTIONS.pulseEnabled) {
      pulsePhase.current += delta * CONNECTIONS.pulseSpeed;
    }
    const pulse = CONNECTIONS.pulseEnabled
      ? 1 + Math.sin(pulsePhase.current) * CONNECTIONS.pulseAmplitude
      : 1;
    const opacity = Math.min(1, CONNECTIONS.opacity * pulse);

    for (const entry of entriesRef.current) {
      const pos = getNodePosition(entry.id);
      if (!pos) continue;
      entry.positions[0] = 0;
      entry.positions[1] = 0;
      entry.positions[2] = 0;
      entry.positions[3] = pos.x;
      entry.positions[4] = pos.y;
      entry.positions[5] = pos.z;
      const attr = entry.line.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      attr.needsUpdate = true;
      entry.line.geometry.computeBoundingSphere();
      entry.material.opacity = opacity;
    }
  });

  return (
    <group>
      {lines.map((entry) => (
        <primitive key={entry.id} object={entry.line} />
      ))}
    </group>
  );
}

"use client";

import * as THREE from "three";

/**
 * Mutable local-space positions for connection lines + card follow.
 * Updated in SkillNode `useFrame` — never via React state.
 */
const nodePositions = new Map<string, THREE.Vector3>();

/**
 * Writes / updates a node's local position in the registry.
 *
 * @param id - Skill node id
 * @param x - Local X
 * @param y - Local Y
 * @param z - Local Z
 */
export function setNodePosition(id: string, x: number, y: number, z: number): void {
  let v = nodePositions.get(id);
  if (!v) {
    v = new THREE.Vector3();
    nodePositions.set(id, v);
  }
  v.set(x, y, z);
}

/**
 * @param id - Skill node id
 * @returns Live position vector, or undefined if not registered
 */
export function getNodePosition(id: string): THREE.Vector3 | undefined {
  return nodePositions.get(id);
}

/** @param id - Skill node id to remove (on unmount) */
export function removeNodePosition(id: string): void {
  nodePositions.delete(id);
}

/**
 * Iterates all registered positions.
 *
 * @param fn - Callback `(id, position)`
 */
export function forEachNodePosition(
  fn: (id: string, position: THREE.Vector3) => void,
): void {
  nodePositions.forEach((position, id) => fn(id, position));
}

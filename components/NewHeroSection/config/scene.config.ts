import type { CameraTarget, Vec3 } from "../types/network";

/**
 * Auto-rotation speeds for the NetworkSphere parent group (radians / second).
 * Higher = faster spin. Read by `useAutoRotate`.
 *
 * Only yaw (`speedY`) is applied. Continuous pitch (`speedX`) was removed because
 * accumulating Euler X past ±π/2 visually flips the whole sphere.
 */
export const ROTATION = {
  /** Yaw (horizontal orbit of the whole sphere). */
  speedY: 0.08,
} as const;

/**
 * Mesh material tokens for center + skill nodes.
 * `skillHover` is unused for animation (hover is tooltip-only) but kept for reference.
 */
export const MATERIALS = {
  center: {
    /** Fallback / emissive base when gradient map is applied. */
    color: "#e4e4e7",
    emissive: "#d4d4d8",
    emissiveIntensity: 0.55,
    metalness: 0.28,
    roughness: 0.22,
    opacity: 0.92,
    /** Radial gradient stops for the center sphere (drei GradientTexture). */
    gradient: {
      stops: [0, 0.4, 1] as const,
      colors: ["#fafafa", "#a1a1aa", "#3f3f46"] as const,
    },
  },
  skill: {
    color: "#a1a1aa",
    emissive: "#52525b",
    emissiveIntensity: 0.25,
    metalness: 0.55,
    roughness: 0.2,
    opacity: 0.78,
  },
  /** Legacy hover look — not applied on hover anymore (tooltip only). */
  skillHover: {
    emissive: "#d4d4d8",
    emissiveIntensity: 0.65,
    scale: 1.18,
  },
  glassTransmission: 0.35,
} as const;

/**
 * Soft halo for Troika skill labels (outlineBlur = glow).
 * Tuned so every satellite reads as lit text, not flat glyphs.
 */
export const LABEL_GLOW = {
  color: "#fafafa",
  outlineColor: "#e4e4e7",
  outlineWidth: 0.015,
  outlineBlur: 0.12,
  outlineOpacity: 0.75,
} as const;

/**
 * Center → skill connection lines (ConnectionLines).
 * Pulse modulates opacity over time when `pulseEnabled` is true.
 */
export const CONNECTIONS = {
  color: "#71717a",
  opacity: 0,
  lineWidth: 1,
  pulseEnabled: true,
  pulseSpeed: 1.2,
  pulseAmplitude: 0.12,
} as const;

/**
 * Satellite motion tuning (kinematic — no dynamic collisions).
 * Nodes stay on the Fibonacci sphere and lerp back after drag.
 */
export const PHYSICS = {
  gravity: [0, 0, 0] as Vec3,
  /** Unused for kinematic satellites; kept for center / future dynamic use. */
  linearDamping: 2.4,
  angularDamping: 2.8,
  mass: 0.8,
  restitution: 0,
  friction: 0.4,
  /** How quickly a released node eases back to its rest position. */
  returnDamping: 8,
  /** Max distance (local units) a node can be dragged from rest. */
  maxDragOffset: 4.5,
} as const;

/**
 * Default camera framing (OrbitControls target + initial position).
 * Zoom-to-node is intentionally not used.
 */
export const CAMERA = {
  defaultLookAt: [0, 0, 0] as Vec3,
  fov: 45,
  near: 0.1,
  far: 200,
  spring: {
    mass: 1,
    tension: 80,
    friction: 32,
  },
  focusPull: 0.38,
  focusOffset: [0, 0.35, 0] as Vec3,
} as const;

/** Tessellation for visible sphere meshes (higher = smoother, costlier). */
export const SPHERE_GEOMETRY = {
  widthSegments: 32,
  heightSegments: 32,
} as const;

/** Lower tessellation for invisible hit volumes. */
export const HIT_SPHERE_SEGMENTS = {
  widthSegments: 16,
  heightSegments: 16,
} as const;

/** Canvas clear color when opaque mode is used. Transparent canvas ignores this. */
export const SCENE_BG = "#09090b" as const;

/**
 * Builds the initial camera pose for a given orbit distance.
 *
 * @param distance - Distance from origin along +Z (from breakpoint `cameraDistance`)
 */
export function defaultCameraTarget(distance: number): CameraTarget {
  return {
    position: [0, 1.2, distance],
    lookAt: CAMERA.defaultLookAt,
  };
}

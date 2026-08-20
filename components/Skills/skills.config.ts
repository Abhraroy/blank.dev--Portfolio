import type { IconType } from "react-icons";
import { FaAws, FaPython, FaDocker, FaGitAlt, FaFigma, FaNodeJs, FaReact, FaCode } from "react-icons/fa6";
import { LuBoxes, LuCode } from "react-icons/lu";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiZod,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiVercel,
  SiExpress,
  SiGo,
  SiRust,
  SiKubernetes,
  SiGooglecloud,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

/** Icon Registry mapping string icon names to React Component Icons */
export const ICON_MAP: Record<string, IconType> = {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiSupabase,
  SiPrisma,
  SiPython,
  SiTailwindcss,
  SiThreedotjs,
  TbBrandFramerMotion,
  LuBoxes,
  SiZod,
  SiDocker,
  SiGit,
  FaAws,
  SiFigma,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiVercel,
  SiExpress,
  SiGo,
  SiRust,
  SiKubernetes,
  SiGooglecloud,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaFigma,
  FaPython,
  FaCode,
  LuCode,
};

export type SkillConfigEntry = {
  id: string;
  name: string;
  iconName: string;
};

export type Skill = {
  id: string;
  name: string;
  Icon: IconType;
};

export const SKILLS_SECTION = {
  eyebrow: "Skills",
  heading: "Tech Stack",
  subtitle: "Tools and technologies I use to design, build, and ship products.",
} as const;

/**
 * SINGLE SOURCE OF TRUTH FOR SKILL TRACK
 * Add or edit skill items here with skill name and icon name string.
 */
export const SKILL_TRACK_CONFIG: SkillConfigEntry[] = [
  { id: "nextjs", name: "Next.js", iconName: "SiNextdotjs" },
  { id: "react", name: "React", iconName: "SiReact" },
  { id: "typescript", name: "TypeScript", iconName: "SiTypescript" },
  { id: "nodejs", name: "Node.js", iconName: "SiNodedotjs" },
  { id: "postgresql", name: "PostgreSQL", iconName: "SiPostgresql" },
  { id: "supabase", name: "Supabase", iconName: "SiSupabase" },
  { id: "prisma", name: "Prisma", iconName: "SiPrisma" },
  { id: "python", name: "Python", iconName: "SiPython" },
  { id: "tailwind", name: "Tailwind CSS", iconName: "SiTailwindcss" },
  { id: "threejs", name: "Three.js", iconName: "SiThreedotjs" },
  { id: "framer", name: "Framer Motion", iconName: "TbBrandFramerMotion" },
  { id: "zustand", name: "Zustand", iconName: "LuBoxes" },
  { id: "zod", name: "Zod", iconName: "SiZod" },
  { id: "docker", name: "Docker", iconName: "SiDocker" },
  { id: "git", name: "Git", iconName: "SiGit" },
  { id: "aws", name: "AWS", iconName: "FaAws" },
  { id: "figma", name: "Figma", iconName: "SiFigma" },
];

/** Derived resolved SKILLS array with resolved React-Icons for the UI carousel */
export const SKILLS: Skill[] = SKILL_TRACK_CONFIG.map((entry) => ({
  id: entry.id,
  name: entry.name,
  Icon: ICON_MAP[entry.iconName] || LuCode,
}));

export function resolveSkillIcon(nameOrIcon?: string): IconType {
  if (!nameOrIcon) return LuCode;
  if (ICON_MAP[nameOrIcon]) return ICON_MAP[nameOrIcon];
  const clean = nameOrIcon.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    const keyClean = key.toLowerCase().replace(/^si|^fa|^tb|^lu/, "");
    if (keyClean && (clean.includes(keyClean) || keyClean.includes(clean))) {
      return icon;
    }
  }
  return LuCode;
}


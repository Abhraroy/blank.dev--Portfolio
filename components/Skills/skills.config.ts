import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
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
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

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

/** Core stack shown in the infinite skills carousel. */
export const SKILLS: Skill[] = [
  { id: "nextjs", name: "Next.js", Icon: SiNextdotjs },
  { id: "react", name: "React", Icon: SiReact },
  { id: "typescript", name: "TypeScript", Icon: SiTypescript },
  { id: "nodejs", name: "Node.js", Icon: SiNodedotjs },
  { id: "postgresql", name: "PostgreSQL", Icon: SiPostgresql },
  { id: "supabase", name: "Supabase", Icon: SiSupabase },
  { id: "prisma", name: "Prisma", Icon: SiPrisma },
  { id: "python", name: "Python", Icon: SiPython },
  { id: "tailwind", name: "Tailwind CSS", Icon: SiTailwindcss },
  { id: "threejs", name: "Three.js", Icon: SiThreedotjs },
  { id: "framer", name: "Framer Motion", Icon: TbBrandFramerMotion },
  { id: "zustand", name: "Zustand", Icon: LuBoxes },
  { id: "zod", name: "Zod", Icon: SiZod },
  { id: "docker", name: "Docker", Icon: SiDocker },
  { id: "git", name: "Git", Icon: SiGit },
  { id: "aws", name: "AWS", Icon: FaAws },
  { id: "figma", name: "Figma", Icon: SiFigma },
];

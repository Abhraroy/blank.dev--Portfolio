"use client";

import { useMemo } from "react";
import SkillItem from "./SkillItem";
import { SKILLS, resolveSkillIcon, type Skill } from "./skills.config";
import { useAdminStore } from "@/app/admin/_components/store";

/** Enough copies so ultrawide viewports never show a gap mid-loop. */
const COPIES = 4;

function SkillList({ skills, ariaHidden }: { skills: Skill[]; ariaHidden?: boolean }) {
  return (
    <ul
      className="skills-track__group flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7"
      role="list"
      aria-hidden={ariaHidden || undefined}
    >
      {skills.map((skill, index) => (
        <SkillItem key={`${skill.id}-${index}`} skill={skill} />
      ))}
    </ul>
  );
}

export default function SkillsCarousel() {
  const { heroNodesCMS, mobileHeroSkills, projects } = useAdminStore();

  const dynamicSkills: Skill[] = useMemo(() => {
    const skillMap = new Map<string, Skill>();

    // 1. Always include static base SKILLS catalog to guarantee full tech stack representation
    SKILLS.forEach((s) => {
      skillMap.set(s.name.toLowerCase(), s);
    });

    // 2. Merge DB heroNodesCMS items if available
    if (heroNodesCMS?.items && heroNodesCMS.items.length > 0) {
      heroNodesCMS.items
        .filter((i) => i.visible)
        .forEach((item) => {
          const name = item.label || item.title;
          if (name) {
            const key = name.toLowerCase();
            if (!skillMap.has(key)) {
              skillMap.set(key, {
                id: item.id || item.nodeId || `hero-${key}`,
                name,
                Icon: resolveSkillIcon(name),
              });
            }
          }
        });
    }

    // 3. Merge DB mobileHeroSkills
    if (mobileHeroSkills && mobileHeroSkills.length > 0) {
      mobileHeroSkills
        .filter((s) => s.visible)
        .forEach((item) => {
          if (item.text) {
            const key = item.text.toLowerCase();
            if (!skillMap.has(key)) {
              skillMap.set(key, {
                id: item.id || `mobile-${key}`,
                name: item.text,
                Icon: resolveSkillIcon(item.text),
              });
            }
          }
        });
    }

    // 4. Merge unique tech from DB projects
    if (projects && projects.length > 0) {
      projects.forEach((p) => {
        p.project_tech?.forEach((tech) => {
          if (tech) {
            const key = tech.toLowerCase();
            if (!skillMap.has(key)) {
              skillMap.set(key, {
                id: `tech-${key}`,
                name: tech,
                Icon: resolveSkillIcon(tech),
              });
            }
          }
        });
      });
    }

    const result = Array.from(skillMap.values());
    return result.length > 0 ? result : SKILLS;
  }, [heroNodesCMS, mobileHeroSkills, projects]);

  return (
    <div
      className="skills-carousel relative w-full overflow-hidden py-10 sm:py-12"
      aria-label="Skills carousel — hover to pause"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-zinc-950 to-transparent sm:w-24 md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-zinc-950 to-transparent sm:w-24 md:w-32"
        aria-hidden
      />

      <div className="skills-track">
        {Array.from({ length: COPIES }, (_, i) => (
          <SkillList key={i} skills={dynamicSkills} ariaHidden={i > 0} />
        ))}
      </div>
    </div>
  );
}

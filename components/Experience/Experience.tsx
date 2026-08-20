"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import ExperienceMilestone from "./ExperienceMilestone";
import ExperienceStickyPanel from "./ExperienceStickyPanel";
import { EXPERIENCE_MILESTONES as FALLBACK_MILESTONES, type ExperienceMilestone as ExperienceMilestoneType } from "./experience.config";
import { useExperienceScroll } from "./hooks/useExperienceScroll";
import { useIsLg } from "./hooks/useIsLg";
import { useAdminStore } from "@/app/admin/_components/store";

export default function Experience() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const pathFillRef = useRef<HTMLDivElement>(null);
  const isLg = useIsLg();

  const { experiences, experienceMetrics, experienceAchievements, experienceCMS, activeModeId } = useAdminStore();

  // Derive dynamic milestones from ExperienceSectionCMS composition layer
  const milestones: ExperienceMilestoneType[] = useMemo(() => {
    if (!experienceCMS || !experienceCMS.items || experienceCMS.items.length === 0) {
      if (experiences.length > 0) {
        return experiences.map((exp) => {
          const yearStr = exp.start_date ? new Date(exp.start_date).getFullYear().toString() : "Placeholder";
          const modeContent =
            exp.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
            exp.modeContents?.[0];
          return {
            id: exp.id,
            year: yearStr,
            title: exp.role_title || "Placeholder",
            summary: `${exp.company_name || "Placeholder"}${exp.location ? ` · ${exp.location}` : ""}`,
            description: modeContent?.experience_description || exp.role_title || "Placeholder",
            techStack: modeContent?.experience_highlights && modeContent.experience_highlights.length > 0
              ? modeContent.experience_highlights
              : ["Placeholder"],
            achievements: modeContent?.experience_highlights || ["Placeholder"],
            stats: [{ label: "Placeholder", value: "Placeholder" }],
          };
        });
      }
      return [
        {
          id: "ph-exp-1",
          year: "Placeholder",
          title: "Placeholder",
          summary: "Placeholder",
          description: "Placeholder",
          techStack: ["Placeholder"],
          achievements: ["Placeholder"],
          stats: [{ label: "Placeholder", value: "Placeholder" }],
        },
      ];
    }

    const activeCMSItems = [...experienceCMS.items]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const derived = activeCMSItems.map((item) => {
      const exp = experiences.find((e) => e.id === item.experienceId);
      const metrics = experienceMetrics
        .filter((m) => m.experienceId === item.experienceId && m.visible)
        .sort((a, b) => a.order - b.order)
        .map((m) => ({ label: m.label || "Placeholder", value: m.value || "Placeholder" }));

      const achievements = experienceAchievements
        .filter((a) => a.experienceId === item.experienceId && a.visible)
        .sort((a, b) => a.order - b.order)
        .map((a) => a.content || "Placeholder");

      if (!exp) {
        return {
          id: item.id,
          year: "Placeholder",
          title: "Placeholder",
          summary: "Placeholder",
          description: "Placeholder",
          techStack: ["Placeholder"],
          achievements: achievements.length > 0 ? achievements : ["Placeholder"],
          stats: metrics.length > 0 ? metrics : [{ label: "Placeholder", value: "Placeholder" }],
        };
      }

      const yearStr = exp.start_date ? new Date(exp.start_date).getFullYear().toString() : "Placeholder";
      const modeContent =
        exp.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
        exp.modeContents?.[0];

      return {
        id: exp.id,
        year: yearStr,
        title: exp.role_title || "Placeholder",
        summary: `${exp.company_name || "Placeholder"}${exp.location ? ` · ${exp.location}` : ""}`,
        description: modeContent?.experience_description || exp.role_title || "Placeholder",
        techStack: modeContent?.experience_highlights && modeContent.experience_highlights.length > 0
          ? modeContent.experience_highlights
          : ["Placeholder"],
        achievements: achievements.length > 0
          ? achievements
          : modeContent?.experience_highlights || ["Placeholder"],
        stats: metrics.length > 0
          ? metrics
          : [{ label: "Placeholder", value: "Placeholder" }],
      };
    });

    return derived;
  }, [experiences, experienceMetrics, experienceAchievements, experienceCMS, activeModeId]);

  const milestoneIds = useMemo(() => milestones.map((m) => m.id), [milestones]);

  // Default active ID uses configured defaultActiveId or top ordered item
  const initialActiveId =
    (experienceCMS?.defaultActiveId && milestoneIds.includes(experienceCMS.defaultActiveId))
      ? experienceCMS.defaultActiveId
      : milestoneIds[0] ?? "";

  const [activeId, setActiveId] = useState(initialActiveId);
  const [expandedId, setExpandedId] = useState(initialActiveId);

  const handleActiveId = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? "" : id));
  }, []);

  useExperienceScroll({
    roadmapRef,
    pathFillRef,
    milestoneIds,
    enabled: isLg === true,
    onActiveId: handleActiveId,
  });

  const activeMilestone =
    milestones.find((m) => m.id === activeId) ?? milestones[0];
  const activeIndex = milestoneIds.indexOf(activeId);

  return (
    <section
      id="experience"
      className="relative w-full scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="experience-heading"
    >
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
        <div className="min-w-0">
          <header className="mb-10 space-y-3 sm:mb-12">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              Experience
            </p>
            <h2
              id="experience-heading"
              className="font-mono text-2xl text-zinc-50 sm:text-3xl"
            >
              Experience Journey
            </h2>
          </header>

          {isLg === null ? (
            <div className="min-h-[40vh]" aria-hidden />
          ) : null}

          {isLg === true ? (
            <div
              ref={roadmapRef}
              className="relative"
              role="list"
              aria-label="Career milestones"
            >
              <div
                className="pointer-events-none absolute top-0 bottom-0 left-0 w-3"
                aria-hidden
              >
                <div className="absolute top-[18px] bottom-[18px] left-1/2 w-px -translate-x-1/2 bg-white/10" />
                <div
                  ref={pathFillRef}
                  className="absolute top-[18px] bottom-[18px] left-1/2 w-px origin-top -translate-x-1/2 bg-zinc-100"
                />
              </div>

              {milestones.map((milestone, index) => (
                <div key={milestone.id} role="listitem">
                  <ExperienceMilestone
                    milestone={milestone}
                    variant="desktop"
                    isActive={milestone.id === activeId}
                    isPassed={activeIndex >= 0 && index < activeIndex}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {isLg === false ? (
            <div role="list" aria-label="Career milestones">
              {milestones.map((milestone) => (
                <div key={milestone.id} role="listitem">
                  <ExperienceMilestone
                    milestone={milestone}
                    variant="mobile"
                    isExpanded={expandedId === milestone.id}
                    onToggle={handleToggle}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {isLg === true && activeMilestone ? (
          <div className="min-w-0">
            <ExperienceStickyPanel milestone={activeMilestone} />
          </div>
        ) : null}
      </div>
    </section>
  );
}


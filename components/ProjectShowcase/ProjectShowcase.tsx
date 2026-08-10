"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState, useMemo } from "react";
import ProjectExpandModal from "@/components/SelectedWork/ProjectExpandModal";
import ShowcaseCard from "./ShowcaseCard";
import ViewAllCard from "./ViewAllCard";
import {
  PROJECT_SHOWCASE,
  SHOWCASE_PROJECTS as FALLBACK_SHOWCASE_PROJECTS,
  type ShowcaseProject,
} from "./projectShowcase.config";
import { useHorizontalScroll } from "./hooks/useHorizontalScroll";
import { useAdminStore } from "@/app/admin/_components/store";

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ShowcaseProject | null>(null);

  const { projects, projectHighlights, projectShowcaseCMS } = useAdminStore();

  const dynamicProjects: ShowcaseProject[] = useMemo(() => {
    if (!projectShowcaseCMS || !projectShowcaseCMS.items || projectShowcaseCMS.items.length === 0) {
      return FALLBACK_SHOWCASE_PROJECTS;
    }

    const activeItems = [...projectShowcaseCMS.items]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const derived = activeItems.map((item, idx) => {
      const proj = projects.find((p) => p.id === item.projectId);
      const highlights = projectHighlights
        .filter((h) => h.projectId === item.projectId && h.visible)
        .sort((a, b) => a.order - b.order)
        .map((h) => ({ label: h.content }));

      const formattedNum = (idx + 1).toString().padStart(2, "0");
      const modeContent = proj?.modeContents?.[0];

      if (!proj) {
        return {
          id: item.id,
          slug: `showcase-${idx + 1}`,
          number: formattedNum,
          name: "Showcase System",
          oneLiner: "Interactive software architecture.",
          techStack: ["Next.js", "TypeScript", "PostgreSQL"],
          metrics: highlights.length > 0 ? highlights : [{ label: "High Speed" }],
          challenge: "Scale & interactive UX.",
          solution: "Prisma PostgreSQL & modern Next.js engine.",
          impact: "Shipped for production users.",
          technicalHighlights: ["Sub-50ms render", "Strict type safety"],
        };
      }

      return {
        id: proj.id,
        slug: proj.slug,
        number: formattedNum,
        name: proj.project_name,
        oneLiner: modeContent?.project_description || `${proj.project_name} production platform.`,
        techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Next.js", "TypeScript", "PostgreSQL"],
        metrics: highlights.length > 0
          ? highlights
          : (modeContent?.project_highlights || ["REVENUE PLATFORM"]).map((h) => ({ label: h })),
        challenge: modeContent?.project_description || "Scalable web platform.",
        solution: `Built with ${proj.project_tech.join(", ")}.`,
        impact: `Active ${proj.project_status.toLowerCase()} project.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["Production grade", "TypeScript architecture"],
      };
    });

    return derived.length > 0 ? derived : FALLBACK_SHOWCASE_PROJECTS;
  }, [projects, projectHighlights, projectShowcaseCMS]);

  const onOpen = useCallback((project: ShowcaseProject) => {
    setActive(project);
  }, []);

  const onClose = useCallback(() => {
    setActive(null);
  }, []);

  useHorizontalScroll({
    containerRef,
    trackRef,
    enabled: true,
  });

  return (
    <section
      ref={containerRef}
      id="work"
      className="project-showcase relative z-10 w-full scroll-mt-24"
      aria-labelledby="showcase-heading"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden bg-transparent py-16 sm:py-20 lg:py-28">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.header
            className="mb-10 max-w-2xl space-y-3 sm:mb-12 lg:mb-14"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={headerFade}
          >
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              {PROJECT_SHOWCASE.eyebrow}
            </p>
            <h2
              id="showcase-heading"
              className="font-mono text-2xl tracking-tight text-zinc-50 sm:text-3xl"
            >
              {PROJECT_SHOWCASE.heading}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
              {PROJECT_SHOWCASE.subtitle}
            </p>
          </motion.header>
        </div>

        <div className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className="project-showcase__track flex w-max items-stretch gap-5 pl-4 pr-4 sm:gap-6 sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 lg:gap-7 lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))] lg:pr-12"
            role="list"
            aria-label="Project showcase"
          >
            {dynamicProjects.map((project) => (
              <div key={project.id} role="listitem" className="shrink-0">
                <ShowcaseCard project={project} onOpen={onOpen} />
              </div>
            ))}
            <div role="listitem" className="shrink-0">
              <ViewAllCard />
            </div>
          </div>
        </div>
      </div>

      <ProjectExpandModal project={active} onClose={onClose} />
    </section>
  );
}


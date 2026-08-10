"use client";

import { motion } from "framer-motion";
import { useCallback, useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import ProjectExpandModal from "./ProjectExpandModal";
import {
  SELECTED_PROJECTS as FALLBACK_PROJECTS,
  SELECTED_WORK,
  type SelectedProject,
} from "./selectedWork.config";
import { useAdminStore } from "@/app/admin/_components/store";

const headerFade = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function SelectedWork() {
  const [active, setActive] = useState<SelectedProject | null>(null);
  const { projects, projectHighlights, selectedWorkCMS } = useAdminStore();

  const dynamicProjects: SelectedProject[] = useMemo(() => {
    if (!selectedWorkCMS || !selectedWorkCMS.items || selectedWorkCMS.items.length === 0) {
      return FALLBACK_PROJECTS;
    }

    const activeItems = [...selectedWorkCMS.items]
      .filter((i) => i.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const derived = activeItems.map((item, idx) => {
      const proj = projects.find((p) => p.id === item.projectId);
      const highlights = projectHighlights
        .filter((h) => h.projectId === item.projectId && h.visible)
        .sort((a, b) => a.order - b.order)
        .map((h) => ({ label: h.content }));

      const formattedNum = item.customNumber || (idx + 1).toString().padStart(2, "0");
      const modeContent = proj?.modeContents?.[0];

      if (!proj) {
        return {
          id: item.id,
          slug: `project-${idx + 1}`,
          number: formattedNum,
          name: "Featured Project",
          oneLiner: "Interactive web application platform.",
          techStack: ["Next.js", "TypeScript", "PostgreSQL"],
          metrics: highlights.length > 0 ? highlights : [{ label: "Production API" }],
          challenge: "Designing a high-throughput architecture.",
          solution: "Implemented Next.js App Router and Prisma database layer.",
          impact: "Delivered sub-100ms response times.",
          technicalHighlights: ["Prisma PostgreSQL schema", "Next.js server components"],
          offset: item.offset as "up" | "down" | undefined,
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
          : (modeContent?.project_highlights || ["REVENUE PLATFORM", "ADVANCED SEARCH"]).map((h) => ({ label: h })),
        challenge: modeContent?.project_description || "High-performance web architecture.",
        solution: `Built with ${proj.project_tech.join(", ")}.`,
        impact: `Active ${proj.project_status.toLowerCase()} product.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["Production deployment", "Optimized DX"],
        offset: item.offset as "up" | "down" | undefined,
      };
    });

    return derived.length > 0 ? derived : FALLBACK_PROJECTS;
  }, [projects, projectHighlights, selectedWorkCMS]);

  const onOpen = useCallback((project: SelectedProject) => {
    setActive(project);
  }, []);

  const onClose = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <section
      id="work"
      className="relative w-full scroll-mt-24 overflow-hidden bg-transparent px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="work-heading"
    >
      <div className="relative mx-auto w-full max-w-7xl">
        <motion.header
          className="mb-10 max-w-2xl space-y-3 sm:mb-12 lg:mb-14"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={headerFade}
        >
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            {SELECTED_WORK.eyebrow}
          </p>
          <h2
            id="work-heading"
            className="font-mono text-2xl tracking-tight text-zinc-50 sm:text-3xl"
          >
            {SELECTED_WORK.heading}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
            {SELECTED_WORK.subtitle}
          </p>
        </motion.header>

        <div
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:gap-x-8 lg:gap-y-10"
          role="list"
        >
          {dynamicProjects.map((project, index) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                project={project}
                index={index}
                onOpen={onOpen}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectExpandModal project={active} onClose={onClose} />
    </section>
  );
}


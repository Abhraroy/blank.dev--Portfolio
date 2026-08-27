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
import { formatMetricNumber } from "@/components/SelectedWork/selectedWork.config";
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

  const { projects, projectHighlights, projectShowcaseCMS, activeModeId } = useAdminStore();

  const dynamicProjects: ShowcaseProject[] = useMemo(() => {
    if (!projectShowcaseCMS || !projectShowcaseCMS.items || projectShowcaseCMS.items.length === 0) {
      if (projects.length > 0) {
        return projects.map((proj, idx) => {
          const modeContent =
            proj.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
            proj.modeContents?.[0];

          const currencySymbol =
            modeContent?.currency !== undefined && modeContent?.currency !== null
              ? modeContent.currency
              : "$";
          const userMetric = formatMetricNumber(modeContent?.project_user_count);
          const revMetric = formatMetricNumber(modeContent?.project_revenue, currencySymbol);
          const compiledMetrics: { label: string }[] = [];
          if (userMetric) compiledMetrics.push({ label: `${userMetric} Users` });
          if (revMetric) compiledMetrics.push({ label: `${revMetric} Revenue` });
          if (modeContent?.project_highlights && modeContent.project_highlights.length > 0) {
            compiledMetrics.push(...modeContent.project_highlights.map((h) => ({ label: h })));
          }

          return {
            id: proj.id,
            slug: proj.slug,
            number: (idx + 1).toString().padStart(2, "0"),
            name: proj.project_name || "Placeholder",
            oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
            techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
            metrics: compiledMetrics.length > 0 ? compiledMetrics : [{ label: "Production Scale" }],
            challenge: modeContent?.challenge || modeContent?.project_description || "Placeholder",
            solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "Placeholder"}.`,
            impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} project.`,
            technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
              ? modeContent.project_highlights
              : ["High throughput architecture", "Scalable data pipeline"],
            userCount: modeContent?.project_user_count ?? null,
            revenue: modeContent?.project_revenue ?? null,
            currency: currencySymbol,
            extraNotes: modeContent?.extra_notes ?? null,
            githubUrl: proj.project_github || undefined,
            liveUrl: proj.project_url || undefined,
          };
        });
      }
      return [
        {
          id: "ph-showcase-1",
          slug: "placeholder-showcase-1",
          number: "01",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [{ label: "Placeholder" }],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        },
        {
          id: "ph-showcase-2",
          slug: "placeholder-showcase-2",
          number: "02",
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: [{ label: "Placeholder" }],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        },
      ];
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
      const modeContent =
        proj?.modeContents?.find((m) => m.portfolioModeId === activeModeId) ||
        proj?.modeContents?.[0];

      if (!proj) {
        return {
          id: item.id,
          slug: `showcase-${idx + 1}`,
          number: formattedNum,
          name: "Placeholder",
          oneLiner: "Placeholder",
          techStack: ["Placeholder"],
          metrics: highlights.length > 0 ? highlights : [{ label: "Placeholder" }],
          challenge: "Placeholder",
          solution: "Placeholder",
          impact: "Placeholder",
          technicalHighlights: ["Placeholder"],
        };
      }

      const currencySymbol =
        modeContent?.currency !== undefined && modeContent?.currency !== null
          ? modeContent.currency
          : "$";
      const userMetric = formatMetricNumber(modeContent?.project_user_count);
      const revMetric = formatMetricNumber(modeContent?.project_revenue, currencySymbol);
      const compiledMetrics: { label: string }[] = [];
      if (userMetric) compiledMetrics.push({ label: `${userMetric} Users` });
      if (revMetric) compiledMetrics.push({ label: `${revMetric} Revenue` });
      if (highlights.length > 0) {
        compiledMetrics.push(...highlights);
      } else if (modeContent?.project_highlights && modeContent.project_highlights.length > 0) {
        compiledMetrics.push(...modeContent.project_highlights.map((h) => ({ label: h })));
      }
      if (compiledMetrics.length === 0) {
        compiledMetrics.push({ label: "Production Scale" });
      }

      return {
        id: proj.id,
        slug: proj.slug,
        number: formattedNum,
        name: proj.project_name || "Placeholder",
        oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
        techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
        metrics: compiledMetrics,
        challenge: modeContent?.challenge || modeContent?.project_description || "Placeholder",
        solution: modeContent?.solution || `Built with ${proj.project_tech?.join(", ") || "Placeholder"}.`,
        impact: modeContent?.impact || `Active ${proj.project_status || "Placeholder"} project.`,
        technicalHighlights: modeContent?.project_highlights && modeContent.project_highlights.length > 0
          ? modeContent.project_highlights
          : ["High throughput architecture", "Zero-downtime deployment"],
        userCount: modeContent?.project_user_count ?? null,
        revenue: modeContent?.project_revenue ?? null,
        currency: currencySymbol,
        extraNotes: modeContent?.extra_notes ?? null,
        githubUrl: proj.project_github || undefined,
        liveUrl: proj.project_url || undefined,
      };
    });

    return derived;
  }, [projects, projectHighlights, projectShowcaseCMS, activeModeId]);

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
    dependencies: [dynamicProjects.length, dynamicProjects],
  });

  return (
    <section
      ref={containerRef}
      id="showcase"
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


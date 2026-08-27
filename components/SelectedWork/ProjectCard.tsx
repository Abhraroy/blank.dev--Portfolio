"use client";

import { motion } from "framer-motion";
import { FiUsers, FiTrendingUp } from "react-icons/fi";
import { type SelectedProject, formatMetricNumber } from "./selectedWork.config";
import { trackProjectClicked } from "@/lib/track";

type ProjectCardProps = {
  project: SelectedProject;
  index: number;
  onOpen: (project: SelectedProject) => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/**
 * Glass project card — glass fill + glowing border (no glow frame).
 */
export default function ProjectCard({
  project,
  index,
  onOpen,
}: ProjectCardProps) {
  const offsetClass =
    project.offset === "down"
      ? "md:mt-10 lg:mt-14"
      : project.offset === "up"
        ? "md:-mt-2 lg:mt-0"
        : "";

  const currencySymbol =
    project.currency !== undefined && project.currency !== null
      ? project.currency
      : "$";

  return (
    <motion.article
      className={`relative ${offsetClass}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      custom={index}
      variants={fadeUp}
    >
      <motion.button
        type="button"
        onClick={() => {
          trackProjectClicked(project.id);
          onOpen(project);
        }}
        className="group block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-label={`Click me — ${project.name}`}
      >
        <div className="glass-panel flex min-h-[280px] flex-col justify-between gap-5 rounded-2xl p-5 sm:min-h-[300px] sm:p-6 lg:p-7 transition-colors group-hover:border-white/25">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                {project.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase transition-colors group-hover:text-zinc-300">
                Click me
              </span>
            </div>
            <h3 className="font-mono text-xl tracking-tight text-zinc-50 sm:text-2xl">
              {project.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400 line-clamp-3">
              {project.oneLiner}
            </p>
          </div>

          {/* Scale & Impact Metrics Banner (Visible Initially) */}
          {(project.userCount || project.revenue) && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-950/30 px-3.5 py-2.5 shadow-inner">
              {project.userCount ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <FiUsers className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-zinc-100">
                    {formatMetricNumber(project.userCount)}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    Active Users
                  </span>
                </div>
              ) : null}
              {project.userCount && project.revenue ? (
                <span className="text-zinc-600 font-mono">·</span>
              ) : null}
              {project.revenue ? (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <FiTrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300">
                    {formatMetricNumber(project.revenue, currencySymbol)}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
                    Revenue
                  </span>
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Metrics & Highlights Grid */}
          <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
            {project.metrics.slice(0, 4).map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors group-hover:border-white/20"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80" />
                <p className="font-mono text-[10px] leading-snug tracking-wide text-zinc-300 uppercase sm:text-[11px] truncate">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}

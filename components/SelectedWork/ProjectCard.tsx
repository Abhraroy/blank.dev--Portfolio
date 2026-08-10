"use client";

import { motion } from "framer-motion";
import type { SelectedProject } from "./selectedWork.config";

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
        onClick={() => onOpen(project)}
        className="group block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-label={`Click me — ${project.name}`}
      >
        <div className="glass-panel flex min-h-[280px] flex-col justify-between gap-6 rounded-2xl p-5 sm:min-h-[300px] sm:p-6 lg:p-7">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                {project.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase transition-colors group-hover:text-zinc-400">
                Click me
              </span>
            </div>
            <h3 className="font-mono text-xl tracking-tight text-zinc-50 sm:text-2xl">
              {project.name}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              {project.oneLiner}
            </p>
          </div>

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

          <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <p className="font-mono text-[10px] leading-snug tracking-wide text-zinc-300 uppercase sm:text-[11px]">
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

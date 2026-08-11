"use client";

import {
  SHOWCASE_CARD_CLASS,
  type ShowcaseProject,
} from "./projectShowcase.config";
import { trackProjectClicked } from "@/lib/track";

type ShowcaseCardProps = {
  project: ShowcaseProject;
  onOpen: (project: ShowcaseProject) => void;
};

/**
 * Glassmorphic project card — fixed height shell + glowing border.
 */
export default function ShowcaseCard({ project, onOpen }: ShowcaseCardProps) {
  return (
    <article className={SHOWCASE_CARD_CLASS}>
      <button
        type="button"
        onClick={() => {
          trackProjectClicked(project.id);
          onOpen(project);
        }}
        className="group block h-full w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        aria-label={`Open ${project.name}`}
      >
        <div className="showcase-panel flex h-full flex-col justify-between gap-5 rounded-2xl p-5 sm:gap-6 sm:p-6 lg:p-7">
          <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                {project.number}
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-600 uppercase transition-colors group-hover:text-zinc-400">
                View
              </span>
            </div>
            <h3 className="font-mono text-xl tracking-tight text-zinc-50 sm:text-2xl">
              {project.name}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {project.oneLiner}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 pt-4">
            {project.metrics.slice(0, 4).map((metric) => (
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
      </button>
    </article>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import type { SelectedProject } from "./selectedWork.config";

type ProjectExpandModalProps = {
  project: SelectedProject | null;
  onClose: () => void;
};

/**
 * Expanded glass panel — glass fill + glowing border (no glow frame).
 */
export default function ProjectExpandModal({
  project,
  onClose,
}: ProjectExpandModalProps) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-zinc-950/70"
            onClick={onClose}
          />

          <motion.div
            className="glass-panel glass-panel--active relative z-10 w-full max-w-2xl rounded-2xl sm:rounded-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-h-[min(88vh,820px)] overflow-y-auto p-5 sm:p-7 lg:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                    {project.number} · Case brief
                  </p>
                  <h3
                    id="project-modal-title"
                    className="font-mono text-2xl tracking-tight text-zinc-50 sm:text-3xl"
                  >
                    {project.name}
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
                    {project.oneLiner}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase transition hover:border-white/20 hover:text-zinc-200"
                >
                  Close
                </button>
              </div>

              <div className="mb-6 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-5">
                <ModalBlock title="Challenge" body={project.challenge} />
                <ModalBlock title="Solution" body={project.solution} />
                <ModalBlock title="Impact" body={project.impact} />

                <div className="space-y-2">
                  <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
                    Technical Highlights
                  </p>
                  <ul className="space-y-1.5">
                    {project.technicalHighlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-relaxed text-zinc-300"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                    >
                      <p className="font-mono text-[10px] tracking-wide text-zinc-300 uppercase">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-zinc-500">
                  Full write-up with architecture notes and outcomes.
                </p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-100 uppercase transition hover:border-white/25 hover:bg-white/15"
                  onClick={onClose}
                >
                  Click me
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ModalBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
        {title}
      </p>
      <p className="text-sm leading-relaxed text-zinc-300">{body}</p>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { FiUsers, FiDollarSign } from "react-icons/fi";
import type { SelectedProject } from "./selectedWork.config";
import { trackProjectViewed } from "@/lib/track";

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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-white/20 bg-zinc-950/95 p-0 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-h-[min(88vh,820px)] overflow-y-auto p-5 sm:p-7 lg:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-400 font-semibold uppercase">
                    {project.number} · Case brief
                  </p>
                  <h3
                    id="project-modal-title"
                    className="font-mono text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
                  >
                    {project.name}
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-zinc-200">
                    {project.oneLiner}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.18em] text-zinc-200 uppercase transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Scale & Impact Metrics Grid (if userCount or revenue exists) */}
              {(project.userCount || project.revenue) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/40">
                  {project.userCount ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                        <FiUsers className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">
                          Active Users
                        </span>
                        <p className="font-mono text-sm font-bold text-zinc-50">
                          {project.userCount.toLocaleString()}+ Users
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {project.revenue ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        <FiDollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block font-medium">
                          Impact / Revenue
                        </span>
                        <p className="font-mono text-sm font-bold text-emerald-300">
                          {project.currency !== undefined && project.currency !== null ? project.currency : "$"}
                          {project.revenue.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-xs font-medium text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-5">
                <ModalBlock title="Challenge" body={project.challenge} />
                <ModalBlock title="Solution" body={project.solution} />
                <ModalBlock title="Impact" body={project.impact} />

                {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-300 uppercase font-semibold">
                      Technical Highlights
                    </p>
                    <ul className="space-y-2">
                      {project.technicalHighlights.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-200"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)]"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.extraNotes && (
                  <div className="space-y-2 rounded-2xl border border-white/15 bg-white/[0.04] p-4">
                    <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-300 uppercase font-semibold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      Architectural Notes & Key Observations
                    </p>
                    {parseBullets(project.extraNotes).length > 0 ? (
                      <ul className="space-y-1.5">
                        {parseBullets(project.extraNotes).map((note, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs leading-relaxed text-zinc-200"
                          >
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400"
                              aria-hidden
                            />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs leading-relaxed text-zinc-200">
                        {project.extraNotes}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5"
                    >
                      <p className="font-mono text-[10px] tracking-wide text-zinc-200 uppercase font-medium">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-zinc-400">
                  Full write-up with architecture notes and outcomes.
                </p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/15 hover:bg-white/25 px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase transition shadow-sm"
                  onClick={() => {
                    trackProjectViewed(project.id);
                    onClose();
                  }}
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

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  const lines = text.split(/\r?\n|\|/);
  const items = lines
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
  return items;
}

function ModalBlock({ title, body }: { title: string; body: string }) {
  const bulletItems = parseBullets(body);

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-300 uppercase font-semibold">
        {title}
      </p>
      {bulletItems.length > 0 ? (
        <ul className="space-y-2">
          {bulletItems.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-200"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-zinc-200">{body}</p>
      )}
    </div>
  );
}

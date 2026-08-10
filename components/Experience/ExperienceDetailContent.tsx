"use client";

import Image from "next/image";
import { memo } from "react";
import type { ExperienceMilestone } from "./experience.config";

type ExperienceDetailContentProps = {
  milestone: ExperienceMilestone;
  /** Compact padding for mobile accordion vs desktop sticky card. */
  compact?: boolean;
};

/**
 * Shared milestone detail body — sticky desktop card and mobile accordion.
 */
function ExperienceDetailContent({
  milestone,
  compact = false,
}: ExperienceDetailContentProps) {
  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {milestone.image ? (
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-44">
          <Image
            src={milestone.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full rounded-full bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700"
          aria-hidden
        />
      )}

      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          {milestone.year}
        </p>
        <h3 className="font-mono text-2xl leading-tight text-zinc-50 lg:text-3xl">
          {milestone.title}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-zinc-400">
        {milestone.description}
      </p>

      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
          Tech stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {milestone.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
          Key achievements
        </p>
        <ul className="space-y-1.5">
          {milestone.achievements.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-relaxed text-zinc-300"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
        {milestone.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center"
          >
            <p className="font-mono text-sm font-medium text-zinc-50 sm:text-base">
              {stat.value}
            </p>
            <p className="mt-0.5 font-mono text-[9px] tracking-wide text-zinc-500 uppercase sm:text-[10px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ExperienceDetailContent);

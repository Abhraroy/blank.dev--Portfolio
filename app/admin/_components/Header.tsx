"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAdminStore } from "./store";
import { FiLayers, FiActivity } from "react-icons/fi";

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Portfolio Control Center",
    subtitle: "Overview of database entities, persona modes, and content coverage",
  },
  "/admin/modes": {
    title: "Portfolio Modes",
    subtitle: "Manage persona profiles (e.g. Software Engineer, Founder, Hacker)",
  },
  "/admin/details": {
    title: "My Details & Persona Storytelling",
    subtitle: "Manage primary contact facts and per-mode customized biographies",
  },
  "/admin/projects": {
    title: "Projects Factual Pool",
    subtitle: "Manage project facts (tech, tags, status, feature badges)",
  },
  "/admin/experience": {
    title: "Career Experience Factual Pool",
    subtitle: "Manage employment history facts, role metrics, and achievement bullets",
  },
  "/admin/cms": {
    title: "Centralized CMS Management Hub",
    subtitle: "Full CMS section selection, composition, spatial reordering, and display toggles",
  },
  "/admin/cms/about": {
    title: "About Me CMS Section",
    subtitle: "Manage dynamic visual blocks (Blocks 1..7), items, CTAs, and profile bios",
  },
  "/admin/cms/experience": {
    title: "Experience Journey CMS Section",
    subtitle: "Pick displayed milestones, ordering, default initial item, and field toggles",
  },
  "/admin/cms/selected-work": {
    title: "Selected Work Grid CMS Section",
    subtitle: "Pick active projects, sequence order, vertical masonry offset, and custom numbers",
  },
  "/admin/cms/project-showcase": {
    title: "Project Showcase Track CMS Section",
    subtitle: "Select projects featured in the sticky horizontal GSAP track",
  },
};

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { modes, activeModeId, setActiveModeId } = useAdminStore();

  const currentInfo = titleMap[pathname] || {
    title: "Admin Studio",
    subtitle: "Manage portfolio data",
  };

  return (
    <header className="w-full border-b border-white/10 bg-[#09090b]/80 px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-2xl">
      <div className="min-w-0">
        <h2 className="text-base font-mono font-semibold text-zinc-50 tracking-tight truncate">
          {currentInfo.title}
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5 truncate">{currentInfo.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 min-w-0">
        {/* Active Mode Selector */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-sm max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 px-2 text-xs text-zinc-400 font-mono shrink-0">
            <FiLayers className="h-3.5 w-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Active Persona:</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-md py-0.5 scrollbar-thin scrollbar-thumb-zinc-700">
            {modes.map((mode) => {
              const isSelected = mode.id === activeModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveModeId(mode.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-white/15 text-zinc-50 shadow-sm font-semibold border border-white/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {mode.mode_name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400 shrink-0">
          <FiActivity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-zinc-300">Prisma Client</span>
        </div>
      </div>
    </header>
  );
};

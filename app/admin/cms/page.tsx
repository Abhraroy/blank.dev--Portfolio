"use client";

import React from "react";
import Link from "next/link";
import { useAdminStore } from "../_components/store";
import {
  FiLayout,
  FiBriefcase,
  FiGrid,
  FiSliders,
  FiChevronRight,
  FiSliders as FiCms,
  FiLayers,
  FiSmartphone,
} from "react-icons/fi";

export default function CMSHubPage() {
  const { sections, experienceCMS, selectedWorkCMS, projectShowcaseCMS, heroNodesCMS, mobileHeroSkills, activeModeId, modes } = useAdminStore();

  const aboutSection = sections.find((s) => s.key === "ABOUT");
  const aboutBlocksCount = aboutSection?.blocks?.length || 0;
  const activeMode = modes.find((m) => m.id === activeModeId)?.mode_name || "Default";

  const cmsSections = [
    {
      id: "mobile-hero",
      name: "Mobile View Hero Skills CMS",
      description: "Manage typewriter skill string records, display sequence, and visibility for the mobile view hero section.",
      href: "/admin/cms/mobile-hero",
      icon: FiSmartphone,
      badgeText: `${mobileHeroSkills?.length || 0} Skill Records`,
      visible: true,
    },
    {
      id: "hero-nodes",
      name: "Hero 3D Network Nodes CMS",
      description: "Manage 3D skill nodes, popup card titles, descriptions, tech tags, CTAs, display sequence, and visibility on the interactive hero sphere.",
      href: "/admin/cms/hero-nodes",
      icon: FiSliders,
      badgeText: `${heroNodesCMS?.items?.length || 0} Network Nodes`,
      visible: heroNodesCMS?.visible ?? true,
    },
    {
      id: "about",
      name: "About Me Visual Blocks",
      description: "Manage dynamic visual cards, spatial positioning (Blocks 1..7), items, CTAs, and persona bios.",
      href: "/admin/cms/about",
      icon: FiLayout,
      badgeText: `${aboutBlocksCount} Content Blocks`,
      visible: true,
    },
    {
      id: "experience",
      name: "Experience Journey CMS",
      description: "Pick active career roles, set display sequence, default initial active milestone, and field visibility toggles.",
      href: "/admin/cms/experience",
      icon: FiBriefcase,
      badgeText: `${experienceCMS?.items?.length || 0} Displayed Milestones`,
      visible: experienceCMS?.visible ?? true,
    },
    {
      id: "selected-work",
      name: "Selected Work Grid CMS",
      description: "Pick active projects, sequence order, vertical masonry offset (up/down), and custom project numbers (01, 02).",
      href: "/admin/cms/selected-work",
      icon: FiGrid,
      badgeText: `${selectedWorkCMS?.items?.length || 0} Selected Projects`,
      visible: selectedWorkCMS?.visible ?? true,
    },
    {
      id: "project-showcase",
      name: "Project Showcase GSAP Track CMS",
      description: "Configure projects featured in the sticky horizontal GSAP track, reorder slides, and set display flags.",
      href: "/admin/cms/project-showcase",
      icon: FiSliders,
      badgeText: `${projectShowcaseCMS?.items?.length || 0} Showcase Slides`,
      visible: projectShowcaseCMS?.visible ?? true,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          CMS Control Layer
        </p>
        <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
          <FiCms className="text-zinc-300 h-5 w-5" /> Centralized CMS Section Management
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Full CMS composition control for every section of your portfolio site. Factual data models remain untouched.
        </p>
      </div>

      {/* Persona Context Notice */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-4 flex items-center justify-between shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-3">
          <FiLayers className="h-5 w-5 text-zinc-300" />
          <div>
            <h3 className="text-xs font-mono font-semibold text-zinc-100">
              Active Persona: <span className="text-zinc-300">{activeMode}</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              CMS sections compose content dynamically based on persona selection.
            </p>
          </div>
        </div>
        <Link
          href="/admin/modes"
          className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1"
        >
          Manage Modes <FiChevronRight />
        </Link>
      </div>

      {/* Grid of CMS Section Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cmsSections.map((sec) => {
          const Icon = sec.icon;

          return (
            <Link
              key={sec.id}
              href={sec.href}
              className="group relative rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 hover:border-white/30 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-mono font-bold text-zinc-100 group-hover:text-white transition-colors">
                        {sec.name}
                      </h3>
                      <span className="inline-block text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 mt-1">
                        {sec.badgeText}
                      </span>
                    </div>
                  </div>

                  <FiChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-200 group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5 text-[11px]">
                  {sec.visible ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Section Active
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" /> Hidden Section
                    </>
                  )}
                </span>
                <span className="text-zinc-300 font-semibold group-hover:text-white group-hover:underline">
                  Configure CMS &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

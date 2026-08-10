"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminStore } from "./_components/store";
import {
  FiLayers,
  FiUser,
  FiFolder,
  FiBriefcase,
  FiArrowRight,
  FiCode,
  FiDatabase,
  FiCheckCircle,
  FiSliders,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { modes, details, projects, experiences, activeModeId } = useAdminStore();
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  const activeDetailsContent = details.modeContents?.find(
    (c) => c.portfolioModeId === activeModeId
  );

  const statCards = [
    {
      title: "Portfolio Modes",
      count: modes.length,
      label: "Master Personas",
      icon: FiLayers,
      href: "/admin/modes",
    },
    {
      title: "Projects",
      count: projects.length,
      label: "Portfolio Work Items",
      icon: FiFolder,
      href: "/admin/projects",
    },
    {
      title: "Experience",
      count: experiences.length,
      label: "Career Milestones",
      icon: FiBriefcase,
      href: "/admin/experience",
    },
    {
      title: "CMS Hub",
      count: 4,
      label: "Composed Sections",
      icon: FiSliders,
      href: "/admin/cms",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-zinc-950/60 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-xs font-mono">
              <FiDatabase className="h-3.5 w-3.5 text-zinc-200" /> Direct Prisma Model Interface
            </div>
            <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-zinc-50">
              Portfolio Operations
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Manage factual domain records (Projects, Experience, Details) and CMS section compositions per <span className="text-zinc-200 font-semibold font-mono">PortfolioMode</span> using the client design standard.
            </p>
          </div>
          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-mono font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all shadow-sm"
          >
            <FiCode className="h-4 w-4" />
            {showJsonInspector ? "Hide Prisma Payload" : "View Live DB JSON"}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-5 hover:border-white/30 transition-all duration-300 backdrop-blur-xl shadow-[0_0_12px_rgba(255,255,255,0.06)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{card.title}</span>
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-zinc-50 font-mono tracking-tight">
                  {card.count}
                </span>
                <span className="text-xs text-zinc-500 font-mono">{card.label}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-zinc-200">
                <span>Open Section</span>
                <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Active Persona Snapshot */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-6 space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                Active Persona Context
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-zinc-200 border border-white/20">
                {activeMode?.mode_name}
              </span>
            </div>
            <h2 className="text-lg font-mono font-semibold text-zinc-50 mt-1">
              Persona Storytelling Summary
            </h2>
          </div>
          <Link
            href="/admin/modes"
            className="text-xs font-mono text-zinc-300 hover:text-white font-medium inline-flex items-center gap-1"
          >
            Manage Modes <FiArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Details Overview */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase font-mono tracking-[0.2em]">
                Headline & Bio
              </h3>
              <FiUser className="h-4 w-4 text-zinc-400" />
            </div>
            {activeDetailsContent ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-200">
                  {activeDetailsContent.headline || "No headline set"}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {activeDetailsContent.short_bio || "No short bio set"}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {activeDetailsContent.highlights?.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-500 italic">
                No storytelling content configured for this mode yet.
              </p>
            )}
          </div>

          {/* Linked Projects */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase font-mono tracking-[0.2em]">
                Projects with Mode Content
              </h3>
              <FiFolder className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="space-y-2">
              {projects.map((proj) => {
                const hasContent = proj.modeContents?.some(
                  (c) => c.portfolioModeId === activeModeId
                );
                return (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-zinc-300 font-medium">{proj.project_name}</span>
                    {hasContent ? (
                      <span className="inline-flex items-center text-[10px] text-emerald-400 font-mono">
                        <FiCheckCircle className="mr-1 h-3 w-3" /> Configured
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-mono">Fact Only</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linked Experience */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase font-mono tracking-[0.2em]">
                Experience with Mode Content
              </h3>
              <FiBriefcase className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="space-y-2">
              {experiences.map((exp) => {
                const hasContent = exp.modeContents?.some(
                  (c) => c.portfolioModeId === activeModeId
                );
                return (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <div className="text-zinc-300 font-medium">{exp.role_title}</div>
                      <div className="text-[11px] text-zinc-500">{exp.company_name}</div>
                    </div>
                    {hasContent ? (
                      <span className="inline-flex items-center text-[10px] text-emerald-400 font-mono">
                        <FiCheckCircle className="mr-1 h-3 w-3" /> Configured
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-mono">Fact Only</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* JSON Inspector Payload Modal */}
      {showJsonInspector && (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FiCode className="h-4 w-4 text-zinc-300" />
              <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                Prisma Client JSON Payload
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              Live State Serialization
            </span>
          </div>
          <pre className="max-h-96 overflow-auto rounded-xl border border-white/10 bg-[#09090b] p-4 font-mono text-xs text-zinc-300 selection:bg-zinc-800 selection:text-white">
            {JSON.stringify(
              {
                PortfolioMode: modes,
                MyDetails: details,
                Project: projects,
                Experience: experiences,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

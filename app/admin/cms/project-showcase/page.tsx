"use client";

import React from "react";
import { useAdminStore } from "../../_components/store";
import {
  FiSliders,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
} from "react-icons/fi";

export default function CMSProjectShowcasePage() {
  const {
    projects,
    projectShowcaseCMS,
    updateProjectShowcaseCMS,
    addProjectShowcaseCMSItem,
    updateProjectShowcaseCMSItem,
    deleteProjectShowcaseCMSItem,
    reorderProjectShowcaseCMSItems,
  } = useAdminStore();

  const psCMSItems = [...(projectShowcaseCMS.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleMovePSItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === psCMSItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...psCMSItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    reorderProjectShowcaseCMSItems(reindexed);
  };

  const handleTogglePSProject = (projId: string) => {
    const existing = psCMSItems.find((i) => i.projectId === projId);
    if (existing) {
      deleteProjectShowcaseCMSItem(existing.id);
    } else {
      addProjectShowcaseCMSItem({
        projectId: projId,
        displayOrder: psCMSItems.length + 1,
        visible: true,
        showDescription: true,
        showTechnologies: true,
        showViewAction: true,
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          Project Showcase CMS
        </p>
        <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
          <FiSliders className="text-zinc-300 h-5 w-5" /> Showcase GSAP Track Composition
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Select which projects appear in the sticky horizontal GSAP scroll track in the <strong>Project Showcase</strong> section, reorder slides, and toggle field visibility.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-5 space-y-2 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between font-mono">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <FiSliders className="h-4 w-4" /> Showcase Track Control
          </span>
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={projectShowcaseCMS.visible}
              onChange={(e) => updateProjectShowcaseCMS({ visible: e.target.checked })}
              className="rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
            />
            Section Enabled on Site
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Track Sequence & Selection
        </h2>

        <div className="space-y-3">
          {projects.map((proj) => {
            const cmsItem = psCMSItems.find((i) => i.projectId === proj.id);
            const isIncluded = Boolean(cmsItem);
            const itemIndex = cmsItem ? psCMSItems.indexOf(cmsItem) : -1;

            return (
              <div
                key={proj.id}
                className={`rounded-2xl border p-4 transition-all flex items-center justify-between gap-3 font-mono ${
                  isIncluded ? "border-white/20 bg-white/[0.04]" : "border-white/5 bg-zinc-950/40 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isIncluded}
                    onChange={() => handleTogglePSProject(proj.id)}
                    className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-100">{proj.project_name}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">/{proj.slug}</span>
                  </div>
                </div>

                {cmsItem && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                      Track #{cmsItem.displayOrder}
                    </span>
                    <button
                      disabled={itemIndex === 0}
                      onClick={() => handleMovePSItem(itemIndex, "up")}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      disabled={itemIndex === psCMSItems.length - 1}
                      onClick={() => handleMovePSItem(itemIndex, "down")}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      <FiArrowDown />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useAdminStore } from "../../_components/store";
import {
  FiGrid,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
} from "react-icons/fi";

export default function CMSSelectedWorkPage() {
  const {
    projects,
    selectedWorkCMS,
    updateSelectedWorkCMS,
    addSelectedWorkCMSItem,
    updateSelectedWorkCMSItem,
    deleteSelectedWorkCMSItem,
    reorderSelectedWorkCMSItems,
  } = useAdminStore();

  const swCMSItems = [...(selectedWorkCMS.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleMoveSWItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === swCMSItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...swCMSItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));
    reorderSelectedWorkCMSItems(reindexed);
  };

  const handleToggleSWProject = (projId: string) => {
    const existing = swCMSItems.find((i) => i.projectId === projId);
    if (existing) {
      deleteSelectedWorkCMSItem(existing.id);
    } else {
      addSelectedWorkCMSItem({
        projectId: projId,
        displayOrder: swCMSItems.length + 1,
        visible: true,
        offset: swCMSItems.length % 2 === 0 ? "up" : "down",
        customNumber: null,
        showOneLiner: true,
        showDescription: true,
        showTechnologies: true,
        showHighlights: true,
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          Selected Work CMS
        </p>
        <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
          <FiGrid className="text-zinc-300 h-5 w-5" /> Selected Work Grid Composition
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Select which projects appear in the <strong>Selected Work</strong> grid, adjust vertical masonry rhythm (`up`/`down`), custom project numbers (`01`, `02`), and toggle field visibility.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-5 space-y-2 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between font-mono">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <FiGrid className="h-4 w-4" /> Selected Work Grid Control
          </span>
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedWorkCMS.visible}
              onChange={(e) => updateSelectedWorkCMS({ visible: e.target.checked })}
              className="rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
            />
            Section Enabled on Site
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Select & Sequence Projects
        </h2>

        <div className="space-y-3">
          {projects.map((proj) => {
            const cmsItem = swCMSItems.find((i) => i.projectId === proj.id);
            const isIncluded = Boolean(cmsItem);
            const itemIndex = cmsItem ? swCMSItems.indexOf(cmsItem) : -1;

            return (
              <div
                key={proj.id}
                className={`rounded-2xl border p-4 transition-all space-y-3 ${
                  isIncluded ? "border-white/20 bg-white/[0.04]" : "border-white/5 bg-zinc-950/40 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3 font-mono">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => handleToggleSWProject(proj.id)}
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
                        Position #{cmsItem.displayOrder}
                      </span>
                      <button
                        disabled={itemIndex === 0}
                        onClick={() => handleMoveSWItem(itemIndex, "up")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        disabled={itemIndex === swCMSItems.length - 1}
                        onClick={() => handleMoveSWItem(itemIndex, "down")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <FiArrowDown />
                      </button>
                    </div>
                  )}
                </div>

                {cmsItem && (
                  <div className="border-t border-white/10 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Masonry Rhythm Offset</label>
                      <select
                        value={cmsItem.offset || "up"}
                        onChange={(e) => updateSelectedWorkCMSItem(cmsItem.id, { offset: e.target.value as "up" | "down" })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="up">Shift Up</option>
                        <option value="down">Shift Down</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Custom Number Override</label>
                      <input
                        type="text"
                        placeholder="e.g. 01"
                        value={cmsItem.customNumber || ""}
                        onChange={(e) => updateSelectedWorkCMSItem(cmsItem.id, { customNumber: e.target.value || null })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="flex flex-col justify-center gap-1.5 text-[11px] text-zinc-400">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cmsItem.showHighlights}
                          onChange={(e) => updateSelectedWorkCMSItem(cmsItem.id, { showHighlights: e.target.checked })}
                          className="rounded border-white/20 text-white focus:ring-0"
                        />
                        Show Feature Badges
                      </label>
                    </div>
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

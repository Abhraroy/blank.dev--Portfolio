"use client";

import React from "react";
import { useAdminStore } from "../../_components/store";
import {
  FiBriefcase,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiInfo,
} from "react-icons/fi";

export default function CMSExperiencePage() {
  const {
    experiences,
    experienceCMS,
    updateExperienceCMS,
    addExperienceCMSItem,
    updateExperienceCMSItem,
    deleteExperienceCMSItem,
    reorderExperienceCMSItems,
  } = useAdminStore();

  const cmsItems = [...(experienceCMS.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleMoveCMSItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === cmsItems.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...cmsItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    reorderExperienceCMSItems(reindexed);
  };

  const handleToggleCMSExperience = (expId: string) => {
    const existing = cmsItems.find((i) => i.experienceId === expId);
    if (existing) {
      deleteExperienceCMSItem(existing.id);
    } else {
      addExperienceCMSItem({
        experienceId: expId,
        displayOrder: cmsItems.length + 1,
        visible: true,
        isFeatured: false,
        showYear: true,
        showRole: true,
        showCompany: true,
        showDescription: true,
        showTechnologies: true,
        showAchievements: true,
        showMetrics: true,
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          Experience CMS
        </p>
        <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
          <FiBriefcase className="text-zinc-300 h-5 w-5" /> Experience Journey Composition
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Select which career experiences appear on the website, reorder milestones, configure default initial active milestone, and toggle field visibility.
        </p>
      </div>

      {/* Explanation Box */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-5 space-y-3 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
          <FiInfo className="h-4 w-4 text-zinc-400" />
          <span>What is Experience Section CMS Configuration?</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          This CMS layer controls <strong>which experience entries appear</strong> on your portfolio site, 
          their <strong>display sequence (ordering)</strong>, and <strong>field visibility toggles</strong>. 
          The actual role titles, companies, dates, metrics, and bullet points remain stored in the factual domain database.
        </p>

        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-1">
              Default Initial Active Experience
            </label>
            <select
              value={experienceCMS.defaultActiveId || ""}
              onChange={(e) => updateExperienceCMS({ defaultActiveId: e.target.value || null })}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-100 focus:border-white/30 focus:outline-none"
            >
              <option value="">Top Ordered Item (Automatic)</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.role_title} @ {exp.company_name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              Sets which experience milestone is open/highlighted by default on initial page load.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-0 font-mono">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={experienceCMS.visible}
                onChange={(e) => updateExperienceCMS({ visible: e.target.checked })}
                className="rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
              />
              Section Enabled on Site
            </label>
          </div>
        </div>
      </div>

      {/* Experience Picker & Ordering */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Select & Reorder Displayed Experiences
        </h2>

        <div className="space-y-3">
          {experiences.map((exp) => {
            const cmsItem = cmsItems.find((i) => i.experienceId === exp.id);
            const isIncluded = Boolean(cmsItem);
            const itemIndex = cmsItem ? cmsItems.indexOf(cmsItem) : -1;

            return (
              <div
                key={exp.id}
                className={`rounded-2xl border p-4 transition-all space-y-3 ${
                  isIncluded ? "border-white/20 bg-white/[0.04]" : "border-white/5 bg-zinc-950/40 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => handleToggleCMSExperience(exp.id)}
                      className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-100">
                        {exp.role_title} <span className="text-zinc-400 font-normal">@ {exp.company_name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 ml-2">
                        ({exp.start_date ? exp.start_date.slice(0, 4) : "2026"})
                      </span>
                    </div>
                  </div>

                  {cmsItem && (
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                        Position #{cmsItem.displayOrder}
                      </span>
                      <button
                        disabled={itemIndex === 0}
                        onClick={() => handleMoveCMSItem(itemIndex, "up")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        disabled={itemIndex === cmsItems.length - 1}
                        onClick={() => handleMoveCMSItem(itemIndex, "down")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <FiArrowDown />
                      </button>
                    </div>
                  )}
                </div>

                {cmsItem && (
                  <div className="border-t border-white/10 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400 font-mono">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showDescription}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showDescription: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Description
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showTechnologies}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showTechnologies: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Tech Stack
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showAchievements}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showAchievements: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Achievements
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showMetrics}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showMetrics: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Metrics Cards
                    </label>
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

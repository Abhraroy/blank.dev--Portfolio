"use client";

import React, { useState } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiInfo,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Experience } from "../../_components/types";

export default function CMSExperiencePage() {
  const {
    experiences,
    experienceCMS,
    updateExperienceCMS,
    addExperienceCMSItem,
    updateExperienceCMSItem,
    deleteExperienceCMSItem,
    reorderExperienceCMSItems,
    updateExperience,
  } = useAdminStore();

  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<{
    role_title: string;
    company_name: string;
    company_url: string;
    start_date: string;
    end_date: string;
  }>({
    role_title: "",
    company_name: "",
    company_url: "",
    start_date: "",
    end_date: "",
  });

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
    toast.success("Updated milestone display sequence!");
  };

  const handleToggleCMSExperience = (expId: string) => {
    const existing = cmsItems.find((i) => i.experienceId === expId);
    if (existing) {
      deleteExperienceCMSItem(existing.id);
      toast.success("Removed milestone from CMS sequence!");
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
      toast.success("Added milestone to CMS sequence!");
    }
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setExpForm({
      role_title: exp.role_title,
      company_name: exp.company_name,
      company_url: exp.location || "",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
    });
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    updateExperience(editingExp.id, {
      role_title: expForm.role_title,
      company_name: expForm.company_name,
      location: expForm.company_url || null,
      start_date: expForm.start_date,
      end_date: expForm.end_date || null,
    });
    toast.success("Updated milestone experience facts!");
    setEditingExp(null);
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
          Select which career experiences appear on the website, edit role details, reorder milestones, configure default initial active milestone, and toggle field visibility.
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

      {/* Edit Experience Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FiEdit3 className="text-indigo-400" /> Edit Role: {editingExp.role_title} @ {editingExp.company_name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={expForm.role_title}
                    onChange={(e) => setExpForm({ ...expForm, role_title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={expForm.company_name}
                    onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Remote or San Francisco, CA"
                  value={expForm.company_url}
                  onChange={(e) => setExpForm({ ...expForm, company_url: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024-01-01"
                    value={expForm.start_date}
                    onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">End Date (or Present)</label>
                  <input
                    type="text"
                    placeholder="e.g. Present or 2025-06-30"
                    value={expForm.end_date}
                    onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl border border-white/20 bg-white/15 text-xs text-white hover:bg-white/25 flex items-center gap-1.5 font-semibold"
                >
                  <FiCheck /> Save Experience Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Picker & Ordering */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Select, Edit & Reorder Displayed Experiences
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
                      className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
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

                  <div className="flex items-center gap-2 font-mono">
                    {cmsItem && (
                      <>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                          Position #{cmsItem.displayOrder}
                        </span>
                        <button
                          disabled={itemIndex === 0}
                          onClick={() => handleMoveCMSItem(itemIndex, "up")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Up"
                        >
                          <FiArrowUp />
                        </button>
                        <button
                          disabled={itemIndex === cmsItems.length - 1}
                          onClick={() => handleMoveCMSItem(itemIndex, "down")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Down"
                        >
                          <FiArrowDown />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                      title="Edit Role Details"
                    >
                      <FiEdit3 className="h-3.5 w-3.5" />
                    </button>

                    {cmsItem && (
                      <button
                        type="button"
                        onClick={() => deleteExperienceCMSItem(cmsItem.id)}
                        className="p-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Remove from Journey"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
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

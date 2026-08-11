"use client";

import React, { useState } from "react";
import { useAdminStore } from "../../_components/store";
import {
  FiGrid,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";
import { Project } from "../../_components/types";

export default function CMSSelectedWorkPage() {
  const {
    projects,
    selectedWorkCMS,
    updateSelectedWorkCMS,
    addSelectedWorkCMSItem,
    updateSelectedWorkCMSItem,
    deleteSelectedWorkCMSItem,
    reorderSelectedWorkCMSItems,
    updateProject,
  } = useAdminStore();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<{
    project_name: string;
    slug: string;
    project_tech: string;
    project_github: string;
    project_url: string;
  }>({
    project_name: "",
    slug: "",
    project_tech: "",
    project_github: "",
    project_url: "",
  });

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

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setEditForm({
      project_name: proj.project_name,
      slug: proj.slug,
      project_tech: (proj.project_tech || []).join(", "),
      project_github: proj.project_github || "",
      project_url: proj.project_url || "",
    });
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const techArray = editForm.project_tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updateProject(editingProject.id, {
      project_name: editForm.project_name,
      slug: editForm.slug,
      project_tech: techArray,
      project_github: editForm.project_github || null,
      project_url: editForm.project_url || null,
    });

    setEditingProject(null);
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
          Select which projects appear in the <strong>Selected Work</strong> grid, adjust vertical masonry rhythm (`up`/`down`), custom project numbers (`01`, `02`), edit project details, and toggle field visibility.
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

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FiEdit3 className="text-indigo-400" /> Edit Project: {editingProject.project_name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.project_name}
                    onChange={(e) => setEditForm({ ...editForm, project_name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editForm.slug}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-zinc-400 mb-1">Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={editForm.project_tech}
                  onChange={(e) => setEditForm({ ...editForm, project_tech: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">Live URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editForm.project_url}
                    onChange={(e) => setEditForm({ ...editForm, project_url: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={editForm.project_github}
                    onChange={(e) => setEditForm({ ...editForm, project_github: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl border border-white/20 bg-white/15 text-xs text-white hover:bg-white/25 flex items-center gap-1.5 font-semibold"
                >
                  <FiCheck /> Save Project Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Select, Edit & Sequence Projects
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
                      className="h-4 w-4 rounded border-white/20 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-zinc-100">{proj.project_name}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">/{proj.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmsItem && (
                      <>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                          Position #{cmsItem.displayOrder}
                        </span>
                        <button
                          disabled={itemIndex === 0}
                          onClick={() => handleMoveSWItem(itemIndex, "up")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Up"
                        >
                          <FiArrowUp />
                        </button>
                        <button
                          disabled={itemIndex === swCMSItems.length - 1}
                          onClick={() => handleMoveSWItem(itemIndex, "down")}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                          title="Move Down"
                        >
                          <FiArrowDown />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                      title="Edit Project Details"
                    >
                      <FiEdit3 className="h-3.5 w-3.5" />
                    </button>

                    {cmsItem && (
                      <button
                        type="button"
                        onClick={() => deleteSelectedWorkCMSItem(cmsItem.id)}
                        className="p-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Remove from Grid"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
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

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiSliders,
  FiArrowUp,
  FiArrowDown,
  FiSettings,
  FiEdit3,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiSearch,
  FiLayers,
} from "react-icons/fi";
import { Project, ProjectShowcaseSectionCMSItemData } from "../../_components/types";

interface FormState {
  projectId: string;
  // Case Study & Persona Mode Content Fields
  modeTabId: string;
  modeDescription: string;
  modeChallenge: string;
  modeSolution: string;
  modeImpact: string;
  modeHighlights: string;
  modeUserCount: number | "";
  modeRevenue: number | "";
  // Showcase CMS Specific Settings
  showDescription: boolean;
  showTechnologies: boolean;
  showViewAction: boolean;
}

const defaultFormState: FormState = {
  projectId: "",
  modeTabId: "",
  modeDescription: "",
  modeChallenge: "",
  modeSolution: "",
  modeImpact: "",
  modeHighlights: "",
  modeUserCount: "",
  modeRevenue: "",
  showDescription: true,
  showTechnologies: true,
  showViewAction: true,
};

function parseBullets(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n|\|/)
    .map((item) => item.trim().replace(/^[-*•\d+.]\s*/, ""))
    .filter(Boolean);
}

function BulletListInput({ label, value, onChange, placeholder = "Add item..." }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [isRawMode, setIsRawMode] = useState(false);
  const parseValueToBullets = (val: string): string[] => {
    if (!val) return [""];
    const parsed = parseBullets(val);
    return parsed.length > 0 ? parsed : [""];
  };
  const [items, setItems] = useState<string[]>(() => parseValueToBullets(value));

  useEffect(() => {
    const parsed = parseValueToBullets(value);
    const currentMerged = items.filter((i) => i.trim()).join("\n");
    const newMerged = parsed.filter((i) => i.trim()).join("\n");
    if (currentMerged !== newMerged) {
      setItems(parsed);
    }
  }, [value]);

  const handleUpdateItem = (index: number, newText: string) => {
    const updated = [...items];
    updated[index] = newText;
    setItems(updated);
    const merged = updated.map((b) => b.trim()).filter((b) => b.length > 0).map((b) => `• ${b}`).join("\n");
    onChange(merged);
  };
  const handleAddItem = () => setItems((prev) => [...prev, ""]);
  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    const finalItems = updated.length > 0 ? updated : [""];
    setItems(finalItems);
    const merged = finalItems.map((b) => b.trim()).filter((b) => b.length > 0).map((b) => `• ${b}`).join("\n");
    onChange(merged);
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/60 p-4 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">{label}</label>
        <button type="button" onClick={() => setIsRawMode(!isRawMode)} className="text-[10px] text-zinc-400 hover:text-indigo-300 underline font-semibold">
          {isRawMode ? "Bullet Builder" : "Raw Text"}
        </button>
      </div>
      {isRawMode ? (
        <textarea
          rows={5}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setItems(parseValueToBullets(e.target.value));
          }}
          className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
        />
      ) : (
        <div className="space-y-2">
          {items.map((bullet, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <input
                type="text"
                value={bullet}
                placeholder={`${placeholder} #${idx + 1}`}
                onChange={(e) => handleUpdateItem(idx, e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button type="button" onClick={() => handleRemoveItem(idx)} className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-rose-400">
                <FiTrash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="w-full mt-2 py-2 rounded-lg border border-dashed border-indigo-500/40 bg-indigo-500/10 text-xs text-indigo-300 flex items-center justify-center gap-2">
            <FiPlus className="h-3 w-3" /> Add Item
          </button>
        </div>
      )}
    </div>
  );
}

export default function CMSProjectShowcasePage() {
  const {
    projects,
    modes,
    activeModeId,
    projectShowcaseCMS,
    updateProjectShowcaseCMS,
    addProjectShowcaseCMSItem,
    updateProjectShowcaseCMSItem,
    deleteProjectShowcaseCMSItem,
    reorderProjectShowcaseCMSItems,
    updateProjectModeContent,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    cmsItem?: ProjectShowcaseSectionCMSItemData;
    project: Project;
  } | null>(null);

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const psCMSItems = useMemo(() => {
    return [...(projectShowcaseCMS.items || [])].sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  }, [projectShowcaseCMS.items]);

  const filteredCMSItems = useMemo(() => {
    if (!searchQuery.trim()) return psCMSItems;
    const q = searchQuery.toLowerCase();
    return psCMSItems.filter((item) => {
      const proj = projects.find((p) => p.id === item.projectId);
      return (
        proj?.project_name.toLowerCase().includes(q) ||
        proj?.slug.toLowerCase().includes(q) ||
        proj?.project_tech.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [psCMSItems, projects, searchQuery]);

  const availableProjectsNotInCMS = useMemo(() => {
    const includedIds = new Set(psCMSItems.map((item) => item.projectId));
    return projects.filter((p) => !includedIds.has(p.id));
  }, [projects, psCMSItems]);

  const loadModeContentForForm = (proj: Project, modeId: string) => {
    const modeContent = proj.modeContents?.find((m) => m.portfolioModeId === modeId) || proj.modeContents?.[0];
    const uCount: number | "" = typeof modeContent?.project_user_count === "number" ? modeContent.project_user_count : "";
    const rev: number | "" = typeof modeContent?.project_revenue === "number" ? modeContent.project_revenue : "";

    return {
      modeTabId: modeId || activeModeId || modes[0]?.id || "",
      modeDescription: modeContent?.project_description || "",
      modeChallenge: modeContent?.challenge || "",
      modeSolution: modeContent?.solution || "",
      modeImpact: modeContent?.impact || "",
      modeHighlights: (modeContent?.project_highlights || []).join(", "),
      modeUserCount: uCount,
      modeRevenue: rev,
    };
  };

  const handleModeTabChange = (newModeId: string) => {
    if (!formState.projectId) {
      setFormState((prev) => ({ ...prev, modeTabId: newModeId }));
      return;
    }
    const proj = projects.find((p) => p.id === formState.projectId);
    if (!proj) return;
    const storyData = loadModeContentForForm(proj, newModeId);
    setFormState((prev) => ({ ...prev, ...storyData }));
  };

  const handleSelectProjectDropdown = (selectedId: string) => {
    if (!selectedId) {
      setFormState((prev) => ({ ...prev, projectId: "" }));
      return;
    }
    const currentModeId = formState.modeTabId || activeModeId || modes[0]?.id || "";
    const proj = projects.find((p) => p.id === selectedId);
    if (!proj) return;
    const storyData = loadModeContentForForm(proj, currentModeId);
    setFormState({
      projectId: proj.id,
      ...storyData,
      showDescription: true,
      showTechnologies: true,
      showViewAction: true,
    });
    toast.info(`Populated data for "${proj.project_name}"!`);
  };

  const openCreateModal = () => {
    const defaultMode = activeModeId || modes[0]?.id || "";
    setFormState({
      ...defaultFormState,
      modeTabId: defaultMode,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cmsItem: ProjectShowcaseSectionCMSItemData) => {
    const proj = projects.find((p) => p.id === cmsItem.projectId);
    if (!proj) {
      toast.error("Linked project data not found.");
      return;
    }
    const currentModeId = activeModeId || modes[0]?.id || "";
    const storyData = loadModeContentForForm(proj, currentModeId);
    setEditingItem({ cmsItem, project: proj });
    setFormState({
      projectId: proj.id,
      ...storyData,
      showDescription: cmsItem.showDescription ?? true,
      showTechnologies: cmsItem.showTechnologies ?? true,
      showViewAction: cmsItem.showViewAction ?? true,
    });
  };

  const handleSaveNewWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.projectId) {
      toast.error("Please select a project.");
      return;
    }
    const targetProjectId = formState.projectId;
    if (formState.modeTabId) {
      const modeHlList = formState.modeHighlights.split(",").map((h) => h.trim()).filter(Boolean);
      await updateProjectModeContent(targetProjectId, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count: formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue: formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
      });
    }
    await addProjectShowcaseCMSItem({
      projectId: targetProjectId,
      displayOrder: psCMSItems.length + 1,
      visible: true,
      showDescription: formState.showDescription,
      showTechnologies: formState.showTechnologies,
      showViewAction: formState.showViewAction,
    });
    toast.success("Added project to Showcase track!");
    setIsAddModalOpen(false);
    setFormState(defaultFormState);
  };

  const handleSaveEditWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (formState.modeTabId) {
      const modeHlList = formState.modeHighlights.split(",").map((h) => h.trim()).filter(Boolean);
      await updateProjectModeContent(editingItem.project.id, formState.modeTabId, {
        project_description: formState.modeDescription || null,
        challenge: formState.modeChallenge || null,
        solution: formState.modeSolution || null,
        impact: formState.modeImpact || null,
        project_highlights: modeHlList,
        project_user_count: formState.modeUserCount !== "" ? Number(formState.modeUserCount) : null,
        project_revenue: formState.modeRevenue !== "" ? Number(formState.modeRevenue) : null,
      });
    }
    if (editingItem.cmsItem) {
      await updateProjectShowcaseCMSItem(editingItem.cmsItem.id, {
        showDescription: formState.showDescription,
        showTechnologies: formState.showTechnologies,
        showViewAction: formState.showViewAction,
      });
    }
    toast.success(`Updated Case Study & CMS settings!`);
    setEditingItem(null);
    setFormState(defaultFormState);
  };

  const handleMovePSItem = async (index: number, direction: "up" | "down") => {
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
    await reorderProjectShowcaseCMSItems(reindexed);
    toast.success("Updated showcase track sequence!");
  };

  const selectedProjectObj = projects.find((p) => p.id === formState.projectId);

  return (
    <div className="space-y-6 pb-20 font-sans">
      <div className="border-b border-white/10 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            Admin Panel CMS
          </p>
          <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiSliders className="text-indigo-400 h-5 w-5" /> Project Showcase Track
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-2xl">
            Select projects for the horizontal GSAP track, and configure their Case Study persona-based storytelling content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
          >
            <FiPlus className="h-4 w-4" /> Add to Showcase Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-4 flex items-center justify-between shadow-[0_0_12px_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2.5 font-mono">
            <FiLayers className="text-zinc-400 h-4 w-4" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Section Status
            </span>
          </div>
          <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={projectShowcaseCMS.visible}
              onChange={(e) =>
                updateProjectShowcaseCMS({ visible: e.target.checked })
              }
              className="rounded border-white/20 bg-zinc-950 text-indigo-500 focus:ring-0 cursor-pointer"
            />
            {projectShowcaseCMS.visible ? (
              <span className="text-emerald-400 font-bold">Enabled</span>
            ) : (
              <span className="text-zinc-500">Disabled</span>
            )}
          </label>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-4 flex items-center gap-3">
          <FiSearch className="text-zinc-500 h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search showcase track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-zinc-500 hover:text-white"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between font-mono border-b border-white/10 pb-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
            <FiSettings className="text-indigo-400" /> Showcase Track Sequence ({filteredCMSItems.length})
          </h2>
        </div>

        {filteredCMSItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-3 font-mono">
            <p className="text-xs text-zinc-400">
              No projects in the showcase track.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
            >
              <FiPlus /> Add Project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCMSItems.map((cmsItem, index) => {
              const proj = projects.find((p) => p.id === cmsItem.projectId);
              if (!proj) return null;

              return (
                <div
                  key={cmsItem.id}
                  className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 transition-all flex items-center justify-between gap-3 font-mono"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                      Track #{cmsItem.displayOrder}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-zinc-100 block">{proj.project_name}</span>
                      <span className="text-[10px] text-zinc-500">/{proj.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMovePSItem(index, "up")}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      disabled={index === psCMSItems.length - 1}
                      onClick={() => handleMovePSItem(index, "down")}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      <FiArrowDown />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(cmsItem)}
                      className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
                    >
                      <FiEdit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProjectShowcaseCMSItem(cmsItem.id)}
                      className="p-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Form for Add/Edit */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-zinc-900/50">
              <h2 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
                <FiEdit3 className="text-indigo-400" />
                {isAddModalOpen ? "Add to Showcase Track" : `Edit Showcase: ${editingItem?.project?.project_name}`}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  setFormState(defaultFormState);
                }}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form
                id="showcase-form"
                onSubmit={isAddModalOpen ? handleSaveNewWork : handleSaveEditWork}
                className="space-y-8 font-mono"
              >
                {/* 1. Project Selection */}
                {isAddModalOpen && (
                  <div className="space-y-4 bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      1. Select Project
                    </label>
                    <select
                      value={formState.projectId}
                      onChange={(e) => handleSelectProjectDropdown(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    >
                      <option value="">-- Choose a project --</option>
                      {availableProjectsNotInCMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.project_name} ({p.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedProjectObj && (
                  <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-1">
                        Factual Project Overview (Read-Only)
                      </p>
                      <h3 className="text-sm text-zinc-100 font-bold">{selectedProjectObj.project_name}</h3>
                      <p className="text-xs text-zinc-400">{selectedProjectObj.slug} | {selectedProjectObj.project_status} | {selectedProjectObj.project_type} | {(selectedProjectObj.project_tech || []).join(", ")}</p>
                    </div>
                  </div>
                )}

                {/* 2. Persona Case Study Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      2. Persona Storytelling
                    </label>
                  </div>
                  
                  {/* Persona Tabs */}
                  {modes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-1 rounded-xl bg-zinc-900/50 border border-white/5 inline-flex">
                      {modes.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleModeTabChange(m.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            formState.modeTabId === m.id
                              ? "bg-indigo-500 text-white shadow-md"
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                          }`}
                        >
                          {m.mode_name}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 bg-zinc-900/20 p-5 rounded-2xl border border-white/5">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">Brief Description</label>
                      <textarea
                        value={formState.modeDescription}
                        onChange={(e) => setFormState({ ...formState, modeDescription: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">Challenge</label>
                        <textarea
                          value={formState.modeChallenge}
                          onChange={(e) => setFormState({ ...formState, modeChallenge: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">Solution</label>
                        <textarea
                          value={formState.modeSolution}
                          onChange={(e) => setFormState({ ...formState, modeSolution: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 min-h-[100px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">Impact</label>
                      <textarea
                        value={formState.modeImpact}
                        onChange={(e) => setFormState({ ...formState, modeImpact: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 min-h-[80px]"
                      />
                    </div>
                    
                    <BulletListInput
                      label="Key Highlights"
                      value={formState.modeHighlights}
                      onChange={(v) => setFormState({ ...formState, modeHighlights: v })}
                      placeholder="e.g. Achieved 99.9% uptime"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">User Count (Optional)</label>
                        <input
                          type="number"
                          value={formState.modeUserCount}
                          onChange={(e) => setFormState({ ...formState, modeUserCount: e.target.value ? Number(e.target.value) : "" })}
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-zinc-500 mb-1.5">Revenue (Optional)</label>
                        <input
                          type="number"
                          value={formState.modeRevenue}
                          onChange={(e) => setFormState({ ...formState, modeRevenue: e.target.value ? Number(e.target.value) : "" })}
                          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Display Settings */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3. Showcase Display Settings
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-zinc-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.showDescription}
                        onChange={(e) => setFormState({ ...formState, showDescription: e.target.checked })}
                        className="rounded border-white/20 bg-zinc-950 text-indigo-500 focus:ring-0"
                      />
                      <span className="text-xs text-zinc-300">Show Description</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-zinc-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.showTechnologies}
                        onChange={(e) => setFormState({ ...formState, showTechnologies: e.target.checked })}
                        className="rounded border-white/20 bg-zinc-950 text-indigo-500 focus:ring-0"
                      />
                      <span className="text-xs text-zinc-300">Show Technologies</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-zinc-900/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.showViewAction}
                        onChange={(e) => setFormState({ ...formState, showViewAction: e.target.checked })}
                        className="rounded border-white/20 bg-zinc-950 text-indigo-500 focus:ring-0"
                      />
                      <span className="text-xs text-zinc-300">Show View Action</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/10 bg-zinc-900/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                  setFormState(defaultFormState);
                }}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/5 font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="showcase-form"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <FiCheck /> {isAddModalOpen ? "Save to Showcase" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

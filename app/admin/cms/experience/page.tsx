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
  FiPlus,
  FiExternalLink,
  FiBook,
  FiLayers,
} from "react-icons/fi";
import { Experience, ExperienceSectionCMSItemData } from "../../_components/types";

interface FormState {
  experienceId: string;
  role_title: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  // Storytelling per persona
  modeTabId: string;
  expDescription: string;
  expHighlights: string;
  // CMS Toggles
  isFeatured: boolean;
  showYear: boolean;
  showRole: boolean;
  showCompany: boolean;
  showDescription: boolean;
  showTechnologies: boolean;
  showAchievements: boolean;
  showMetrics: boolean;
}

const defaultFormState: FormState = {
  experienceId: "",
  role_title: "",
  company_name: "",
  location: "",
  start_date: "",
  end_date: "",
  modeTabId: "",
  expDescription: "",
  expHighlights: "",
  isFeatured: false,
  showYear: true,
  showRole: true,
  showCompany: true,
  showDescription: true,
  showTechnologies: true,
  showAchievements: true,
  showMetrics: true,
};

export default function CMSExperiencePage() {
  const {
    experiences,
    modes,
    activeModeId,
    experienceCMS,
    updateExperienceCMS,
    addExperienceCMSItem,
    updateExperienceCMSItem,
    deleteExperienceCMSItem,
    reorderExperienceCMSItems,
    addExperience,
    updateExperienceModeContent,
  } = useAdminStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    cmsItem?: ExperienceSectionCMSItemData;
    experience: Experience;
  } | null>(null);

  const [formState, setFormState] = useState<FormState>(defaultFormState);

  const cmsItems = [...(experienceCMS.items || [])].sort((a, b) => a.displayOrder - b.displayOrder);

  // Helper to load mode storytelling content for a given experience & mode ID
  const loadModeContent = (exp: Experience, modeId: string) => {
    const mc = exp.modeContents?.find((c) => c.portfolioModeId === modeId) || exp.modeContents?.[0];
    return {
      expDescription: mc?.experience_description || "",
      expHighlights: (mc?.experience_highlights || []).join(", "),
    };
  };

  // Switch mode tab inside modal
  const handleModeTabChange = (newModeId: string) => {
    setFormState((prev) => {
      if (!prev.experienceId || prev.experienceId === "__other__") {
        return { ...prev, modeTabId: newModeId };
      }
      const exp = experiences.find((e) => e.id === prev.experienceId);
      if (!exp) return { ...prev, modeTabId: newModeId };
      const story = loadModeContent(exp, newModeId);
      return {
        ...prev,
        modeTabId: newModeId,
        ...story,
      };
    });
  };

  // Dropdown selector handler
  const handleSelectExperienceDropdown = (selectedId: string) => {
    const currentMode = formState.modeTabId || activeModeId || modes[0]?.id || "";

    if (!selectedId) {
      setFormState({
        ...defaultFormState,
        modeTabId: currentMode,
      });
      return;
    }

    if (selectedId === "__other__") {
      setFormState({
        ...defaultFormState,
        experienceId: "__other__",
        modeTabId: currentMode,
      });
      return;
    }

    const exp = experiences.find((e) => e.id === selectedId);
    if (!exp) return;

    const story = loadModeContent(exp, currentMode);
    setFormState({
      ...defaultFormState,
      experienceId: exp.id,
      role_title: exp.role_title,
      company_name: exp.company_name,
      location: exp.location || "",
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
      modeTabId: currentMode,
      ...story,
    });
  };

  // Open Add Modal
  const openAddModal = () => {
    const defaultMode = activeModeId || modes[0]?.id || "";
    setFormState({
      ...defaultFormState,
      modeTabId: defaultMode,
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal for a CMS milestone
  const openEditModal = (cmsItem: ExperienceSectionCMSItemData) => {
    const exp = experiences.find((e) => e.id === cmsItem.experienceId);
    if (!exp) {
      toast.error("Linked experience record not found.");
      return;
    }
    const currentMode = activeModeId || modes[0]?.id || "";
    const story = loadModeContent(exp, currentMode);

    setEditingItem({ cmsItem, experience: exp });
    setFormState({
      experienceId: exp.id,
      role_title: exp.role_title,
      company_name: exp.company_name,
      location: exp.location || "",
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
      modeTabId: currentMode,
      ...story,
      isFeatured: cmsItem.isFeatured ?? false,
      showYear: cmsItem.showYear ?? true,
      showRole: cmsItem.showRole ?? true,
      showCompany: cmsItem.showCompany ?? true,
      showDescription: cmsItem.showDescription ?? true,
      showTechnologies: cmsItem.showTechnologies ?? true,
      showAchievements: cmsItem.showAchievements ?? true,
      showMetrics: cmsItem.showMetrics ?? true,
    });
  };

  // Submit Add Form
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetExpId = formState.experienceId;

    if (!targetExpId) {
      toast.error("Please select an experience or choose 'Other / Custom Milestone'.");
      return;
    }

    // If Custom / Other selected, create new experience record first
    if (targetExpId === "__other__") {
      if (!formState.role_title.trim()) {
        toast.error("Role Title is required for custom experience.");
        return;
      }
      const compName = formState.company_name.trim();
      const newId = `exp-${Date.now()}`;
      targetExpId = newId;
      addExperience({
        company_name: compName || "Freelance",
        role_title: formState.role_title.trim(),
        employment_type: compName ? "FULL_TIME" : "FREELANCE",
        location: formState.location || null,
        start_date: formState.start_date || new Date().toISOString().slice(0, 7),
        end_date: formState.end_date || null,
        currently_working: !formState.end_date,
      });
    }

    // Save persona storytelling if mode selected
    if (targetExpId && formState.modeTabId) {
      const hlList = formState.expHighlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      updateExperienceModeContent(targetExpId, formState.modeTabId, {
        experience_description: formState.expDescription || null,
        experience_highlights: hlList,
      });
    }

    // Add to CMS display list
    addExperienceCMSItem({
      experienceId: targetExpId,
      displayOrder: cmsItems.length + 1,
      visible: true,
      isFeatured: formState.isFeatured,
      showYear: formState.showYear,
      showRole: formState.showRole,
      showCompany: formState.showCompany,
      showDescription: formState.showDescription,
      showTechnologies: formState.showTechnologies,
      showAchievements: formState.showAchievements,
      showMetrics: formState.showMetrics,
    });

    toast.success("Added milestone experience to CMS!");
    setIsAddModalOpen(false);
    setFormState(defaultFormState);
  };

  // Submit Edit Form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Save persona storytelling
    if (formState.modeTabId) {
      const hlList = formState.expHighlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      updateExperienceModeContent(editingItem.experience.id, formState.modeTabId, {
        experience_description: formState.expDescription || null,
        experience_highlights: hlList,
      });
    }

    // Update CMS item settings if present
    if (editingItem.cmsItem) {
      updateExperienceCMSItem(editingItem.cmsItem.id, {
        isFeatured: formState.isFeatured,
        showYear: formState.showYear,
        showRole: formState.showRole,
        showCompany: formState.showCompany,
        showDescription: formState.showDescription,
        showTechnologies: formState.showTechnologies,
        showAchievements: formState.showAchievements,
        showMetrics: formState.showMetrics,
      });
    }

    toast.success(`Updated storytelling & CMS options for "${editingItem.experience.role_title}"!`);
    setEditingItem(null);
    setFormState(defaultFormState);
  };

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

  return (
    <div className="space-y-6 pb-16 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase font-semibold">
            Experience CMS
          </p>
          <h1 className="text-xl font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiBriefcase className="text-zinc-300 h-5 w-5" /> Experience Journey Composition
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">
            Manage milestone display sequence, field visibility toggles, and persona storytelling.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-semibold shadow-sm transition-all"
        >
          <FiPlus className="h-4 w-4" /> Add Milestone to CMS
        </button>
      </div>

      {/* Overview & Settings Box */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-5 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          <FiInfo className="h-4 w-4 text-zinc-400" />
          <span>Section CMS Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1 border-t border-white/10">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1">
              Default Initial Active Milestone
            </label>
            <select
              value={experienceCMS.defaultActiveId || ""}
              onChange={(e) => updateExperienceCMS({ defaultActiveId: e.target.value || null })}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-white/30 focus:outline-none"
            >
              <option value="">Top Ordered Item (Automatic)</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.role_title} @ {exp.company_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={experienceCMS.visible}
                onChange={(e) => updateExperienceCMS({ visible: e.target.checked })}
                className="rounded border-white/20 bg-zinc-950 text-white focus:ring-0"
              />
              Section Active on Website
            </label>
          </div>
        </div>
      </div>

      {/* Displayed Milestones List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
          <FiSettings className="text-zinc-300" /> Displayed Journey Milestones ({cmsItems.length})
        </h2>

        <div className="space-y-3">
          {cmsItems.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-4 text-center">
              No milestones added to CMS yet. Click "Add Milestone to CMS" above to pick an experience.
            </p>
          ) : (
            cmsItems.map((cmsItem, itemIndex) => {
              const exp = experiences.find((e) => e.id === cmsItem.experienceId);
              if (!exp) return null;

              return (
                <div
                  key={cmsItem.id}
                  className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-3 hover:border-white/25 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-zinc-100">
                        {exp.role_title} <span className="text-zinc-400 font-normal">@ {exp.company_name}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 ml-2 font-sans">
                        ({exp.location || "Location N/A"})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                        #{cmsItem.displayOrder}
                      </span>

                      <button
                        type="button"
                        disabled={itemIndex === 0}
                        onClick={() => handleMoveCMSItem(itemIndex, "up")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        type="button"
                        disabled={itemIndex === cmsItems.length - 1}
                        onClick={() => handleMoveCMSItem(itemIndex, "down")}
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <FiArrowDown />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(cmsItem)}
                        className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
                        title="Edit Storytelling & Toggles"
                      >
                        <FiEdit3 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteExperienceCMSItem(cmsItem.id);
                          toast.success("Removed milestone from CMS sequence!");
                        }}
                        className="p-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Remove from CMS"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Field Toggles */}
                  <div className="border-t border-white/10 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showDescription}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showDescription: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Story Description
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsItem.showTechnologies}
                        onChange={(e) => updateExperienceCMSItem(cmsItem.id, { showTechnologies: e.target.checked })}
                        className="rounded border-white/20 text-white focus:ring-0"
                      />
                      Tech Badges
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
                      Metrics
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD MILESTONE MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-mono">
          <form
            onSubmit={handleSaveAdd}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <FiPlus className="text-indigo-400" /> Add Milestone to Experience CMS
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Dropdown Selector */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Select Experience Milestone
                </label>
                <select
                  value={formState.experienceId}
                  onChange={(e) => handleSelectExperienceDropdown(e.target.value)}
                  className="w-full rounded-xl border border-indigo-500/30 bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-400"
                >
                  <option value="">-- Choose Existing Master Experience --</option>
                  {experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.role_title} @ {exp.company_name}
                    </option>
                  ))}
                  <option value="__other__">+ Other / Custom Experience Entry</option>
                </select>
              </div>

              {/* Factual Summary Card or Custom Input Fields */}
              {formState.experienceId && formState.experienceId !== "__other__" ? (
                (() => {
                  const selExp = experiences.find((e) => e.id === formState.experienceId);
                  if (!selExp) return null;
                  return (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <FiInfo className="h-3.5 w-3.5" /> Factual Role Details
                        </span>
                        <a
                          href="/admin/experience"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          Edit Master Facts in /admin/experience <FiExternalLink />
                        </a>
                      </div>
                      <div className="text-xs text-zinc-200 font-bold">
                        {selExp.role_title} @ {selExp.company_name}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Location: {selExp.location || "N/A"} | Type: {selExp.employment_type}
                      </div>
                    </div>
                  );
                })()
              ) : formState.experienceId === "__other__" ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <span className="block text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-white/10 pb-2">
                    Describe Custom Role Details
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">Role Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Engineer"
                        value={formState.role_title}
                        onChange={(e) => setFormState({ ...formState, role_title: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-zinc-400 mb-1">Company / Client Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Optional (leave blank for Freelance)"
                        value={formState.company_name}
                        onChange={(e) => setFormState({ ...formState, company_name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>
              ) : null}

              {/* Persona Storytelling Section */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-4">
                <span className="block text-xs font-bold uppercase text-indigo-300 tracking-wider border-b border-indigo-500/20 pb-2 flex items-center gap-1.5">
                  <FiBook className="h-4 w-4" /> Persona Storytelling Details (`ExperienceModeContent`)
                </span>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
                    Select Persona Mode:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleModeTabChange(mode.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          formState.modeTabId === mode.id
                            ? "bg-indigo-600 text-white border border-indigo-400"
                            : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {mode.mode_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-300 mb-1">
                    Persona Story Description / Bio Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe key responsibilities and impact for this persona..."
                    value={formState.expDescription}
                    onChange={(e) => setFormState({ ...formState, expDescription: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-300 mb-1">
                    Key Highlights (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Scaled infrastructure to 1M users, Reduced cloud cost by 30%"
                    value={formState.expHighlights}
                    onChange={(e) => setFormState({ ...formState, expHighlights: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold flex items-center gap-1.5"
              >
                <FiCheck /> Add to CMS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MILESTONE MODAL */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-mono">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-2xl rounded-2xl border border-white/20 bg-zinc-950 p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <FiEdit3 className="text-indigo-400" /> Edit Milestone Story & Toggles: {editingItem.experience.role_title} @ {editingItem.experience.company_name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Factual Read-Only Card */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FiInfo className="h-3.5 w-3.5" /> Factual Role Details
                  </span>
                  <a
                    href="/admin/experience"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    Edit Master Facts in /admin/experience <FiExternalLink />
                  </a>
                </div>
                <div className="text-xs text-zinc-200 font-bold">
                  {editingItem.experience.role_title} @ {editingItem.experience.company_name}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Location: {editingItem.experience.location || "N/A"} | Dates: {editingItem.experience.start_date ? editingItem.experience.start_date.slice(0, 7) : "N/A"} - {editingItem.experience.currently_working ? "Present" : editingItem.experience.end_date ? editingItem.experience.end_date.slice(0, 7) : "N/A"}
                </div>
              </div>

              {/* Persona Storytelling Section */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-4">
                <span className="block text-xs font-bold uppercase text-indigo-300 tracking-wider border-b border-indigo-500/20 pb-2 flex items-center gap-1.5">
                  <FiBook className="h-4 w-4" /> Persona Storytelling (`ExperienceModeContent`)
                </span>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
                    Switch Persona Mode:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleModeTabChange(mode.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          formState.modeTabId === mode.id
                            ? "bg-indigo-600 text-white border border-indigo-400"
                            : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {mode.mode_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-300 mb-1">
                    Persona Story Description / Bio Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe key responsibilities and impact for this persona..."
                    value={formState.expDescription}
                    onChange={(e) => setFormState({ ...formState, expDescription: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-300 mb-1">
                    Key Highlights (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Scaled infrastructure to 1M users, Reduced cloud cost by 30%"
                    value={formState.expHighlights}
                    onChange={(e) => setFormState({ ...formState, expHighlights: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold flex items-center gap-1.5"
              >
                <FiCheck /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

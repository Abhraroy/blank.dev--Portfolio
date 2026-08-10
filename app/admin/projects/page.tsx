"use client";

import React, { useState } from "react";
import { useAdminStore } from "../_components/store";
import {
  Project,
  ProjectStatus,
  ProjectType,
  ProjectVisibilityStatus,
} from "../_components/types";
import { ArrayInput } from "../_components/ArrayInput";
import {
  FiFolder,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiGithub,
  FiX,
  FiLayers,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";

const statusOptions: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
];

const typeOptions: ProjectType[] = [
  "PERSONAL",
  "PROFESSIONAL",
  "OPEN_SOURCE",
  "CLIENT_WORK",
  "SIDE_PROJECT",
];

const visibilityOptions: ProjectVisibilityStatus[] = [
  "PUBLIC",
  "PRIVATE",
  "UNLISTED",
  "DRAFT",
];

export default function ProjectsFactsPage() {
  const {
    projects,
    modes,
    activeModeId,
    projectHighlights,
    addProject,
    updateProject,
    deleteProject,
    updateProjectModeContent,
    addProjectHighlight,
    deleteProjectHighlight,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [projectName, setProjectName] = useState("");
  const [slug, setSlug] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectTags, setProjectTags] = useState<string[]>([]);
  const [projectTech, setProjectTech] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("ACTIVE");
  const [projectType, setProjectType] = useState<ProjectType>("PERSONAL");
  const [projectVisibility, setProjectVisibility] = useState<ProjectVisibilityStatus>("PUBLIC");

  // Per Mode Content form states
  const [modeTabId, setModeTabId] = useState<string>(activeModeId);
  const [modeDescription, setModeDescription] = useState("");
  const [modeHighlights, setModeHighlights] = useState<string[]>([]);
  const [modeUserCount, setModeUserCount] = useState<number | "">("");
  const [modeRevenue, setModeRevenue] = useState<number | "">("");

  // Highlight Box state per project
  const [newHlProjectId, setNewHlProjectId] = useState<string>("");
  const [newHlContent, setNewHlContent] = useState("");

  const openCreateModal = () => {
    setEditingProject(null);
    setProjectName("");
    setSlug("");
    setProjectImage("");
    setProjectUrl("");
    setProjectGithub("");
    setProjectTags(["Full-Stack", "Web3"]);
    setProjectTech(["Next.js", "TypeScript", "Tailwind CSS"]);
    setProjectStatus("ACTIVE");
    setProjectType("PERSONAL");
    setProjectVisibility("PUBLIC");

    setModeTabId(activeModeId);
    setModeDescription("");
    setModeHighlights([]);
    setModeUserCount("");
    setModeRevenue("");

    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.project_name);
    setSlug(project.slug);
    setProjectImage(project.project_image || "");
    setProjectUrl(project.project_url || "");
    setProjectGithub(project.project_github || "");
    setProjectTags(project.project_tags || []);
    setProjectTech(project.project_tech || []);
    setProjectStatus(project.project_status);
    setProjectType(project.project_type);
    setProjectVisibility(project.project_visibility_status);

    const activeMc = project.modeContents?.find(
      (c) => c.portfolioModeId === activeModeId
    );
    setModeTabId(activeModeId);
    setModeDescription(activeMc?.project_description || "");
    setModeHighlights(activeMc?.project_highlights || []);
    setModeUserCount(activeMc?.project_user_count ?? "");
    setModeRevenue(activeMc?.project_revenue ?? "");

    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const computedSlug =
      slug.trim() ||
      projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    let targetProjectId = editingProject?.id;

    if (editingProject) {
      updateProject(editingProject.id, {
        project_name: projectName.trim(),
        slug: computedSlug,
        project_image: projectImage || null,
        project_url: projectUrl || null,
        project_github: projectGithub || null,
        project_tags: projectTags,
        project_tech: projectTech,
        project_status: projectStatus,
        project_type: projectType,
        project_visibility_status: projectVisibility,
      });
    } else {
      const newProjId = `proj-${Date.now()}`;
      targetProjectId = newProjId;
      addProject({
        project_name: projectName.trim(),
        slug: computedSlug,
        project_image: projectImage || null,
        project_url: projectUrl || null,
        project_github: projectGithub || null,
        project_tags: projectTags,
        project_tech: projectTech,
        project_status: projectStatus,
        project_type: projectType,
        project_visibility_status: projectVisibility,
      });
    }

    if (targetProjectId) {
      updateProjectModeContent(targetProjectId, modeTabId, {
        project_description: modeDescription || null,
        project_highlights: modeHighlights,
        project_user_count: modeUserCount !== "" ? Number(modeUserCount) : null,
        project_revenue: modeRevenue !== "" ? Number(modeRevenue) : null,
      });
    }

    setIsModalOpen(false);
  };

  const handleAddHighlight = (projId: string) => {
    if (!newHlContent.trim()) return;
    const existing = projectHighlights.filter((h) => h.projectId === projId);
    addProjectHighlight({
      projectId: projId,
      content: newHlContent.trim().toUpperCase(),
      order: existing.length + 1,
      visible: true,
    });
    setNewHlContent("");
    setNewHlProjectId("");
  };

  const filteredProjects = projects.filter((p) => {
    const matchesQuery =
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || p.project_status === statusFilter;
    const matchesType = typeFilter === "ALL" || p.project_type === typeFilter;
    return matchesQuery && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            Domain Facts
          </p>
          <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiFolder className="text-zinc-300 h-5 w-5" /> Factual Projects Pool
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Manage project facts (`Project`), feature badges (`ProjectHighlight`), and per-mode storytelling (`ProjectModeContent`).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 font-mono text-xs font-semibold shadow-sm transition-all"
        >
          <FiPlus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-950/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <div className="relative w-full md:w-80 font-mono">
          <FiSearch className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, slugs, or tech..."
            className="w-full rounded-xl border border-white/10 bg-zinc-950 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <FiFilter className="h-3.5 w-3.5 text-zinc-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              {typeOptions.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const activeMc = project.modeContents?.find(
            (c) => c.portfolioModeId === activeModeId
          );
          const highlights = projectHighlights.filter((h) => h.projectId === project.id);

          return (
            <div
              key={project.id}
              className="group relative rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-[0_0_12px_rgba(255,255,255,0.06)] space-y-4 font-mono"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-50">{project.project_name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10">
                        /{project.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-zinc-300 border border-white/10">
                        {project.project_status}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/5 text-zinc-400 border border-white/10">
                        {project.project_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                      title="Edit Project"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tech & Badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.project_tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Factual Feature/Highlight Badges (`ProjectHighlight`) */}
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                    Feature Badges (`ProjectHighlight`: REVENUE PLATFORM, META CAPI)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {highlights.map((h) => (
                      <span
                        key={h.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-zinc-200"
                      >
                        {h.content}
                        <button
                          onClick={() => deleteProjectHighlight(h.id)}
                          className="text-zinc-500 hover:text-rose-400 ml-1"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Highlight */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="e.g. ADVANCED SEARCH"
                      value={newHlProjectId === project.id ? newHlContent : ""}
                      onChange={(e) => {
                        setNewHlProjectId(project.id);
                        setNewHlContent(e.target.value);
                      }}
                      className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddHighlight(project.id)}
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-medium"
                    >
                      <FiPlus /> Add Badge
                    </button>
                  </div>
                </div>

                {/* Storytelling box for active persona mode */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold">
                      <FiLayers className="h-3 w-3 text-zinc-300" /> Mode Storytelling (
                      {modes.find((m) => m.id === activeModeId)?.mode_name})
                    </span>
                    {activeMc && (
                      <span className="text-emerald-400">Customized</span>
                    )}
                  </div>
                  {activeMc ? (
                    <div className="space-y-1.5 text-xs font-sans">
                      <p className="text-zinc-300 line-clamp-2">
                        {activeMc.project_description || "No description for this mode."}
                      </p>
                      {(activeMc.project_user_count !== null ||
                        activeMc.project_revenue !== null) && (
                        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
                          {activeMc.project_user_count !== null && (
                            <span className="flex items-center gap-1">
                              <FiUsers className="text-zinc-300 h-3 w-3" />
                              {activeMc.project_user_count} Users
                            </span>
                          )}
                          {activeMc.project_revenue !== null && (
                            <span className="flex items-center gap-1">
                              <FiDollarSign className="text-zinc-300 h-3 w-3" />$
                              {activeMc.project_revenue} ARR
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic font-sans">
                      No custom storytelling set for active mode. Using default facts.
                    </p>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <FiExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                  {project.project_github && (
                    <a
                      href={project.project_github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <FiGithub className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form for Project Facts */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto font-mono">
          <form
            onSubmit={handleSave}
            className="w-full max-w-3xl rounded-2xl border border-white/20 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-zinc-50 flex items-center gap-2">
                <FiFolder className="text-zinc-300" />
                {editingProject ? "Edit Project Data" : "Create New Project"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold border-b border-white/5 pb-1">
                Project Facts (`Project`)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. BlankDev Engine"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase text-zinc-400">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="blankdev-engine"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <ArrayInput
                label="Tech Stack (`project_tech`)"
                placeholder="Add technology e.g. Next.js, Rust..."
                items={projectTech}
                onChange={setProjectTech}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-mono font-semibold shadow-sm"
              >
                Save Project Data
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

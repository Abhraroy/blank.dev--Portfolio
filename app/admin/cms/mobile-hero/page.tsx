"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "../../_components/store";
import { toast } from "react-toastify";
import {
  FiSmartphone,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiArrowUp,
  FiArrowDown,
  FiType,
  FiInfo,
} from "react-icons/fi";

export default function CMSMobileHeroPage() {
  const {
    mobileHeroSkills,
    addMobileHeroSkill,
    updateMobileHeroSkill,
    deleteMobileHeroSkill,
    reorderMobileHeroSkills,
    fetchInitialData,
  } = useAdminStore();

  const [newSkillText, setNewSkillText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const sortedSkills = [...mobileHeroSkills].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;

    setIsSubmitting(true);
    await addMobileHeroSkill({
      text: newSkillText.trim(),
      displayOrder: sortedSkills.length,
      visible: true,
    });
    toast.success(`Added mobile hero skill "${newSkillText.trim()}"!`);
    setNewSkillText("");
    setIsSubmitting(false);
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateMobileHeroSkill(id, { text: editingText.trim() });
    toast.success("Updated mobile hero skill!");
    setEditingId(null);
    setEditingText("");
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sortedSkills.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...sortedSkills];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((item, idx) => ({
      ...item,
      displayOrder: idx,
    }));

    await reorderMobileHeroSkills(updated);
    toast.success("Reordered mobile hero skills!");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
          CMS Control Layer
        </p>
        <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
          <FiSmartphone className="text-zinc-300 h-5 w-5" /> Mobile View Hero Skills CMS
        </h1>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Manage typewriter skill strings displayed after &quot;I build with &quot; in the mobile hero view. Each record represents a skill string in the database.
        </p>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-4 flex items-center gap-3 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <FiInfo className="h-5 w-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-zinc-300 font-mono leading-relaxed">
          Active skills will loop sequentially in the typewriter component on devices below tablet breakpoint (`768px`).
        </p>
      </div>

      {/* Add New Skill String Form */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <h3 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
          <FiPlus className="text-emerald-400 h-4 w-4" /> Add Skill Record String
        </h3>
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FiType className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="e.g. Next.js, React Native, Rust..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newSkillText.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-semibold hover:bg-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <FiPlus className="h-4 w-4" /> Save Skill Record
          </button>
        </form>
      </div>

      {/* Skills String Table List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-4 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-mono font-bold text-zinc-100">
            Mobile Skill Records ({sortedSkills.length})
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            {sortedSkills.filter((s) => s.visible).length} visible in typewriter
          </span>
        </div>

        {sortedSkills.length === 0 ? (
          <div className="text-center py-10 text-xs font-mono text-zinc-500">
            No skill records found. Add your first skill record above.
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSkills.map((skill, index) => {
              const isEditing = editingId === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                    skill.visible
                      ? "border-white/10 bg-white/5"
                      : "border-white/5 bg-white/[0.02] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="font-mono text-xs text-zinc-500 w-6 shrink-0 text-center">
                      #{index + 1}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 rounded-lg border border-white/20 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-white/30"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(skill.id)}
                          className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          title="Save change"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                          title="Cancel edit"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-sm font-semibold text-zinc-100 truncate">
                          {skill.text}
                        </span>
                        {!skill.visible && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                            Hidden
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
                        title="Move Up"
                      >
                        <FiArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === sortedSkills.length - 1}
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
                        title="Move Down"
                      >
                        <FiArrowDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => {
                          updateMobileHeroSkill(skill.id, {
                            visible: !skill.visible,
                          });
                          toast.success(skill.visible ? "Hidden skill from typewriter" : "Showed skill in typewriter");
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          skill.visible
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                            : "border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-300"
                        }`}
                        title={skill.visible ? "Hide from typewriter" : "Show in typewriter"}
                      >
                        {skill.visible ? (
                          <FiEye className="h-3.5 w-3.5" />
                        ) : (
                          <FiEyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(skill.id, skill.text)}
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all"
                        title="Edit Skill String"
                      >
                        <FiEdit3 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          deleteMobileHeroSkill(skill.id);
                          toast.success(`Deleted skill "${skill.text}"`);
                        }}
                        className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete Skill Record"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

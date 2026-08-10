"use client";

import React, { useState } from "react";
import { useAdminStore } from "../../_components/store";
import {
  PortfolioBlockData,
  PortfolioBlockType,
  PortfolioBlockItemType,
  PortfolioBlockItemData,
} from "../../_components/types";
import {
  FiLayout,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiArrowUp,
  FiArrowDown,
  FiSave,
  FiCheck,
  FiImage,
  FiLink,
  FiList,
  FiLayers,
  FiFilter,
} from "react-icons/fi";

const BLOCK_TYPES: PortfolioBlockType[] = [
  "HERO",
  "CARD",
  "PROFILE",
  "TEXT",
  "LIST",
  "MEDIA",
  "CTA",
];

export default function AdminAboutCMSPage() {
  const {
    sections,
    modes,
    activeModeId,
    setActiveModeId,
    updateBlock,
    addBlock,
    deleteBlock,
    reorderBlocks,
    addBlockItem,
    updateBlockItem,
    deleteBlockItem,
  } = useAdminStore();

  const sectionKey = "ABOUT";
  const aboutSection = sections.find((s) => s.key === sectionKey);
  const allBlocks = aboutSection
    ? [...aboutSection.blocks].sort((a, b) => a.blockNumber - b.blockNumber)
    : [];

  const [toast, setToast] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<string | "ALL">("ACTIVE_PERSONA");

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  const displayedBlocks = allBlocks.filter((b) => {
    if (filterMode === "ALL") return true;
    if (filterMode === "ACTIVE_PERSONA") {
      return !b.portfolioModeId || b.portfolioModeId === activeModeId;
    }
    return b.portfolioModeId === filterMode;
  });

  const [newBlockType, setNewBlockType] = useState<PortfolioBlockType>("CARD");
  const [newBlockLabel, setNewBlockLabel] = useState("");
  const [newBlockHeading, setNewBlockHeading] = useState("");
  const [newBlockPersona, setNewBlockPersona] = useState<string>("GLOBAL");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCreateBlock = () => {
    const maxBlockNum = allBlocks.reduce(
      (max, b) => Math.max(max, b.blockNumber),
      0
    );
    const nextBlockNum = maxBlockNum + 1;

    addBlock(sectionKey, {
      blockNumber: nextBlockNum,
      type: newBlockType,
      portfolioModeId: newBlockPersona === "GLOBAL" ? null : newBlockPersona,
      visible: true,
      label: newBlockLabel || `BLOCK ${nextBlockNum}`,
      heading: newBlockHeading || "New Heading",
      subheading: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
      ctaText: "",
      ctaUrl: "",
      ctaType: "LINK",
      ctaVisible: false,
      items: [],
    });

    setNewBlockLabel("");
    setNewBlockHeading("");
    showToast(`Created Block ${nextBlockNum}`);
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === displayedBlocks.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...displayedBlocks];

    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((b, idx) => ({
      ...b,
      blockNumber: idx + 1,
    }));

    reorderBlocks(sectionKey, reindexed);
    showToast("Reordered blocks");
  };

  return (
    <div className="space-y-8 pb-16 min-h-screen">
      {/* Top Banner Header & Persona Switcher */}
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              About Me CMS
            </p>
            <h1 className="text-xl font-mono font-bold text-zinc-50 flex items-center gap-2 mt-1">
              <FiLayout className="text-zinc-300 h-5 w-5" /> Visual Content Blocks (`PortfolioSection: ABOUT`)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage dynamic visual blocks, spatial positioning (`blockNumber`), items, CTAs, and persona-specific bio content.
            </p>
          </div>

          {toast && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl shrink-0">
              <FiCheck /> {toast}
            </span>
          )}
        </div>

        {/* Persona Mode Toggle View */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-4 space-y-3 shadow-[0_0_12px_rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              <FiLayers className="text-zinc-400 h-4 w-4" />
              <span>Persona View Control</span>
              <span className="text-[10px] bg-white/10 text-zinc-200 px-2.5 py-0.5 rounded-full font-normal border border-white/10">
                Active: {activeMode?.mode_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <FiFilter className="text-zinc-400 h-3.5 w-3.5" />
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="bg-zinc-950 border border-white/10 text-zinc-200 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-white/30"
              >
                <option value="ACTIVE_PERSONA">View Active Persona + Global</option>
                <option value="ALL">Show All Blocks (Unfiltered)</option>
                {modes.map((m) => (
                  <option key={m.id} value={m.id}>
                    Only {m.mode_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-800 max-w-full">
            {modes.map((mode) => {
              const isSelected = mode.id === activeModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveModeId(mode.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-white/15 text-zinc-50 border-white/30 shadow-sm font-semibold"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSelected ? "bg-white animate-pulse" : "bg-zinc-600"
                    }`}
                  />
                  <span>{mode.mode_name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Add Block Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
          <FiPlus className="text-indigo-400" /> Create New Visual Content Block
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-mono text-zinc-500 mb-1">Structural Type</label>
            <select
              value={newBlockType}
              onChange={(e) => setNewBlockType(e.target.value as PortfolioBlockType)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              {BLOCK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-500 mb-1">Target Persona</label>
            <select
              value={newBlockPersona}
              onChange={(e) => setNewBlockPersona(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="GLOBAL">Global (All Personas)</option>
              {modes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.mode_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-500 mb-1">Label (Eyebrow)</label>
            <input
              type="text"
              placeholder="e.g. FOCUS"
              value={newBlockLabel}
              onChange={(e) => setNewBlockLabel(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-500 mb-1">Heading</label>
            <input
              type="text"
              placeholder="e.g. AI Systems"
              value={newBlockHeading}
              onChange={(e) => setNewBlockHeading(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <button
              onClick={handleCreateBlock}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <FiPlus /> Add Block
            </button>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-6">
        {displayedBlocks.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
            <p className="text-sm">No blocks found for this persona selection.</p>
            <p className="text-xs">Create a new block above or change the persona view filter.</p>
          </div>
        ) : (
          displayedBlocks.map((block, idx) => (
            <BlockEditorCard
              key={block.id}
              block={block}
              index={idx}
              totalBlocks={displayedBlocks.length}
              modes={modes}
              sectionKey={sectionKey}
              isEditing={editingBlockId === block.id}
              onToggleEdit={() =>
                setEditingBlockId(editingBlockId === block.id ? null : block.id)
              }
              onMoveUp={() => handleMoveBlock(idx, "up")}
              onMoveDown={() => handleMoveBlock(idx, "down")}
              onDelete={() => {
                if (confirm(`Delete Block ${block.blockNumber}?`)) {
                  deleteBlock(sectionKey, block.id);
                  showToast(`Deleted Block ${block.blockNumber}`);
                }
              }}
              onUpdate={(data) => {
                updateBlock(sectionKey, block.id, data);
                showToast(`Saved Block ${block.blockNumber}`);
              }}
              onAddItem={(item) => {
                addBlockItem(sectionKey, block.id, item);
                showToast("Added item");
              }}
              onUpdateItem={(itemId, item) => {
                updateBlockItem(sectionKey, block.id, itemId, item);
                showToast("Updated item");
              }}
              onDeleteItem={(itemId) => {
                deleteBlockItem(sectionKey, block.id, itemId);
                showToast("Removed item");
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface BlockEditorCardProps {
  block: PortfolioBlockData;
  index: number;
  totalBlocks: number;
  modes: { id: string; mode_name: string }[];
  sectionKey: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onUpdate: (data: Partial<PortfolioBlockData>) => void;
  onAddItem: (
    item: Omit<PortfolioBlockItemData, "id" | "blockId" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateItem: (itemId: string, item: Partial<PortfolioBlockItemData>) => void;
  onDeleteItem: (itemId: string) => void;
}

function BlockEditorCard({
  block,
  index,
  totalBlocks,
  modes,
  isEditing,
  onToggleEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdate,
  onAddItem,
  onDeleteItem,
}: BlockEditorCardProps) {
  const [label, setLabel] = useState(block.label || "");
  const [heading, setHeading] = useState(block.heading || "");
  const [subheading, setSubheading] = useState(block.subheading || "");
  const [description, setDescription] = useState(block.description || "");
  const [type, setType] = useState<PortfolioBlockType>(block.type);
  const [personaId, setPersonaId] = useState<string>(block.portfolioModeId || "GLOBAL");
  const [visible, setVisible] = useState(block.visible);

  const [ctaText, setCtaText] = useState(block.ctaText || "");
  const [ctaUrl, setCtaUrl] = useState(block.ctaUrl || "");
  const [ctaVisible, setCtaVisible] = useState(block.ctaVisible ?? true);

  const [imageUrl, setImageUrl] = useState(block.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(block.imageAlt || "");

  const [newItemType, setNewItemType] = useState<PortfolioBlockItemType>("TEXT");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  const handleSave = () => {
    onUpdate({
      label: label || null,
      heading: heading || null,
      subheading: subheading || null,
      description: description || null,
      type,
      portfolioModeId: personaId === "GLOBAL" ? null : personaId,
      visible,
      ctaText: ctaText || null,
      ctaUrl: ctaUrl || null,
      ctaVisible,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
    });
  };

  const handleCreateItem = () => {
    if (!newItemContent.trim()) return;
    const maxOrder = (block.items || []).reduce((max, i) => Math.max(max, i.order), 0);
    onAddItem({
      type: newItemType,
      content: newItemContent,
      url: newItemUrl || null,
      order: maxOrder + 1,
      visible: true,
    });
    setNewItemContent("");
    setNewItemUrl("");
  };

  const currentPersonaName =
    modes.find((m) => m.id === block.portfolioModeId)?.mode_name || "Global (All Personas)";

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        visible ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-900 bg-zinc-950/40 opacity-60"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            Block {block.blockNumber}
          </span>
          <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {block.type}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40">
            {currentPersonaName}
          </span>
          <span className="text-sm font-medium text-zinc-200">
            {block.label ? block.label : "Untitled"} —{" "}
            <span className="text-zinc-400 font-normal">{block.heading || "No Heading"}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            disabled={index === 0}
            onClick={onMoveUp}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-zinc-800"
            title="Move Up"
          >
            <FiArrowUp className="h-4 w-4" />
          </button>
          <button
            disabled={index === totalBlocks - 1}
            onClick={onMoveDown}
            className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-zinc-800"
            title="Move Down"
          >
            <FiArrowDown className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              const nextVis = !visible;
              setVisible(nextVis);
              onUpdate({ visible: nextVis });
            }}
            className={`p-1.5 rounded-lg transition ${
              visible ? "text-emerald-400 hover:bg-emerald-500/10" : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            {visible ? <FiEye className="h-4 w-4" /> : <FiEyeOff className="h-4 w-4" />}
          </button>

          <button
            onClick={onToggleEdit}
            className={`p-1.5 rounded-lg transition ${
              isEditing ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <FiEdit3 className="h-4 w-4" />
          </button>

          <button
            onClick={onDelete}
            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Structural Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PortfolioBlockType)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Assigned Persona Mode
              </label>
              <select
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="GLOBAL">Global (All Personas)</option>
                {modes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.mode_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. FOCUS"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Product engineering"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Subheading
              </label>
              <input
                type="text"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="Optional secondary text"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                Description Body
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Interfaces, APIs, and the space between."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 space-y-3">
            <span className="block text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-2">
              <FiLink /> Call To Action (CTA)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="CTA Button Label"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="CTA URL"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctaVisible}
                  onChange={(e) => setCtaVisible(e.target.checked)}
                  className="rounded border-zinc-800 text-indigo-600 focus:ring-0"
                />
                Show CTA Button
              </label>
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 space-y-3">
            <span className="block text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-2">
              <FiImage /> Media Reference
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Image Alt Description"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4 space-y-3">
            <span className="block text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-2">
              <FiList /> Block Items
            </span>

            {block.items && block.items.length > 0 && (
              <div className="space-y-2">
                {block.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {item.type}
                      </span>
                      <span className="text-zinc-200 truncate">{item.content}</span>
                    </div>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 rounded"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as PortfolioBlockItemType)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="TEXT">TEXT</option>
                <option value="BULLET">BULLET</option>
                <option value="LINK">LINK</option>
              </select>

              <input
                type="text"
                placeholder="Item text content..."
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleCreateItem}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
              >
                <FiPlus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <FiSave className="h-4 w-4" /> Save Block {block.blockNumber} Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

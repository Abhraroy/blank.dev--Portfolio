"use client";

import React, { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

interface ArrayInputProps {
  label: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
  helperText?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  label,
  placeholder = "Add item and press Enter or click Add...",
  items = [],
  onChange,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-white/10 bg-zinc-950/90 px-3.5 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-mono font-semibold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <FiPlus className="mr-1.5 h-4 w-4" /> Add
        </button>
      </div>
      {helperText && <p className="text-xs text-zinc-400 font-mono">{helperText}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        {items.map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs sm:text-sm text-zinc-200 transition-colors hover:border-white/20"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="ml-2 text-zinc-400 hover:text-rose-400 focus:outline-none"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs sm:text-sm italic font-mono text-zinc-500">No items added yet.</span>
        )}
      </div>
    </div>
  );
};

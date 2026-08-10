"use client";

import { motion } from "framer-motion";
import {
  useVisitorModeStore,
  VISITOR_MODES,
  type VisitorMode,
} from "@/zustand";

const MODE_LABELS: Record<VisitorMode, string> = {
  explorer: "Explorer",
  builder: "Builder",
  business: "Business",
};

/**
 * Responsive visitor-mode switcher below the hero.
 * Transparent shell, bordered frame, subtle option animations.
 */
export default function VisitorMode() {
  const mode = useVisitorModeStore((s) => s.mode);
  const setMode = useVisitorModeStore((s) => s.setMode);
  const setSwitching = useVisitorModeStore((s) => s.setSwitching);

  return (
    <section
      className="w-full bg-transparent px-4 py-6 sm:px-6 sm:py-8"
      aria-label="Visitor mode"
    >
      <div
        className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-transparent p-2 sm:flex-row sm:items-center sm:justify-center sm:gap-1 sm:p-1.5"
        role="tablist"
        aria-label="Choose visitor mode"
      >
        {VISITOR_MODES.map((option, index) => {
          const selected = mode === option;

          return (
            <motion.button
              key={option}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMode(option)}
              onAnimationComplete={() => {
                if (selected) setSwitching(false);
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: selected ? 1 : 0.98,
              }}
              whileHover={{ scale: selected ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 28,
                delay: index * 0.05,
              }}
              className={`relative isolate min-h-11 flex-1 overflow-hidden rounded-xl px-4 py-2.5 font-mono text-xs tracking-[0.18em] uppercase transition-colors sm:min-h-10 sm:px-5 ${
                selected
                  ? "text-zinc-50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="visitor-mode-indicator"
                  className="absolute inset-0 -z-10 rounded-xl border border-white/15 bg-white/5"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}
              <span className="relative z-10">{MODE_LABELS[option]}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

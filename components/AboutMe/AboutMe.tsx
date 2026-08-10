"use client";

import { motion } from "framer-motion";
import { useAdminStore } from "@/app/admin/_components/store";
import { PortfolioBlockRenderer } from "./PortfolioBlockRenderer";
import { PortfolioBlockData } from "@/app/admin/_components/types";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/** Desktop grid column spans based on visual position (blockNumber) */
const BLOCK_POSITION_SPAN: Record<number, string> = {
  1: "md:col-span-6",
  2: "md:col-span-3",
  3: "md:col-span-3",
  4: "md:col-span-2",
  5: "md:col-span-2",
  6: "md:col-span-2",
};

export default function AboutMe() {
  const { sections, activeModeId } = useAdminStore();

  // Find ABOUT section and filter/sort blocks by spatial position (blockNumber) and active persona
  const aboutSection = sections.find((s) => s.key === "ABOUT" && s.visible);
  const blocks: PortfolioBlockData[] = aboutSection
    ? [...aboutSection.blocks]
        .filter(
          (b) =>
            b.visible &&
            (!b.portfolioModeId || b.portfolioModeId === activeModeId)
        )
        .sort((a, b) => a.blockNumber - b.blockNumber)
    : [];


  // Spatial blocks: Block 1..6 belong to left grid, Block 7 belongs to right panel
  const heroBlock = blocks.find((b) => b.blockNumber === 1);
  const middleGridBlocks = blocks.filter(
    (b) => b.blockNumber >= 2 && b.blockNumber <= 6
  );
  const profileBlock = blocks.find((b) => b.blockNumber === 7);

  return (
    <section
      id="about"
      className="relative w-full scroll-mt-24 overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-12 lg:py-28"
      aria-labelledby="about-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(63,63,70,0.28)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-stretch gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(220px,0.55fr)] lg:gap-6">
        {/* Left Column — Top Hero (Block 1) + Row 2 & 3 Grid (Blocks 2..6) */}
        <div
          className="order-2 grid grid-cols-1 gap-3 sm:gap-3.5 md:grid-cols-6 lg:order-1"
          role="list"
        >
          {/* Spatial Block 1 (Top Horizontal Hero) */}
          {heroBlock && (
            <motion.div
              role="listitem"
              className="md:col-span-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={0}
              variants={fadeUp}
            >
              <PortfolioBlockRenderer block={heroBlock} />
            </motion.div>
          )}

          {/* Spatial Blocks 2 to 6 (Middle Bento Grid) */}
          {middleGridBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              role="listitem"
              className={`${
                BLOCK_POSITION_SPAN[block.blockNumber] ?? "md:col-span-2"
              } min-h-28 md:min-h-32`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={index + 1}
              variants={fadeUp}
            >
              <PortfolioBlockRenderer block={block} />
            </motion.div>
          ))}
        </div>

        {/* Right Column — Spatial Block 7 (Large Vertical Panel) */}
        {profileBlock && (
          <motion.div
            className="order-1 min-h-72 lg:order-2 lg:min-h-0"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            custom={0}
            variants={fadeUp}
          >
            <PortfolioBlockRenderer block={profileBlock} />
          </motion.div>
        )}
      </div>
    </section>
  );
}


"use client";

import React from "react";
import Link from "next/link";
import GlowFrame from "./GlowFrame";
import { PortfolioBlockData } from "@/app/admin/_components/types";

interface PortfolioBlockRendererProps {
  block: PortfolioBlockData;
}

export function PortfolioBlockRenderer({ block }: PortfolioBlockRendererProps) {
  const {
    label,
    heading,
    subheading,
    description,
    items,
    ctaText,
    ctaUrl,
    ctaVisible,
    imageUrl,
    imageAlt,
    type,
  } = block;

  if (type === "HERO") {
    return (
      <GlowFrame className="h-full min-h-40 rounded-xl">
        <div className="flex h-full flex-col justify-between gap-5 p-5 sm:flex-row sm:items-end sm:gap-8 sm:p-6 lg:p-7">
          <div className="min-w-0 flex-1 space-y-3">
            {label && (
              <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                {label}
              </p>
            )}
            {heading && (
              <h2
                id="about-heading"
                className="font-mono text-2xl tracking-tight text-zinc-50 sm:text-3xl"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase">
                {subheading}
              </p>
            )}
            {description && (
              <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
                {description}
              </p>
            )}

            {/* Block Items (Paragraphs, Bullets, Links) */}
            {items && items.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {items
                  .filter((i) => i.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((item) =>
                    item.type === "BULLET" ? (
                      <p key={item.id} className="text-xs text-zinc-300 flex items-center gap-2">
                        <span className="text-zinc-500">•</span> {item.content}
                      </p>
                    ) : item.type === "LINK" ? (
                      <a
                        key={item.id}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 underline hover:text-indigo-300"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p key={item.id} className="text-xs text-zinc-300">
                        {item.content}
                      </p>
                    )
                  )}
              </div>
            )}
          </div>

          {ctaVisible && ctaText && ctaUrl && (
            <Link
              href={ctaUrl}
              className="cta-highlight-get-in-touch cursor-pointer inline-flex shrink-0 items-center justify-center self-start rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-100 uppercase transition hover:border-white/25 hover:bg-white/10 sm:self-end"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </GlowFrame>
    );
  }

  if (type === "PROFILE") {
    return (
      <GlowFrame className="h-full min-h-72 rounded-2xl lg:min-h-full">
        <div
          className="flex h-full min-h-72 items-center justify-center lg:min-h-full overflow-hidden rounded-2xl"
          aria-label={imageAlt || "Profile visual"}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || "Profile Image"}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <span className="font-mono text-5xl tracking-[0.2em] text-zinc-500 sm:text-6xl lg:text-7xl">
              {heading || "AR"}
            </span>
          )}
        </div>
      </GlowFrame>
    );
  }

  // Standard CARD, TEXT, LIST, MEDIA or CTA structural block
  return (
    <GlowFrame className="h-full rounded-xl">
      <div className="flex h-full flex-col justify-between gap-2 p-4">
        {label && (
          <span className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
            {label}
          </span>
        )}
        <div className="space-y-1">
          {heading && (
            <p className="font-mono text-sm leading-snug text-zinc-100 sm:text-base">
              {heading}
            </p>
          )}
          {subheading && (
            <p className="text-[11px] font-mono text-zinc-400">
              {subheading}
            </p>
          )}
          {description && (
            <p className="text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
              {description}
            </p>
          )}

          {/* Child Block Items */}
          {items && items.length > 0 && (
            <div className="space-y-1 pt-1">
              {items
                .filter((i) => i.visible)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id}>
                    {item.type === "BULLET" ? (
                      <p className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                        <span className="text-zinc-500">•</span>
                        <span>{item.content}</span>
                      </p>
                    ) : item.type === "LINK" ? (
                      <a
                        href={item.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-400 underline hover:text-indigo-300"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-[11px] leading-relaxed text-zinc-400">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {ctaVisible && ctaText && ctaUrl && (
          <div className="pt-2">
            <Link
              href={ctaUrl}
              className="inline-flex items-center text-[11px] font-mono text-indigo-400 hover:underline"
            >
              {ctaText} →
            </Link>
          </div>
        )}
      </div>
    </GlowFrame>
  );
}

"use client";

import Link from "next/link";
import { HERO_MOBILE } from "./config/hero.mobile.config";
import { useSkillTypewriter } from "./hooks/useSkillTypewriter";
import { useAdminStore } from "@/app/admin/_components/store";

/**
 * Lightweight mobile hero: status badge, name, typewriter, tagline, socials, CTAs.
 * Replaces the R3F network sphere below the tablet breakpoint.
 */
export default function HeroMobile() {
  const { displayText, announcedSkill } = useSkillTypewriter({
    skills: HERO_MOBILE.skills,
    ...HERO_MOBILE.typewriter,
  });

  const [firstName, lastName] = HERO_MOBILE.name.split("-");
  const typeSlotWidth =
    Math.max(...HERO_MOBILE.skills.map((skill) => skill.length)) + 1;

  const { details } = useAdminStore();
  const mobileSocials = [
    { id: "github", handle: "github", href: details.github_url || "https://github.com" },
    { id: "linkedin", handle: "linkedin", href: details.linkedin_url || "https://linkedin.com" },
    { id: "x", handle: "x.com", href: details.x_url || "https://x.com" },
    { id: "email", handle: "email", href: `mailto:${details.email || "hello@blankdev.dev"}` },
  ].filter((s) => Boolean(s.href));

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-2 pt-6 pb-16">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-5 text-center">
        <div
          className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-zinc-300 uppercase backdrop-blur-sm"
          aria-label="Status"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
            aria-hidden
          />
          {HERO_MOBILE.status.label}
        </div>

        <h1
          className="flex flex-col items-center font-mono text-4xl tracking-tight text-zinc-50 sm:text-5xl"
          aria-label={`${firstName} ${lastName}`}
        >
          <span className="block leading-[0.95]">{firstName}</span>
          <span className="block leading-[0.95]">{lastName}</span>
        </h1>

        <p className="flex gap-2 items-center justify-center font-mono text-sm leading-none text-zinc-400">
          <span className="shrink-0">{HERO_MOBILE.skillPrefix}</span>
          <span
            className="inline-flex h-7 shrink-0 items-center justify-start overflow-hidden rounded-md border border-white/10 bg-white/5 px-2 text-left leading-none text-zinc-200 backdrop-blur-sm"
            style={{ width: `${typeSlotWidth}ch`, minWidth: `${typeSlotWidth}ch` }}
          >
            <span className="truncate leading-none">{displayText}</span>
            <span
              className="hero-mobile-cursor ml-0.5 inline-block h-[1em] w-[0.55ch] shrink-0 border-r-2 border-zinc-400"
              aria-hidden
            />
          </span>
          <span className="sr-only" aria-live="polite">
            {HERO_MOBILE.skillPrefix}
            {announcedSkill}
          </span>
        </p>

        <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
          {HERO_MOBILE.tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center font-mono text-xs tracking-[0.06em] text-zinc-400">
          {mobileSocials.map(({ id, handle, href }, index) => (
            <span key={id} className="inline-flex items-center">
              {index > 0 ? (
                <span className="px-2 text-zinc-600" aria-hidden>
                  /
                </span>
              ) : null}
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer noopener"
                className="transition hover:text-zinc-100"
              >
                {handle}
              </a>
            </span>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-3">
        {HERO_MOBILE.ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className={
              cta.variant === "primary"
                ? "cta-highlight-get-in-touch cursor-pointer inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-50 uppercase transition hover:border-white/30 hover:bg-white/15 sm:flex-none"
                : "cursor-pointer inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-100 uppercase transition hover:border-white/25 hover:bg-white/10 sm:flex-none"
            }
          >
            {cta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

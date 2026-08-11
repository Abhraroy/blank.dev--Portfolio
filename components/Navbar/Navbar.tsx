"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { NAV_BRAND, NAV_LINKS } from "./nav.config";

const navShell =
  "mx-auto flex h-16 max-w-7xl items-center justify-between border border-white/10 bg-white/10 px-4 backdrop-blur-xl sm:px-6";
const brandClass =
  "font-mono text-sm font-semibold tracking-[0.18em] text-zinc-100 uppercase transition-colors hover:text-white";
const linkClass = "text-sm text-zinc-300 transition-colors hover:text-white";

type NavTier = "mobile" | "tablet" | "desktop";

function readTier(): NavTier {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(min-width: 1024px)").matches) return "desktop";
  if (window.matchMedia("(min-width: 768px)").matches) return "tablet";
  return "mobile";
}

function ResumeCtaButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/api/resume/download"
      download
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-mono font-semibold text-zinc-100 transition-all hover:bg-white/25 hover:text-white shadow-sm ${className}`}
      title="Download Resume / CV"
    >
      <FiDownload className="h-3.5 w-3.5 text-emerald-400" />
      <span>Resume / CV</span>
    </a>
  );
}

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.includes("#")) {
    const hash = href.split("#")[1];
    if (window.location.pathname === "/" || href.startsWith("#")) {
      e.preventDefault();
      const elem = document.getElementById(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  }
};

function MobileNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}) {
  return (
    <div className="w-full">
      <nav
        className={`${navShell} w-full rounded-full`}
        aria-label="Primary mobile"
      >
        <Link
          href={NAV_BRAND.href}
          className={brandClass}
          onClick={() => setOpen(false)}
        >
          {NAV_BRAND.label}
        </Link>

        <div className="flex items-center gap-2">
          <ResumeCtaButton />

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-100 transition-colors hover:bg-white/10"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-3 space-y-1 rounded-2xl border border-white/10 bg-zinc-950/90 p-3 backdrop-blur-xl">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
                onClick={(e) => {
                  setOpen(false);
                  handleNavClick(e, item.href);
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabletNav() {
  return (
    <nav
      className={`${navShell} w-full rounded-full`}
      aria-label="Primary tablet"
    >
      <Link href={NAV_BRAND.href} className={brandClass}>
        {NAV_BRAND.label}
      </Link>

      <div className="flex items-center gap-5">
        <ul className="flex items-center gap-5">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ResumeCtaButton />
      </div>
    </nav>
  );
}

function DesktopNav() {
  return (
    <nav
      className={`${navShell} w-full rounded-full`}
      aria-label="Primary desktop"
    >
      <Link href={NAV_BRAND.href} className={brandClass}>
        {NAV_BRAND.label}
      </Link>

      <div className="flex items-center gap-8">
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={linkClass}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ResumeCtaButton />
      </div>
    </nav>
  );
}

/**
 * Navbar — glass blur kept; only one breakpoint tree mounts at a time.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<NavTier>("desktop");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const update = () => {
      const next = readTier();
      setTier(next);
      if (next !== "mobile") setOpen(false);
    };
    update();
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-fit w-full items-center justify-center p-6">
        {tier === "mobile" ? (
          <MobileNav open={open} setOpen={setOpen} />
        ) : tier === "tablet" ? (
          <TabletNav />
        ) : (
          <DesktopNav />
        )}
      </div>
    </header>
  );
}

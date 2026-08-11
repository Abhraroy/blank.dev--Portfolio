"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiLayers,
  FiUser,
  FiFolder,
  FiBriefcase,
  FiChevronRight,
  FiTerminal,
  FiLayout,
  FiSliders,
  FiSmartphone,
} from "react-icons/fi";

const domainNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FiGrid,
  },
  {
    name: "Portfolio Modes",
    href: "/admin/modes",
    icon: FiLayers,
  },
  {
    name: "My Details",
    href: "/admin/details",
    icon: FiUser,
  },
  {
    name: "Projects Pool",
    href: "/admin/projects",
    icon: FiFolder,
  },
  {
    name: "Experience Pool",
    href: "/admin/experience",
    icon: FiBriefcase,
  },
];

const cmsNavItems = [
  {
    name: "CMS Management Hub",
    href: "/admin/cms",
    icon: FiSliders,
  },
  {
    name: "Mobile Hero CMS",
    href: "/admin/cms/mobile-hero",
    icon: FiSmartphone,
  },
  {
    name: "Hero Nodes CMS",
    href: "/admin/cms/hero-nodes",
    icon: FiSliders,
  },
  {
    name: "About Me CMS",
    href: "/admin/cms/about",
    icon: FiLayout,
  },
  {
    name: "Experience CMS",
    href: "/admin/cms/experience",
    icon: FiBriefcase,
  },
  {
    name: "Selected Work CMS",
    href: "/admin/cms/selected-work",
    icon: FiGrid,
  },
  {
    name: "Showcase Track CMS",
    href: "/admin/cms/project-showcase",
    icon: FiSliders,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#09090b]/90 backdrop-blur-2xl flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Admin Brand / Header */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl border border-white/20 bg-white/5 p-0.5 shadow-inner">
              <div className="h-full w-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                <FiTerminal className="h-5 w-5 text-zinc-200 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-mono font-semibold text-zinc-50 tracking-tight flex items-center gap-1.5">
                Admin Studio
                <span className="px-1.5 py-0.5 text-xs font-mono font-normal rounded bg-white/10 text-zinc-400 border border-white/10">
                  v2.0
                </span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Client Design Standard</p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-zinc-800">
          {/* Domain Models Section */}
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              Factual Domain Pool
            </div>
            {domainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-zinc-50 shadow-sm border border-white/20 font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive ? "text-zinc-50" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <FiChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive
                        ? "text-zinc-300 opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-600"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CMS Composition Section */}
          <div className="space-y-1 pt-3 border-t border-white/10">
            <div className="px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
              CMS Section Composition
            </div>
            {cmsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/cms"
                  ? pathname === "/admin/cms"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm border border-white/30 font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4.5 w-4.5 transition-colors ${
                        isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  <FiChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive
                        ? "text-white opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-600"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 text-xs text-zinc-400 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-xs tracking-wider text-zinc-400 uppercase font-semibold">Schema Sync</span>
          <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Connected
          </span>
        </div>
        <p className="text-xs text-zinc-500 font-mono leading-normal">
          Client glass design theme applied.
        </p>
      </div>
    </aside>
  );
};

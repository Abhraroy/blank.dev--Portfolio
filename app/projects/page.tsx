import Link from "next/link";
import {
  SELECTED_PROJECTS,
  SELECTED_WORK,
} from "@/components/SelectedWork/selectedWork.config";

export const metadata = {
  title: "Projects · blankdev",
  description: SELECTED_WORK.subtitle,
};

/**
 * Full project archive — destination for the showcase "View all" card.
 */
export default function ProjectsPage() {
  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-24 sm:px-6 md:px-8 lg:px-12">
      <div className="relative mx-auto w-full max-w-5xl">
        <header className="mb-12 max-w-2xl space-y-3 sm:mb-16">
          <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            {SELECTED_WORK.eyebrow}
          </p>
          <h1 className="font-mono text-3xl tracking-tight text-zinc-50 sm:text-4xl">
            All projects
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
            {SELECTED_WORK.subtitle}
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6" role="list">
          {SELECTED_PROJECTS.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                className="glass-panel group flex h-full min-h-[220px] flex-col justify-between gap-6 rounded-2xl p-5 transition hover:border-white/30 sm:p-6"
              >
                <div className="space-y-3">
                  <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
                    {project.number}
                  </span>
                  <h2 className="font-mono text-xl tracking-tight text-zinc-50 sm:text-2xl">
                    {project.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {project.oneLiner}
                  </p>
                </div>
                <span className="font-mono text-xs tracking-[0.18em] text-zinc-500 uppercase transition-colors group-hover:text-zinc-300">
                  Case study →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12">
          <Link
            href="/#work"
            className="font-mono text-xs tracking-[0.18em] text-zinc-500 uppercase transition-colors hover:text-zinc-300"
          >
            ← Back to showcase
          </Link>
        </p>
      </div>
    </main>
  );
}

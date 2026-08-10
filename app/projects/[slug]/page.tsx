import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  SELECTED_PROJECTS,
} from "@/components/SelectedWork/selectedWork.config";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SELECTED_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };

  return {
    title: `${project.name} · Case Study`,
    description: project.oneLiner,
  };
}

/**
 * Full case study surface for a Selected Work project.
 */
export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-24 sm:px-6 md:px-8 lg:px-12">
      <article className="relative mx-auto w-full max-w-3xl">
        <div
          className="pointer-events-none absolute -inset-x-10 -top-10 h-64 bg-[radial-gradient(ellipse_at_30%_0%,rgba(63,63,70,0.25)_0%,transparent_60%)]"
          aria-hidden
        />

        <div className="relative space-y-8">
          <Link
            href="/#work"
            className="inline-flex font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase transition hover:text-zinc-300"
          >
            ← Selected Work
          </Link>

          <header className="space-y-3 border-b border-white/10 pb-8">
            <p className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
              {project.number} · Case Study
            </p>
            <h1 className="font-mono text-3xl tracking-tight text-zinc-50 sm:text-4xl">
              {project.name}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
              {project.oneLiner}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </header>

          <section className="space-y-6">
            <CaseBlock title="Challenge" body={project.challenge} />
            <CaseBlock title="Solution" body={project.solution} />
            <CaseBlock title="Impact" body={project.impact} />

            <div className="space-y-3">
              <h2 className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
                Technical Highlights
              </h2>
              <ul className="space-y-2">
                {project.technicalHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-zinc-300"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-6 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                >
                  <p className="font-mono text-[10px] tracking-wide text-zinc-300 uppercase sm:text-[11px]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-white/10 pt-6">
            <Link
              href="/#work"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-100 uppercase transition hover:border-white/25 hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}

function CaseBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h2 className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
        {body}
      </p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { FiGithub, FiExternalLink, FiArrowLeft, FiFolder } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { getProjectMarkdown } from "@/lib/projects";
import MarkdownViewer from "@/components/MarkdownViewer";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((project) => ({ slug: project.slug }));
}

async function fetchDbProject(slug: string) {
  const proj = await prisma.project.findUnique({
    where: { slug },
    include: { modeContents: true, highlights: true },
  });
  if (!proj) return null;
  const modeContent = proj.modeContents?.[0];
  return {
    id: proj.id,
    slug: proj.slug,
    number: "01",
    name: proj.project_name || "Placeholder",
    oneLiner: modeContent?.project_description || proj.project_name || "Placeholder",
    techStack: proj.project_tech && proj.project_tech.length > 0 ? proj.project_tech : ["Placeholder"],
    githubUrl: proj.project_github || undefined,
    liveUrl: proj.project_url || undefined,
    period: "Production",
    role: "Lead Architect",
    category: proj.project_type || "Project Case Study",
  };
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchDbProject(slug);
  if (!project) return { title: "Project Case Study · blankdev" };

  return {
    title: `${project.name} · Case Study & Documentation`,
    description: project.oneLiner,
  };
}

/**
 * Single Project Case Study Page featuring factual header CTAs and dynamic Markdown container.
 */
export default async function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchDbProject(slug);
  if (!project) notFound();

  const markdownContent = await getProjectMarkdown(slug);

  return (
    <main className="min-h-screen w-full bg-zinc-950 px-4 py-28 sm:px-6 md:px-8 lg:px-12 text-zinc-100 relative">
      {/* Subtle Background Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-x-10 -top-10 h-96 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)]"
        aria-hidden
      />

      <article className="relative mx-auto w-full max-w-4xl space-y-10">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-zinc-400 uppercase transition hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            <span>All Projects</span>
          </Link>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Case Study #{project.number}
          </span>
        </div>

        {/* Factual Data Header Section */}
        <header className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-zinc-400 uppercase">
              <span>{project.number}</span>
              <span>·</span>
              <span>{project.category || "Project Case Study"}</span>
            </div>
            {project.period && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400">
                {project.period}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {project.name}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {project.oneLiner}
            </p>
          </div>

          {/* Factual Data Grid: Role & Tech Stack */}
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 border-t border-white/10">
            {project.role && (
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                  Role / Responsibility
                </span>
                <p className="font-mono text-xs text-zinc-200">{project.role}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
                Technologies Used
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 font-mono text-xs text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs: Repository & Live Demo */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 font-mono text-xs tracking-wider text-white uppercase transition hover:border-white/30 hover:bg-white/20"
              >
                <FiGithub className="h-4 w-4" />
                <span>View Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-zinc-950 uppercase transition hover:bg-zinc-200"
              >
                <FiExternalLink className="h-4 w-4" />
                <span>Live Preview</span>
              </a>
            )}
          </div>
        </header>

        {/* Big Div: Markdown Viewer Container */}
        <section aria-label="Project Documentation & Case Study">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase flex items-center gap-1.5">
              <FiFolder className="h-3.5 w-3.5" />
              <span>Project Documentation (.md)</span>
            </span>
          </div>

          {/* Big Div Container */}
          <div className="glass-panel glass-panel--active relative rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl min-h-[400px]">
            <MarkdownViewer content={markdownContent} />
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-300 uppercase transition hover:bg-white/10 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Projects</span>
          </Link>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs tracking-[0.18em] text-zinc-300 uppercase transition hover:bg-white/10 hover:text-white"
          >
            <span>Home Dashboard</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}

export type ProjectMetric = {
  label: string;
};

export type SelectedProject = {
  id: string;
  slug: string;
  number: string;
  name: string;
  oneLiner: string;
  techStack: string[];
  metrics: ProjectMetric[];
  challenge: string;
  solution: string;
  impact: string;
  technicalHighlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  period?: string;
  role?: string;
  category?: string;
  /** Slight vertical offset for masonry rhythm on desktop. */
  offset?: "up" | "down";
};

export const SELECTED_WORK = {
  eyebrow: "Selected Work",
  heading: "SELECTED WORK",
  subtitle:
    "Products, platforms, and systems I've designed, built, and shipped.",
} as const;

export const SELECTED_PROJECTS: SelectedProject[] = [];

export function getProjectBySlug(slug: string): SelectedProject | undefined {
  return SELECTED_PROJECTS.find((project) => project.slug === slug);
}

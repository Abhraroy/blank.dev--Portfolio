export type ExperienceStat = {
  label: string;
  value: string;
};

export type ExperienceMilestone = {
  id: string;
  year: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  achievements: string[];
  stats: ExperienceStat[];
  image?: string;
};

export const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [];

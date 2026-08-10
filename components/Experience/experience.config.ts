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

export const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [
  {
    id: "2026",
    year: "2026",
    title: "Building Production Systems",
    summary: "Shipping scalable products and infrastructure.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    techStack: ["Next.js", "TypeScript", "Supabase", "Postgres", "Cloudflare"],
    achievements: [
      "Built scalable systems for production traffic",
      "Improved end-to-end performance and reliability",
      "Delivered production applications from design to deploy",
    ],
    stats: [
      { label: "Projects", value: "10+" },
      { label: "Deployments", value: "5" },
      { label: "Technologies", value: "20+" },
    ],
  },
  {
    id: "2025",
    year: "2025",
    title: "AI Engineering",
    summary: "Integrating LLMs into real product workflows.",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    techStack: ["Python", "LangChain", "OpenAI", "RAG", "FastAPI"],
    achievements: [
      "Designed retrieval pipelines for grounded responses",
      "Shipped AI-assisted features with measurable UX gains",
      "Hardened prompts, evals, and failure handling",
    ],
    stats: [
      { label: "Pipelines", value: "8+" },
      { label: "Models", value: "12" },
      { label: "Latency cut", value: "40%" },
    ],
  },
  {
    id: "2024",
    year: "2024",
    title: "Full Stack Development",
    summary: "End-to-end web apps with modern tooling.",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    techStack: ["React", "Node.js", "Prisma", "PostgreSQL", "Tailwind"],
    achievements: [
      "Owned features across frontend and API layers",
      "Introduced typed data models and safer migrations",
      "Improved DX with shared component and API patterns",
    ],
    stats: [
      { label: "Features", value: "25+" },
      { label: "APIs", value: "15" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  {
    id: "2023",
    year: "2023",
    title: "Learning Foundations",
    summary: "Core CS, web fundamentals, and craft.",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    techStack: ["JavaScript", "HTML", "CSS", "Git", "SQL"],
    achievements: [
      "Built a strong foundation in algorithms and data structures",
      "Shipped first personal projects and open-source contributions",
      "Learned collaborative workflows with Git and code review",
    ],
    stats: [
      { label: "Projects", value: "12+" },
      { label: "Courses", value: "6" },
      { label: "Commits", value: "500+" },
    ],
  },
];

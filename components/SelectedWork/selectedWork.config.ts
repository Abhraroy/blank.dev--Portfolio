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
  /** Slight vertical offset for masonry rhythm on desktop. */
  offset?: "up" | "down";
};

export const SELECTED_WORK = {
  eyebrow: "Selected Work",
  heading: "SELECTED WORK",
  subtitle:
    "Products, platforms, and systems I've designed, built, and shipped.",
} as const;

export const SELECTED_PROJECTS: SelectedProject[] = [
  {
    id: "the-jwel",
    slug: "the-jwel",
    number: "01",
    name: "THE JWEL",
    oneLiner: "Full-stack ecommerce platform built for a jewellery business.",
    techStack: ["Next.js", "Supabase", "PostgreSQL", "Cloudflare", "Razorpay"],
    metrics: [
      { label: "Revenue Platform" },
      { label: "Advanced Search" },
      { label: "Meta CAPI" },
      { label: "Admin Dashboard" },
    ],
    challenge:
      "A jewellery retailer needed a production storefront that could handle catalog complexity, real payments, and ads attribution — without a heavyweight agency stack.",
    solution:
      "Shipped an end-to-end Next.js commerce system with Supabase/Postgres, Cloudflare edge delivery, Razorpay checkout, and an admin surface for inventory and orders.",
    impact:
      "Live storefront serving real customers with payments, search, recommendations, and operator tooling — a revenue platform, not a brochure site.",
    technicalHighlights: [
      "App Router storefront with server-driven catalog and search",
      "Razorpay payment flows with order state management",
      "Meta Conversions API for reliable ads attribution",
      "Admin dashboards for inventory, orders, and operations",
    ],
    offset: "up",
  },
  {
    id: "ai-chatbot",
    slug: "ai-chatbot",
    number: "02",
    name: "AI Chatbot",
    oneLiner: "Retrieval-augmented assistant for product support and discovery.",
    techStack: ["Python", "OpenAI", "RAG", "Vector DB", "Next.js"],
    metrics: [
      { label: "RAG Pipeline" },
      { label: "Context Memory" },
      { label: "Low Latency" },
      { label: "Support Deflect" },
    ],
    challenge:
      "Support and discovery were stuck in FAQ pages — users needed answers grounded in real product knowledge, not generic LLM chatter.",
    solution:
      "Built a RAG chatbot that indexes product docs, retrieves relevant chunks, and responds with grounded answers inside a lightweight product UI.",
    impact:
      "Faster first responses for common queries and a reusable AI layer that can plug into other products.",
    technicalHighlights: [
      "Embedding + retrieval pipeline over curated product knowledge",
      "Prompting constraints to reduce hallucinations",
      "Streaming responses for perceived performance",
      "Observability hooks for prompt and retrieval quality",
    ],
    offset: "down",
  },
  {
    id: "job-portal",
    slug: "job-portal",
    number: "03",
    name: "Job Portal",
    oneLiner: "Hiring platform connecting candidates, listings, and employers.",
    techStack: ["Next.js", "PostgreSQL", "Prisma", "Auth", "Tailwind"],
    metrics: [
      { label: "Role Matching" },
      { label: "Applicant Flow" },
      { label: "Employer Tools" },
      { label: "Search Filters" },
    ],
    challenge:
      "Hiring workflows were fragmented across forms and spreadsheets — candidates and employers needed one coherent product surface.",
    solution:
      "Designed and built a job portal with listings, filters, applications, and role-based flows for candidates and employers.",
    impact:
      "A single system for discovery, applications, and employer review — less friction from post to hire.",
    technicalHighlights: [
      "Typed Prisma schema for listings, users, and applications",
      "Auth and role-aware routes for candidate vs employer",
      "Search and filter UX tuned for scanability",
      "Responsive dashboard patterns for application review",
    ],
    offset: "up",
  },
  {
    id: "blankdev-portfolio",
    slug: "blankdev-portfolio",
    number: "04",
    name: "blankdev",
    oneLiner: "Immersive portfolio with 3D network graph and founder narrative.",
    techStack: ["Next.js", "R3F", "Framer Motion", "GSAP", "Zustand"],
    metrics: [
      { label: "3D Hero" },
      { label: "Visitor Modes" },
      { label: "Scroll Story" },
      { label: "Glass UI" },
    ],
    challenge:
      "A standard project grid wouldn't communicate systems thinking — the portfolio needed to feel like a product, not a résumé dump.",
    solution:
      "Built an interactive experience: WebGL skill network, visitor modes, scroll-driven experience, and a founder dashboard for selected work.",
    impact:
      "A memorable first impression that lets founders and clients scan impact, stack, and product thinking in minutes.",
    technicalHighlights: [
      "Three.js / R3F network graph with interaction stores",
      "GSAP ScrollTrigger for experience storytelling",

      "Framer Motion for UI presence and dashboard interactions",
      "Shared glass + glow design language across sections",
    ],
    offset: "down",
  },
];

export function getProjectBySlug(slug: string): SelectedProject | undefined {
  return SELECTED_PROJECTS.find((project) => project.slug === slug);
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PortfolioMode,
  MyDetails,
  Project,
  Experience,
  ProjectModeContent,
  ExperienceModeContent,
  MyDetailsModeContent,
  PortfolioSectionData,
  PortfolioBlockData,
  PortfolioBlockItemData,
  ExperienceMetricData,
  ExperienceAchievementData,
  ProjectHighlightData,
  ExperienceSectionCMSData,
  ExperienceSectionCMSItemData,
  SelectedWorkSectionCMSData,
  SelectedWorkSectionCMSItemData,
  ProjectShowcaseSectionCMSData,
  ProjectShowcaseSectionCMSItemData,
  HeroNodeCMSData,
  HeroNodeCMSItemData,
} from "./types";
import { SKILL_CATALOG } from "@/components/NewHeroSection/config/nodes.data";


interface AdminState {
  activeModeId: string;
  modes: PortfolioMode[];
  details: MyDetails;
  projects: Project[];
  experiences: Experience[];
  sections: PortfolioSectionData[];

  // Actions
  setActiveModeId: (id: string) => void;

  // Portfolio Modes
  addMode: (mode: Omit<PortfolioMode, "id" | "createdAt" | "updatedAt">) => void;
  updateMode: (id: string, mode: Partial<PortfolioMode>) => void;
  deleteMode: (id: string) => void;

  // My Details
  updateMyDetails: (details: Partial<MyDetails>) => void;
  updateMyDetailsModeContent: (
    modeId: string,
    content: Partial<MyDetailsModeContent>
  ) => void;

  // Projects
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateProjectModeContent: (
    projectId: string,
    modeId: string,
    content: Partial<ProjectModeContent>
  ) => void;

  // Experience
  addExperience: (
    experience: Omit<Experience, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  updateExperienceModeContent: (
    experienceId: string,
    modeId: string,
    content: Partial<ExperienceModeContent>
  ) => void;

  // CMS Portfolio Sections & Blocks
  updateBlock: (
    sectionKey: string,
    blockId: string,
    data: Partial<PortfolioBlockData>
  ) => void;
  addBlock: (
    sectionKey: string,
    block: Omit<PortfolioBlockData, "id" | "sectionId" | "createdAt" | "updatedAt">
  ) => void;
  deleteBlock: (sectionKey: string, blockId: string) => void;
  reorderBlocks: (sectionKey: string, blocks: PortfolioBlockData[]) => void;

  // Block Items
  addBlockItem: (
    sectionKey: string,
    blockId: string,
    item: Omit<PortfolioBlockItemData, "id" | "blockId" | "createdAt" | "updatedAt">
  ) => void;
  updateBlockItem: (
    sectionKey: string,
    blockId: string,
    itemId: string,
    item: Partial<PortfolioBlockItemData>
  ) => void;
  deleteBlockItem: (
    sectionKey: string,
    blockId: string,
    itemId: string
  ) => void;
  reorderBlockItems: (
    sectionKey: string,
    blockId: string,
    items: PortfolioBlockItemData[]
  ) => void;

  // Factual Domain Extension States
  experienceMetrics: ExperienceMetricData[];
  experienceAchievements: ExperienceAchievementData[];
  projectHighlights: ProjectHighlightData[];

  // Section CMS Composition States
  experienceCMS: ExperienceSectionCMSData;
  selectedWorkCMS: SelectedWorkSectionCMSData;
  projectShowcaseCMS: ProjectShowcaseSectionCMSData;
  heroNodesCMS: HeroNodeCMSData;

  // Factual Metric Actions
  addExperienceMetric: (metric: Omit<ExperienceMetricData, "id" | "createdAt" | "updatedAt">) => void;
  updateExperienceMetric: (id: string, metric: Partial<ExperienceMetricData>) => void;
  deleteExperienceMetric: (id: string) => void;

  // Factual Achievement Actions
  addExperienceAchievement: (achievement: Omit<ExperienceAchievementData, "id" | "createdAt" | "updatedAt">) => void;
  updateExperienceAchievement: (id: string, achievement: Partial<ExperienceAchievementData>) => void;
  deleteExperienceAchievement: (id: string) => void;

  // Factual Highlight Actions
  addProjectHighlight: (highlight: Omit<ProjectHighlightData, "id" | "createdAt" | "updatedAt">) => void;
  updateProjectHighlight: (id: string, highlight: Partial<ProjectHighlightData>) => void;
  deleteProjectHighlight: (id: string) => void;

  // Experience Section CMS Actions
  updateExperienceCMS: (data: Partial<ExperienceSectionCMSData>) => void;
  addExperienceCMSItem: (item: Omit<ExperienceSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => void;
  updateExperienceCMSItem: (id: string, item: Partial<ExperienceSectionCMSItemData>) => void;
  deleteExperienceCMSItem: (id: string) => void;
  reorderExperienceCMSItems: (items: ExperienceSectionCMSItemData[]) => void;

  // Selected Work Section CMS Actions
  updateSelectedWorkCMS: (data: Partial<SelectedWorkSectionCMSData>) => void;
  addSelectedWorkCMSItem: (item: Omit<SelectedWorkSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => void;
  updateSelectedWorkCMSItem: (id: string, item: Partial<SelectedWorkSectionCMSItemData>) => void;
  deleteSelectedWorkCMSItem: (id: string) => void;
  reorderSelectedWorkCMSItems: (items: SelectedWorkSectionCMSItemData[]) => void;

  // Project Showcase Section CMS Actions
  updateProjectShowcaseCMS: (data: Partial<ProjectShowcaseSectionCMSData>) => void;
  addProjectShowcaseCMSItem: (item: Omit<ProjectShowcaseSectionCMSItemData, "id" | "sectionId" | "createdAt" | "updatedAt">) => void;
  updateProjectShowcaseCMSItem: (id: string, item: Partial<ProjectShowcaseSectionCMSItemData>) => void;
  deleteProjectShowcaseCMSItem: (id: string) => void;
  reorderProjectShowcaseCMSItems: (items: ProjectShowcaseSectionCMSItemData[]) => void;

  // Hero Nodes Section CMS Actions
  updateHeroNodesCMS: (data: Partial<HeroNodeCMSData>) => void;
  addHeroNodeCMSItem: (item: Omit<HeroNodeCMSItemData, "createdAt" | "updatedAt">) => void;
  updateHeroNodeCMSItem: (id: string, item: Partial<HeroNodeCMSItemData>) => void;
  deleteHeroNodeCMSItem: (id: string) => void;
  reorderHeroNodeCMSItems: (items: HeroNodeCMSItemData[]) => void;
}



const defaultModes: PortfolioMode[] = [
  {
    id: "mode-1",
    mode_name: "Software Engineer",
    mode_description: "Full-stack web applications, scalable backend APIs, and systems engineering.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mode-2",
    mode_name: "Founder & Product Builder",
    mode_description: "Building products 0-to-1, user acquisition, growth, and metrics.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mode-3",
    mode_name: "Open Source Contributor",
    mode_description: "Public repositories, developer tooling, ecosystem libraries.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultDetails: MyDetails = {
  id: "details-1",
  full_name: "Abhra",
  profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  email: "hello@blankdev.dev",
  github_url: "https://github.com",
  linkedin_url: "https://linkedin.com",
  x_url: "https://x.com",
  instagram_url: "https://instagram.com",
  discord_url: "https://discord.com",
  website_url: "https://blank.dev",
  location: "San Francisco, CA",
  years_of_experience: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  modeContents: [
    {
      id: "mdc-1",
      myDetailsId: "details-1",
      portfolioModeId: "mode-1",
      headline: "Senior Full-Stack Engineer crafting resilient web platforms",
      short_bio: "Specializing in Next.js, Node.js, and Distributed DBs.",
      detailed_bio: "Passionate engineer with extensive expertise building microservices, high-throughput Next.js interfaces, and developer tooling.",
      highlights: [
        "Architected systems serving 100k+ MAU",
        "Deep expertise in TypeScript, Next.js & PostgreSQL",
        "Optimized cold start latency by 65%",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "mdc-2",
      myDetailsId: "details-1",
      portfolioModeId: "mode-2",
      headline: "Product Builder scaling SaaS solutions from 0 to 1",
      short_bio: "Shipped 3 SaaS products generated $15k ARR.",
      detailed_bio: "Entrepreneurial mindset focused on product-market fit, rapid prototyping, growth loops, and delightful UX.",
      highlights: [
        "Built and launched 3 products in 12 months",
        "Organic user acquisition through developer communities",
        "End-to-end design, development, & monetization",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

const defaultProjects: Project[] = [
  {
    id: "proj-1",
    project_name: "BlankDev Studio",
    slug: "blankdev-studio",
    project_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    project_url: "https://blank.dev",
    project_github: "https://github.com/blankdev",
    project_tags: ["SaaS", "Next.js", "AI"],
    project_tech: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    project_status: "ACTIVE",
    project_type: "SIDE_PROJECT",
    project_visibility_status: "PUBLIC",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modeContents: [
      {
        id: "pmc-1",
        projectId: "proj-1",
        portfolioModeId: "mode-1",
        project_description: "An AI-powered portfolio and persona engine built with Next.js App Router and Prisma.",
        project_highlights: [
          "Built multi-persona storytelling matrix DB models",
          "Dynamic client context switching in under 50ms",
          "PostgreSQL backend with automated schema migrations",
        ],
        project_user_count: 1250,
        project_revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "pmc-2",
        projectId: "proj-1",
        portfolioModeId: "mode-2",
        project_description: "Self-serve creator tool for engineers to showcase multi-faceted developer personas.",
        project_highlights: [
          "Attracted 1,250 registered early beta users",
          "45% viral invitation conversion rate",
        ],
        project_user_count: 1250,
        project_revenue: 2400,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "proj-2",
    project_name: "UltraCache KV Engine",
    slug: "ultracache-kv",
    project_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    project_url: "https://ultracache.dev",
    project_github: "https://github.com/ultracache",
    project_tags: ["Infrastructure", "Rust", "Cache"],
    project_tech: ["Rust", "Tokio", "gRPC", "Docker"],
    project_status: "COMPLETED",
    project_type: "OPEN_SOURCE",
    project_visibility_status: "PUBLIC",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modeContents: [
      {
        id: "pmc-3",
        projectId: "proj-2",
        portfolioModeId: "mode-1",
        project_description: "In-memory key-value cache engine implementing sub-millisecond LRU eviction.",
        project_highlights: [
          "Sub-millisecond tail latencies under heavy write spikes",
          "Benchmarked against Redis with 1.4x higher throughput",
        ],
        project_user_count: 5000,
        project_revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "pmc-4",
        projectId: "proj-2",
        portfolioModeId: "mode-3",
        project_description: "Open source key-value engine with over 800 GitHub stars.",
        project_highlights: [
          "800+ GitHub stars & 42 open source contributors",
          "Adopted by 3 enterprise production stacks",
        ],
        project_user_count: 5000,
        project_revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

const defaultExperiences: Experience[] = [
  {
    id: "exp-1",
    company_name: "Acme Tech Solutions",
    role_title: "Senior Full Stack Engineer",
    employment_type: "FULL_TIME",
    location: "San Francisco, CA (Remote)",
    start_date: "2023-01-15",
    end_date: null,
    currently_working: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modeContents: [
      {
        id: "emc-1",
        experienceId: "exp-1",
        portfolioModeId: "mode-1",
        experience_description: "Led development of core SaaS web application and API infrastructure.",
        experience_highlights: [
          "Architected real-time WebSocket dashboard handling 20k sync events/sec",
          "Reduced CI/CD build deployment time from 18m to 4m",
          "Mentored 4 junior frontend developers in Next.js best practices",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "exp-2",
    company_name: "Nexus Labs",
    role_title: "Frontend Engineer",
    employment_type: "CONTRACT",
    location: "New York, NY",
    start_date: "2021-06-01",
    end_date: "2022-12-31",
    currently_working: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modeContents: [
      {
        id: "emc-2",
        experienceId: "exp-2",
        portfolioModeId: "mode-1",
        experience_description: "Developed design system and responsive web components.",
        experience_highlights: [
          "Built accessible UI library used across 8 internal web apps",
          "Improved web performance Lighthouse score from 62 to 98",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

const defaultSections: PortfolioSectionData[] = [
  {
    id: "sec-about",
    key: "ABOUT",
    title: "About Me",
    visible: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: "blk-1",
        sectionId: "sec-about",
        blockNumber: 1,
        type: "HERO",
        visible: true,
        label: "ABOUT ME",
        heading: "blankdev",
        subheading: "FULL-STACK ENGINEER",
        description:
          "Building interactive products with clarity and craft. I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs.",
        ctaText: "GET IN TOUCH",
        ctaUrl: "/#contact",
        ctaType: "LINK",
        ctaVisible: true,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-2",
        sectionId: "sec-about",
        blockNumber: 2,
        type: "CARD",
        visible: true,
        label: "FOCUS",
        heading: "Product engineering",
        description: "Interfaces, APIs, and the space between.",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-3",
        sectionId: "sec-about",
        blockNumber: 3,
        type: "CARD",
        visible: true,
        label: "EXPERIENCE",
        heading: "4+ yrs",
        description: "Shipping for web & startups",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-4",
        sectionId: "sec-about",
        blockNumber: 4,
        type: "CARD",
        visible: true,
        label: "STACK",
        heading: "Next · TS · Node",
        description: "Prisma · Three · Postgres",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-5",
        sectionId: "sec-about",
        blockNumber: 5,
        type: "CARD",
        visible: true,
        label: "BASED",
        heading: "Remote",
        description: "Open to collab worldwide",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-6",
        sectionId: "sec-about",
        blockNumber: 6,
        type: "CARD",
        visible: true,
        label: "STATUS",
        heading: "Available",
        description: "Select freelance & full-time",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "blk-7",
        sectionId: "sec-about",
        blockNumber: 7,
        type: "PROFILE",
        visible: true,
        heading: "AR",
        imageAlt: "Profile Avatar",
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

const defaultExperienceMetrics: ExperienceMetricData[] = [
  { id: "em-1", experienceId: "exp-1", label: "PIPELINES", value: "8+", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "em-2", experienceId: "exp-1", label: "MODELS", value: "12", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "em-3", experienceId: "exp-1", label: "LATENCY CUT", value: "40%", order: 3, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "em-4", experienceId: "exp-2", label: "FEATURES", value: "25+", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "em-5", experienceId: "exp-2", label: "APIs", value: "15", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "em-6", experienceId: "exp-2", label: "UPTIME", value: "99.9%", order: 3, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const defaultExperienceAchievements: ExperienceAchievementData[] = [
  { id: "ea-1", experienceId: "exp-1", content: "Designed retrieval pipelines for grounded responses", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ea-2", experienceId: "exp-1", content: "Shipped AI-assisted features with measurable UX gains", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ea-3", experienceId: "exp-1", content: "Hardened prompts, evals, and failure handling", order: 3, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ea-4", experienceId: "exp-2", content: "Built accessible UI library used across 8 internal web apps", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ea-5", experienceId: "exp-2", content: "Improved web performance Lighthouse score from 62 to 98", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const defaultProjectHighlights: ProjectHighlightData[] = [
  { id: "ph-1", projectId: "proj-1", content: "REVENUE PLATFORM", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-2", projectId: "proj-1", content: "ADVANCED SEARCH", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-3", projectId: "proj-1", content: "META CAPI", order: 3, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-4", projectId: "proj-1", content: "ADMIN DASHBOARD", order: 4, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-5", projectId: "proj-2", content: "SUB-MS TAIL LATENCY", order: 1, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-6", projectId: "proj-2", content: "1.4X REDIS THROUGHPUT", order: 2, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ph-7", projectId: "proj-2", content: "800+ GITHUB STARS", order: 3, visible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const defaultExperienceCMS: ExperienceSectionCMSData = {
  id: "exp-cms-main",
  key: "EXPERIENCE_MAIN",
  defaultActiveId: "exp-1",
  visible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [
    {
      id: "ecmsi-1",
      sectionId: "exp-cms-main",
      experienceId: "exp-1",
      displayOrder: 1,
      visible: true,
      isFeatured: true,
      showYear: true,
      showRole: true,
      showCompany: true,
      showDescription: true,
      showTechnologies: true,
      showAchievements: true,
      showMetrics: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "ecmsi-2",
      sectionId: "exp-cms-main",
      experienceId: "exp-2",
      displayOrder: 2,
      visible: true,
      isFeatured: false,
      showYear: true,
      showRole: true,
      showCompany: true,
      showDescription: true,
      showTechnologies: true,
      showAchievements: true,
      showMetrics: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

const defaultSelectedWorkCMS: SelectedWorkSectionCMSData = {
  id: "sw-cms-main",
  key: "SELECTED_WORK_MAIN",
  visible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [
    {
      id: "swcmsi-1",
      sectionId: "sw-cms-main",
      projectId: "proj-1",
      displayOrder: 1,
      visible: true,
      offset: "up",
      customNumber: "01",
      showOneLiner: true,
      showDescription: true,
      showTechnologies: true,
      showHighlights: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "swcmsi-2",
      sectionId: "sw-cms-main",
      projectId: "proj-2",
      displayOrder: 2,
      visible: true,
      offset: "down",
      customNumber: "02",
      showOneLiner: true,
      showDescription: true,
      showTechnologies: true,
      showHighlights: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

const defaultProjectShowcaseCMS: ProjectShowcaseSectionCMSData = {
  id: "ps-cms-main",
  key: "PROJECT_SHOWCASE_MAIN",
  visible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: [
    {
      id: "pscmsi-1",
      sectionId: "ps-cms-main",
      projectId: "proj-1",
      displayOrder: 1,
      visible: true,
      showDescription: true,
      showTechnologies: true,
      showViewAction: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "pscmsi-2",
      sectionId: "ps-cms-main",
      projectId: "proj-2",
      displayOrder: 2,
      visible: true,
      showDescription: true,
      showTechnologies: true,
      showViewAction: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

const defaultHeroNodesCMS: HeroNodeCMSData = {
  id: "hero-nodes-main",
  key: "HERO_NODES_MAIN",
  visible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  items: SKILL_CATALOG.map((node, index) => ({
    id: `hn-${node.id}`,
    nodeId: node.id,
    label: node.label,
    title: node.title,
    description: node.description,
    techStack: [...node.techStack],
    ctaLabel: node.cta.label,
    ctaHref: node.cta.href,
    image: node.image || null,
    displayOrder: index + 1,
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      activeModeId: "mode-1",
      modes: defaultModes,
      details: defaultDetails,
      projects: defaultProjects,
      experiences: defaultExperiences,
      sections: defaultSections,
      experienceMetrics: defaultExperienceMetrics,
      experienceAchievements: defaultExperienceAchievements,
      projectHighlights: defaultProjectHighlights,
      experienceCMS: defaultExperienceCMS,
      selectedWorkCMS: defaultSelectedWorkCMS,
      projectShowcaseCMS: defaultProjectShowcaseCMS,
      heroNodesCMS: defaultHeroNodesCMS,

      setActiveModeId: (id) => set({ activeModeId: id }),

      // Modes
      addMode: (modeData) =>
        set((state) => {
          const newMode: PortfolioMode = {
            ...modeData,
            id: `mode-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { modes: [...state.modes, newMode] };
        }),

      updateMode: (id, modeData) =>
        set((state) => ({
          modes: state.modes.map((m) =>
            m.id === id ? { ...m, ...modeData, updatedAt: new Date().toISOString() } : m
          ),
        })),

      deleteMode: (id) =>
        set((state) => ({
          modes: state.modes.filter((m) => m.id !== id),
          activeModeId:
            state.activeModeId === id
              ? state.modes.find((m) => m.id !== id)?.id || ""
              : state.activeModeId,
        })),

      // Details
      updateMyDetails: (detailsData) =>
        set((state) => ({
          details: {
            ...state.details,
            ...detailsData,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateMyDetailsModeContent: (portfolioModeId, content) =>
        set((state) => {
          const existing = state.details.modeContents || [];
          const idx = existing.findIndex(
            (c) => c.portfolioModeId === portfolioModeId
          );
          let newContents: MyDetailsModeContent[];

          if (idx >= 0) {
            newContents = [...existing];
            newContents[idx] = {
              ...newContents[idx],
              ...content,
              updatedAt: new Date().toISOString(),
            };
          } else {
            const newItem: MyDetailsModeContent = {
              id: `mdc-${Date.now()}`,
              myDetailsId: state.details.id,
              portfolioModeId,
              headline: content.headline || "",
              short_bio: content.short_bio || "",
              detailed_bio: content.detailed_bio || "",
              highlights: content.highlights || [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            newContents = [...existing, newItem];
          }

          return {
            details: {
              ...state.details,
              modeContents: newContents,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      // Projects
      addProject: (projectData) =>
        set((state) => {
          const newProject: Project = {
            ...projectData,
            id: `proj-${Date.now()}`,
            modeContents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { projects: [newProject, ...state.projects] };
        }),

      updateProject: (id, projectData) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...projectData, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      updateProjectModeContent: (projectId, portfolioModeId, content) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            const existing = p.modeContents || [];
            const idx = existing.findIndex(
              (c) => c.portfolioModeId === portfolioModeId
            );
            let newContents: ProjectModeContent[];

            if (idx >= 0) {
              newContents = [...existing];
              newContents[idx] = {
                ...newContents[idx],
                ...content,
                updatedAt: new Date().toISOString(),
              };
            } else {
              const newItem: ProjectModeContent = {
                id: `pmc-${Date.now()}`,
                projectId,
                portfolioModeId,
                project_description: content.project_description || "",
                project_highlights: content.project_highlights || [],
                project_user_count: content.project_user_count || 0,
                project_revenue: content.project_revenue || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              newContents = [...existing, newItem];
            }

            return {
              ...p,
              modeContents: newContents,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      // Experience
      addExperience: (expData) =>
        set((state) => {
          const newExp: Experience = {
            ...expData,
            id: `exp-${Date.now()}`,
            modeContents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { experiences: [newExp, ...state.experiences] };
        }),

      updateExperience: (id, expData) =>
        set((state) => ({
          experiences: state.experiences.map((e) =>
            e.id === id ? { ...e, ...expData, updatedAt: new Date().toISOString() } : e
          ),
        })),

      deleteExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        })),

      updateExperienceModeContent: (experienceId, portfolioModeId, content) =>
        set((state) => ({
          experiences: state.experiences.map((e) => {
            if (e.id !== experienceId) return e;
            const existing = e.modeContents || [];
            const idx = existing.findIndex(
              (c) => c.portfolioModeId === portfolioModeId
            );
            let newContents: ExperienceModeContent[];

            if (idx >= 0) {
              newContents = [...existing];
              newContents[idx] = {
                ...newContents[idx],
                ...content,
                updatedAt: new Date().toISOString(),
              };
            } else {
              const newItem: ExperienceModeContent = {
                id: `emc-${Date.now()}`,
                experienceId,
                portfolioModeId,
                experience_description: content.experience_description || "",
                experience_highlights: content.experience_highlights || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              newContents = [...existing, newItem];
            }

            return {
              ...e,
              modeContents: newContents,
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      // CMS Blocks Management
      updateBlock: (sectionKey, blockId, data) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              updatedAt: new Date().toISOString(),
              blocks: sec.blocks.map((blk) =>
                blk.id === blockId
                  ? { ...blk, ...data, updatedAt: new Date().toISOString() }
                  : blk
              ),
            };
          }),
        })),

      addBlock: (sectionKey, blockData) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            const newBlock: PortfolioBlockData = {
              ...blockData,
              id: `blk-${Date.now()}`,
              sectionId: sec.id,
              items: blockData.items || [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return {
              ...sec,
              updatedAt: new Date().toISOString(),
              blocks: [...sec.blocks, newBlock],
            };
          }),
        })),

      deleteBlock: (sectionKey, blockId) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              updatedAt: new Date().toISOString(),
              blocks: sec.blocks.filter((blk) => blk.id !== blockId),
            };
          }),
        })),

      reorderBlocks: (sectionKey, orderedBlocks) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              updatedAt: new Date().toISOString(),
              blocks: orderedBlocks,
            };
          }),
        })),

      // Block Item Management
      addBlockItem: (sectionKey, blockId, itemData) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                const newItem: PortfolioBlockItemData = {
                  ...itemData,
                  id: `item-${Date.now()}`,
                  blockId: blk.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                return {
                  ...blk,
                  items: [...(blk.items || []), newItem],
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }),
        })),

      updateBlockItem: (sectionKey, blockId, itemId, itemData) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                return {
                  ...blk,
                  items: (blk.items || []).map((itm) =>
                    itm.id === itemId
                      ? { ...itm, ...itemData, updatedAt: new Date().toISOString() }
                      : itm
                  ),
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }),
        })),

      deleteBlockItem: (sectionKey, blockId, itemId) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                return {
                  ...blk,
                  items: (blk.items || []).filter((itm) => itm.id !== itemId),
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }),
        })),

      reorderBlockItems: (sectionKey, blockId, items) =>
        set((state) => ({
          sections: state.sections.map((sec) => {
            if (sec.key !== sectionKey) return sec;
            return {
              ...sec,
              blocks: sec.blocks.map((blk) => {
                if (blk.id !== blockId) return blk;
                return {
                  ...blk,
                  items,
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }),
        })),

      // Factual Metric Actions
      addExperienceMetric: (metricData) =>
        set((state) => {
          const newMetric: ExperienceMetricData = {
            ...metricData,
            id: `em-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { experienceMetrics: [...state.experienceMetrics, newMetric] };
        }),

      updateExperienceMetric: (id, metricData) =>
        set((state) => ({
          experienceMetrics: state.experienceMetrics.map((m) =>
            m.id === id ? { ...m, ...metricData, updatedAt: new Date().toISOString() } : m
          ),
        })),

      deleteExperienceMetric: (id) =>
        set((state) => ({
          experienceMetrics: state.experienceMetrics.filter((m) => m.id !== id),
        })),

      // Factual Achievement Actions
      addExperienceAchievement: (achData) =>
        set((state) => {
          const newAch: ExperienceAchievementData = {
            ...achData,
            id: `ea-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { experienceAchievements: [...state.experienceAchievements, newAch] };
        }),

      updateExperienceAchievement: (id, achData) =>
        set((state) => ({
          experienceAchievements: state.experienceAchievements.map((a) =>
            a.id === id ? { ...a, ...achData, updatedAt: new Date().toISOString() } : a
          ),
        })),

      deleteExperienceAchievement: (id) =>
        set((state) => ({
          experienceAchievements: state.experienceAchievements.filter((a) => a.id !== id),
        })),

      // Factual Highlight Actions
      addProjectHighlight: (hlData) =>
        set((state) => {
          const newHl: ProjectHighlightData = {
            ...hlData,
            id: `ph-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { projectHighlights: [...state.projectHighlights, newHl] };
        }),

      updateProjectHighlight: (id, hlData) =>
        set((state) => ({
          projectHighlights: state.projectHighlights.map((h) =>
            h.id === id ? { ...h, ...hlData, updatedAt: new Date().toISOString() } : h
          ),
        })),

      deleteProjectHighlight: (id) =>
        set((state) => ({
          projectHighlights: state.projectHighlights.filter((h) => h.id !== id),
        })),

      // Experience Section CMS Actions
      updateExperienceCMS: (data) =>
        set((state) => ({
          experienceCMS: {
            ...state.experienceCMS,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })),

      addExperienceCMSItem: (itemData) =>
        set((state) => {
          const newItem: ExperienceSectionCMSItemData = {
            ...itemData,
            id: `ecmsi-${Date.now()}`,
            sectionId: state.experienceCMS.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            experienceCMS: {
              ...state.experienceCMS,
              items: [...state.experienceCMS.items, newItem],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateExperienceCMSItem: (id, itemData) =>
        set((state) => ({
          experienceCMS: {
            ...state.experienceCMS,
            items: state.experienceCMS.items.map((i) =>
              i.id === id ? { ...i, ...itemData, updatedAt: new Date().toISOString() } : i
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteExperienceCMSItem: (id) =>
        set((state) => ({
          experienceCMS: {
            ...state.experienceCMS,
            items: state.experienceCMS.items.filter((i) => i.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderExperienceCMSItems: (items) =>
        set((state) => ({
          experienceCMS: {
            ...state.experienceCMS,
            items,
            updatedAt: new Date().toISOString(),
          },
        })),

      // Selected Work Section CMS Actions
      updateSelectedWorkCMS: (data) =>
        set((state) => ({
          selectedWorkCMS: {
            ...state.selectedWorkCMS,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })),

      addSelectedWorkCMSItem: (itemData) =>
        set((state) => {
          const newItem: SelectedWorkSectionCMSItemData = {
            ...itemData,
            id: `swcmsi-${Date.now()}`,
            sectionId: state.selectedWorkCMS.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            selectedWorkCMS: {
              ...state.selectedWorkCMS,
              items: [...state.selectedWorkCMS.items, newItem],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateSelectedWorkCMSItem: (id, itemData) =>
        set((state) => ({
          selectedWorkCMS: {
            ...state.selectedWorkCMS,
            items: state.selectedWorkCMS.items.map((i) =>
              i.id === id ? { ...i, ...itemData, updatedAt: new Date().toISOString() } : i
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteSelectedWorkCMSItem: (id) =>
        set((state) => ({
          selectedWorkCMS: {
            ...state.selectedWorkCMS,
            items: state.selectedWorkCMS.items.filter((i) => i.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderSelectedWorkCMSItems: (items) =>
        set((state) => ({
          selectedWorkCMS: {
            ...state.selectedWorkCMS,
            items,
            updatedAt: new Date().toISOString(),
          },
        })),

      // Project Showcase Section CMS Actions
      updateProjectShowcaseCMS: (data) =>
        set((state) => ({
          projectShowcaseCMS: {
            ...state.projectShowcaseCMS,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })),

      addProjectShowcaseCMSItem: (itemData) =>
        set((state) => {
          const newItem: ProjectShowcaseSectionCMSItemData = {
            ...itemData,
            id: `pscmsi-${Date.now()}`,
            sectionId: state.projectShowcaseCMS.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            projectShowcaseCMS: {
              ...state.projectShowcaseCMS,
              items: [...state.projectShowcaseCMS.items, newItem],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateProjectShowcaseCMSItem: (id, itemData) =>
        set((state) => ({
          projectShowcaseCMS: {
            ...state.projectShowcaseCMS,
            items: state.projectShowcaseCMS.items.map((i) =>
              i.id === id ? { ...i, ...itemData, updatedAt: new Date().toISOString() } : i
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteProjectShowcaseCMSItem: (id) =>
        set((state) => ({
          projectShowcaseCMS: {
            ...state.projectShowcaseCMS,
            items: state.projectShowcaseCMS.items.filter((i) => i.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderProjectShowcaseCMSItems: (items) =>
        set((state) => ({
          projectShowcaseCMS: {
            ...state.projectShowcaseCMS,
            items,
            updatedAt: new Date().toISOString(),
          },
        })),

      // Hero Nodes Section CMS Actions
      updateHeroNodesCMS: (data) =>
        set((state) => ({
          heroNodesCMS: {
            ...state.heroNodesCMS,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })),

      addHeroNodeCMSItem: (itemData) =>
        set((state) => {
          const newItem: HeroNodeCMSItemData = {
            ...itemData,
            id: `hncmsi-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            heroNodesCMS: {
              ...state.heroNodesCMS,
              items: [...(state.heroNodesCMS?.items || []), newItem],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateHeroNodeCMSItem: (id, itemData) =>
        set((state) => ({
          heroNodesCMS: {
            ...state.heroNodesCMS,
            items: (state.heroNodesCMS?.items || []).map((i) =>
              i.id === id ? { ...i, ...itemData, updatedAt: new Date().toISOString() } : i
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteHeroNodeCMSItem: (id) =>
        set((state) => ({
          heroNodesCMS: {
            ...state.heroNodesCMS,
            items: (state.heroNodesCMS?.items || []).filter((i) => i.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderHeroNodeCMSItems: (items) =>
        set((state) => ({
          heroNodesCMS: {
            ...state.heroNodesCMS,
            items,
            updatedAt: new Date().toISOString(),
          },
        })),
    }),
    {
      name: "portfolio-admin-storage",
    }
  )
);



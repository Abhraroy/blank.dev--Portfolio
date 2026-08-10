import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding Factual Domain Data & Section CMS Composition...");

  // 1. Seed Factual Projects
  const jwelProject = await prisma.project.upsert({
    where: { slug: "the-jwel" },
    update: {},
    create: {
      project_name: "THE JWEL",
      slug: "the-jwel",
      project_image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      project_url: "https://thejwel.com",
      project_github: "https://github.com/blankdev/the-jwel",
      project_tags: ["Ecommerce", "Next.js", "Full-Stack"],
      project_tech: ["Next.js", "Supabase", "PostgreSQL", "Cloudflare", "Razorpay"],
      project_status: "ACTIVE",
      project_type: "CLIENT_WORK",
      project_visibility_status: "PUBLIC",
      highlights: {
        create: [
          { content: "REVENUE PLATFORM", order: 1, visible: true },
          { content: "ADVANCED SEARCH", order: 2, visible: true },
          { content: "META CAPI", order: 3, visible: true },
          { content: "ADMIN DASHBOARD", order: 4, visible: true },
        ],
      },
    },
  });

  const aiChatbotProject = await prisma.project.upsert({
    where: { slug: "ai-chatbot" },
    update: {},
    create: {
      project_name: "AI Chatbot",
      slug: "ai-chatbot",
      project_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      project_url: "https://ai.blankdev.studio",
      project_github: "https://github.com/blankdev/ai-chatbot",
      project_tags: ["AI", "RAG", "Python"],
      project_tech: ["Python", "OpenAI", "RAG", "Vector DB", "Next.js"],
      project_status: "COMPLETED",
      project_type: "SIDE_PROJECT",
      project_visibility_status: "PUBLIC",
      highlights: {
        create: [
          { content: "RAG PIPELINE", order: 1, visible: true },
          { content: "CONTEXT MEMORY", order: 2, visible: true },
          { content: "LOW LATENCY", order: 3, visible: true },
          { content: "SUPPORT DEFLECT", order: 4, visible: true },
        ],
      },
    },
  });

  // 2. Seed Selected Work CMS
  await prisma.selectedWorkSectionCMS.upsert({
    where: { key: "SELECTED_WORK_MAIN" },
    update: {},
    create: {
      key: "SELECTED_WORK_MAIN",
      visible: true,
      items: {
        create: [
          {
            projectId: jwelProject.id,
            displayOrder: 1,
            visible: true,
            offset: "up",
            customNumber: "01",
            showOneLiner: true,
            showDescription: true,
            showTechnologies: true,
            showHighlights: true,
          },
          {
            projectId: aiChatbotProject.id,
            displayOrder: 2,
            visible: true,
            offset: "down",
            customNumber: "02",
            showOneLiner: true,
            showDescription: true,
            showTechnologies: true,
            showHighlights: true,
          },
        ],
      },
    },
  });

  // 3. Seed Project Showcase CMS
  await prisma.projectShowcaseSectionCMS.upsert({
    where: { key: "PROJECT_SHOWCASE_MAIN" },
    update: {},
    create: {
      key: "PROJECT_SHOWCASE_MAIN",
      visible: true,
      items: {
        create: [
          {
            projectId: jwelProject.id,
            displayOrder: 1,
            visible: true,
            showDescription: true,
            showTechnologies: true,
            showViewAction: true,
          },
          {
            projectId: aiChatbotProject.id,
            displayOrder: 2,
            visible: true,
            showDescription: true,
            showTechnologies: true,
            showViewAction: true,
          },
        ],
      },
    },
  });

  // 4. Seed Factual Experience & Metrics
  const experience1 = await prisma.experience.create({
    data: {
      company_name: "BlankDev Studio",
      role_title: "AI Engineering & Systems",
      employment_type: "FULL_TIME",
      location: "Remote",
      start_date: new Date("2025-01-01"),
      currently_working: true,
      metrics: {
        create: [
          { label: "PIPELINES", value: "8+", order: 1, visible: true },
          { label: "MODELS", value: "12", order: 2, visible: true },
          { label: "LATENCY CUT", value: "40%", order: 3, visible: true },
        ],
      },
      achievements: {
        create: [
          { content: "Designed retrieval pipelines for grounded responses", order: 1, visible: true },
          { content: "Shipped AI-assisted features with measurable UX gains", order: 2, visible: true },
          { content: "Hardened prompts, evals, and failure handling", order: 3, visible: true },
        ],
      },
    },
  });

  // 5. Seed Experience CMS
  await prisma.experienceSectionCMS.upsert({
    where: { key: "EXPERIENCE_MAIN" },
    update: {},
    create: {
      key: "EXPERIENCE_MAIN",
      defaultActiveId: experience1.id,
      visible: true,
      items: {
        create: [
          {
            experienceId: experience1.id,
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
          },
        ],
      },
    },
  });

  console.log("Successfully seeded domain facts & CMS sections!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

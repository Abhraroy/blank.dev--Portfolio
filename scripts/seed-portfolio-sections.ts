import { prisma } from "../lib/prisma";

async function seedPortfolioSections() {

  console.log("Seeding CMS Portfolio Sections & Blocks...");

  const aboutSection = await prisma.portfolioSection.upsert({
    where: { key: "ABOUT" },
    update: {},
    create: {
      key: "ABOUT",
      title: "About Me",
      visible: true,
      order: 1,
      blocks: {
        create: [
          // Block 1: Top Hero
          {
            blockNumber: 1,
            type: "HERO",
            label: "ABOUT ME",
            heading: "blankdev",
            subheading: "FULL-STACK ENGINEER",
            description:
              "Building interactive products with clarity and craft. I design and ship web experiences that feel alive — from 3D portfolio surfaces to production APIs.",
            ctaText: "GET IN TOUCH",
            ctaUrl: "/#contact",
            ctaType: "LINK",
            ctaVisible: true,
          },
          // Block 2: Row 2 Left
          {
            blockNumber: 2,
            type: "CARD",
            label: "FOCUS",
            heading: "Product engineering",
            description: "Interfaces, APIs, and the space between.",
          },
          // Block 3: Row 2 Right
          {
            blockNumber: 3,
            type: "CARD",
            label: "EXPERIENCE",
            heading: "4+ yrs",
            description: "Shipping for web & startups",
          },
          // Block 4: Row 3 Left
          {
            blockNumber: 4,
            type: "CARD",
            label: "STACK",
            heading: "Next · TS · Node",
            description: "Prisma · Three · Postgres",
          },
          // Block 5: Row 3 Center
          {
            blockNumber: 5,
            type: "CARD",
            label: "BASED",
            heading: "Remote",
            description: "Open to collab worldwide",
          },
          // Block 6: Row 3 Right
          {
            blockNumber: 6,
            type: "CARD",
            label: "STATUS",
            heading: "Available",
            description: "Select freelance & full-time",
          },
          // Block 7: Right Side Profile Panel
          {
            blockNumber: 7,
            type: "PROFILE",
            heading: "AR",
            imageAlt: "Profile Avatar",
          },
        ],
      },
    },
  });

  console.log("Successfully seeded Portfolio Section:", aboutSection.key);
}

seedPortfolioSections()
  .catch((e) => {
    console.error("Error seeding portfolio sections:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

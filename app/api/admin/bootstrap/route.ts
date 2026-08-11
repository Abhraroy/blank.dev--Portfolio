import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      modes,
      details,
      projects,
      experiences,
      aboutSection,
      experienceCMS,
      selectedWorkCMS,
      projectShowcaseCMS,
      heroNodesCMS,
      mobileHeroSkills,
    ] = await Promise.all([
      prisma.portfolioMode.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.myDetails.findFirst({ include: { modeContents: true } }),
      prisma.project.findMany({
        include: {
          modeContents: true,
          highlights: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.experience.findMany({
        include: {
          modeContents: true,
          metrics: { orderBy: { order: "asc" } },
          achievements: { orderBy: { order: "asc" } },
        },
        orderBy: { start_date: "desc" },
      }),
      prisma.portfolioSection.findUnique({
        where: { key: "ABOUT" },
        include: {
          blocks: {
            include: { items: { orderBy: { order: "asc" } } },
            orderBy: { blockNumber: "asc" },
          },
        },
      }),
      prisma.experienceSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.selectedWorkSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.projectShowcaseSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.heroSectionCMS.findFirst({
        include: { items: { orderBy: { displayOrder: "asc" } } },
      }),
      prisma.mobileHeroSkill.findMany({
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    return NextResponse.json({
      modes,
      details,
      projects,
      experiences,
      sections: aboutSection ? [aboutSection] : [],
      experienceCMS,
      selectedWorkCMS,
      projectShowcaseCMS,
      heroNodesCMS,
      mobileHeroSkills,
    });
  } catch (error: any) {
    console.error("GET /api/admin/bootstrap error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

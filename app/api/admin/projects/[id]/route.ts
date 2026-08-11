import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        modeContents: true,
        highlights: { orderBy: { order: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("GET /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { modeContent, highlights, ...projectFields } = body;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(projectFields.project_name !== undefined && { project_name: projectFields.project_name }),
        ...(projectFields.slug !== undefined && { slug: projectFields.slug }),
        ...(projectFields.project_image !== undefined && { project_image: projectFields.project_image }),
        ...(projectFields.project_images !== undefined && { project_images: projectFields.project_images }),
        ...(projectFields.project_videos !== undefined && { project_videos: projectFields.project_videos }),
        ...(projectFields.project_url !== undefined && { project_url: projectFields.project_url }),
        ...(projectFields.project_github !== undefined && { project_github: projectFields.project_github }),
        ...(projectFields.project_md_url !== undefined && { project_md_url: projectFields.project_md_url }),
        ...(projectFields.project_tags !== undefined && { project_tags: projectFields.project_tags }),
        ...(projectFields.project_tech !== undefined && { project_tech: projectFields.project_tech }),
        ...(projectFields.project_status !== undefined && { project_status: projectFields.project_status }),
        ...(projectFields.project_type !== undefined && { project_type: projectFields.project_type }),
        ...(projectFields.project_visibility_status !== undefined && {
          project_visibility_status: projectFields.project_visibility_status,
        }),
      },
    });

    // Handle ProjectModeContent upsert if provided
    if (modeContent && modeContent.portfolioModeId) {
      await prisma.projectModeContent.upsert({
        where: {
          projectId_portfolioModeId: {
            projectId: id,
            portfolioModeId: modeContent.portfolioModeId,
          },
        },
        update: {
          project_description: modeContent.project_description || null,
          project_highlights: modeContent.project_highlights || [],
          project_user_count: modeContent.project_user_count ?? null,
          project_revenue: modeContent.project_revenue ?? null,
        },
        create: {
          projectId: id,
          portfolioModeId: modeContent.portfolioModeId,
          project_description: modeContent.project_description || null,
          project_highlights: modeContent.project_highlights || [],
          project_user_count: modeContent.project_user_count ?? null,
          project_revenue: modeContent.project_revenue ?? null,
        },
      });
    }

    // Handle Highlights replacement if provided
    if (Array.isArray(highlights)) {
      await prisma.projectHighlight.deleteMany({ where: { projectId: id } });
      if (highlights.length > 0) {
        await prisma.projectHighlight.createMany({
          data: highlights.map((h: string | { content: string; order?: number }, idx: number) => ({
            projectId: id,
            content: typeof h === "string" ? h : h.content,
            order: typeof h === "object" && h.order !== undefined ? h.order : idx + 1,
            visible: true,
          })),
        });
      }
    }

    const fullProject = await prisma.project.findUnique({
      where: { id },
      include: {
        modeContents: true,
        highlights: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(fullProject);
  } catch (error: any) {
    console.error("PUT /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("DELETE /api/admin/projects/[id] error:", error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

import fs from "fs/promises";
import path from "path";
import {
  getProjectBySlug,
  SELECTED_PROJECTS,
  type SelectedProject,
} from "@/components/SelectedWork/selectedWork.config";

/**
 * Reads the markdown content for a given project slug from `content/projects/[slug].md`.
 * If the file does not exist, generates a structured markdown fallback.
 */
export async function getProjectMarkdown(slug: string): Promise<string> {
  const project = getProjectBySlug(slug);
  const filePath = path.join(process.cwd(), "content", "projects", `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent;
  } catch {
    if (!project) {
      return `# Project Not Found\n\nThe requested project \`${slug}\` could not be located.`;
    }

    // Generate fallback Markdown content from project config fields
    return `# ${project.name} — ${project.oneLiner}

> **Role:** ${project.role || "Developer"}  
> **Period:** ${project.period || "Recent"}  
> **Category:** ${project.category || "Software Project"}

---

## Executive Overview

${project.oneLiner}

---

## Challenge

${project.challenge}

---

## Solution

${project.solution}

---

## Impact & Key Outcomes

${project.impact}

---

## Technical Highlights

${project.technicalHighlights.map((item) => `- ${item}`).join("\n")}

---

## Tech Stack

${project.techStack.map((t) => `\`${t}\``).join(" • ")}
`;
  }
}

/**
 * Returns all projects combined from static config and optionally DB if needed.
 */
export async function getAllProjects(): Promise<SelectedProject[]> {
  return SELECTED_PROJECTS;
}

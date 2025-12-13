import type { Prisma } from "@prisma/client";

type ModuleSection = {
  title: string;
  content: string;
};

type ModuleMetadata = {
  order?: number;
  estimatedTime?: number;
  isPublished?: boolean;
  stage?: string;
};

export type AcademyModuleContent = {
  lecture?: string;
  objectives?: string[];
  sections?: ModuleSection[];
  resources?: string[];
  metadata?: ModuleMetadata;
  layout?: Record<string, unknown>;
  [key: string]: unknown;
};

export function normalizeModuleContent(
  content: Prisma.JsonValue | null | undefined,
): Required<Pick<AcademyModuleContent, "lecture" | "objectives" | "sections" | "resources" | "metadata" | "layout">> {
  let parsed: Record<string, unknown> | null = null;

  if (!content) {
    parsed = null;
  } else if (typeof content === "string") {
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }
  } else if (typeof content === "object") {
    parsed = content as Record<string, unknown>;
  }

  const lecture = typeof parsed?.lecture === "string" ? parsed.lecture : "";
  const objectives = Array.isArray(parsed?.objectives) ? (parsed.objectives as string[]) : [];
  const sections = Array.isArray(parsed?.sections)
    ? (parsed.sections as ModuleSection[])
    : [];
  const resources = Array.isArray(parsed?.resources) ? (parsed.resources as string[]) : [];
  const metadata = (parsed?.metadata as ModuleMetadata) ?? {};
  const layout = (parsed?.layout as Record<string, unknown>) ?? {};

  return { lecture, objectives, sections, resources, metadata, layout };
}

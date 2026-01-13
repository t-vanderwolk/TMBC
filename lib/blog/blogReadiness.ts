import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const isMissingBlogTables = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  return (
    error.code === "P2021" &&
    typeof error.meta?.table === "string" &&
    error.meta.table.startsWith("public.Blog")
  );
};

export const logMissingBlogTable = (error: Prisma.PrismaClientKnownRequestError) => {
  const missingTable = typeof error.meta?.table === "string" ? error.meta.table : "unknown";
  console.warn("BLOG_DB_NOT_READY", { missingTable, code: "P2021" });
};

export const handleMissingBlogTable = (error: unknown) => {
  if (!isMissingBlogTables(error)) {
    return false;
  }

  logMissingBlogTable(error);
  return true;
};

export const BLOG_DB_UNAVAILABLE_HEADING = "Blog database tables not ready";

export const BLOG_DB_UNAVAILABLE_DETAILS = [
  "Blog controls are temporarily disabled while database migrations are repaired.",
  "No content has been lost. Publishing will resume once the system is stable.",
];

export const isBlogFeatureEnabled = () => process.env.BLOG_ENABLED === "true";

const BLOG_TABLE_CHECK = "BlogPost";

export type BlogReadinessStatus = {
  blogDbReady: boolean;
};

export async function getBlogReadiness(): Promise<BlogReadinessStatus> {
  if (!isBlogFeatureEnabled()) {
    return { blogDbReady: false };
  }

  const [record] = (await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename = ${BLOG_TABLE_CHECK}
    ) AS exists;
  `) ?? [];

  return {
    blogDbReady: Boolean(record?.exists),
  };
}

export function isPrismaBlogSchemaError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message ?? "";

  return (
    message.includes("P2021") ||
    message.includes("does not exist") ||
    message.includes("P2022") ||
    message.includes("column") ||
    message.includes("BlogPost.")
  );
}

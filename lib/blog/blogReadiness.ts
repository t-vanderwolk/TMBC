import { Prisma } from "@prisma/client";

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

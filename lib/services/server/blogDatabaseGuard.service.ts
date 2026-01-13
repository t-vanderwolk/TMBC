import type { Prisma } from "@prisma/client";

export const isBlogTableMissingError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
  typeof error === "object" &&
  error !== null &&
  (error as Prisma.PrismaClientKnownRequestError).code === "P2021";

export const logMissingBlogTable = (error: Prisma.PrismaClientKnownRequestError) => {
  const missingTable = typeof error.meta?.table === "string" ? error.meta.table : "unknown";
  console.warn("BLOG_DB_NOT_READY", { missingTable, code: "P2021" });
};

export const handleMissingBlogTable = (error: unknown) => {
  if (!isBlogTableMissingError(error)) {
    return false;
  }
  logMissingBlogTable(error);
  return true;
};

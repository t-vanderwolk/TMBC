/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `AcademyModule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AcademyModule" ADD COLUMN     "journey" TEXT,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AcademyModule_slug_key" ON "AcademyModule"("slug");

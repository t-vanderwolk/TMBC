/*
  Warnings:

  - The `journey` column on the `AcademyModule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `slug` on table `AcademyModule` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AcademyJourney" AS ENUM ('gear', 'nursery', 'postpartum');

-- AlterTable
ALTER TABLE "AcademyModule" DROP COLUMN "journey",
ADD COLUMN     "journey" "AcademyJourney" NOT NULL DEFAULT 'nursery',
ALTER COLUMN "slug" SET NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;

-- DropForeignKey
ALTER TABLE "WorkbookEntry" DROP CONSTRAINT "WorkbookEntry_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "WorkbookEntry" DROP CONSTRAINT "WorkbookEntry_userId_fkey";

-- AlterTable
ALTER TABLE "WorkbookEntry" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "WorkbookEntry_user_module_type_unique" RENAME TO "WorkbookEntry_userId_moduleId_type_key";

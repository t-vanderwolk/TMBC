-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "createdByEmail" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

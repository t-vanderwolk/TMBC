-- ===============================
-- PLAN WORKSPACE HOTFIX (ADDITIVE)
-- ===============================

CREATE TABLE IF NOT EXISTS "PlanRegistrySection" (
  "id" TEXT PRIMARY KEY,
  "registryId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sectionKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "PlanRegistryItem" (
  "id" TEXT PRIMARY KEY,
  "sectionId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "priceMin" INTEGER,
  "priceMax" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlanRegistryItem_sectionId_fkey"
    FOREIGN KEY ("sectionId")
    REFERENCES "PlanRegistrySection"("id")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "PlanBudget" (
  "id" TEXT PRIMARY KEY,
  "registryId" TEXT NOT NULL,
  "total" INTEGER,
  "allocatedTotal" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "PlanBudget_registryId_key"
  ON "PlanBudget"("registryId");

CREATE TABLE IF NOT EXISTS "PlanBudgetCategory" (
  "id" TEXT PRIMARY KEY,
  "budgetId" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "allocated" INTEGER NOT NULL,
  CONSTRAINT "PlanBudgetCategory_budgetId_fkey"
    FOREIGN KEY ("budgetId")
    REFERENCES "PlanBudget"("id")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "PlanMentorNote" (
  "id" TEXT PRIMARY KEY,
  "registryId" TEXT NOT NULL,
  "contextType" TEXT NOT NULL,
  "contextId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "authorRole" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CommunitySignal" (
  "id" TEXT PRIMARY KEY,
  "registryId" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "sourceCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

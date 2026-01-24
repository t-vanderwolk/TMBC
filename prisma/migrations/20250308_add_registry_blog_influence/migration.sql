CREATE TABLE "RegistryItemBlogInfluence" (
  "id" TEXT NOT NULL,
  "postSlug" TEXT NOT NULL,
  "registryItemId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "RegistryItemBlogInfluence_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RegistryItemBlogInfluence_registryItemId_fkey"
    FOREIGN KEY ("registryItemId")
    REFERENCES "RegistryItem"("id")
    ON DELETE CASCADE
);

CREATE INDEX "RegistryItemBlogInfluence_postSlug_idx"
  ON "RegistryItemBlogInfluence"("postSlug");
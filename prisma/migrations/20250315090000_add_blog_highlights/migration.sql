CREATE TYPE "BlogHighlightEventType" AS ENUM ('CLICK');

CREATE TABLE "BlogHighlight" (
  "id" TEXT NOT NULL,
  "blogPostId" TEXT NOT NULL,
  "productId" TEXT,
  "brandName" TEXT,
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BlogHighlight_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BlogHighlight_blogPostId_fkey"
    FOREIGN KEY ("blogPostId")
    REFERENCES "BlogPost"("id")
    ON DELETE CASCADE,
  CONSTRAINT "BlogHighlight_productId_fkey"
    FOREIGN KEY ("productId")
    REFERENCES "Product"("id")
);

CREATE INDEX "BlogHighlight_blogPostId_idx" ON "BlogHighlight"("blogPostId");
CREATE INDEX "BlogHighlight_productId_idx" ON "BlogHighlight"("productId");
CREATE INDEX "BlogHighlight_brandName_idx" ON "BlogHighlight"("brandName");

CREATE TABLE "BlogHighlightEvent" (
  "id" TEXT NOT NULL,
  "blogPostId" TEXT NOT NULL,
  "highlightId" TEXT NOT NULL,
  "event" "BlogHighlightEventType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BlogHighlightEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BlogHighlightEvent_blogPostId_fkey"
    FOREIGN KEY ("blogPostId")
    REFERENCES "BlogPost"("id")
    ON DELETE CASCADE,
  CONSTRAINT "BlogHighlightEvent_highlightId_fkey"
    FOREIGN KEY ("highlightId")
    REFERENCES "BlogHighlight"("id")
    ON DELETE CASCADE
);

CREATE INDEX "BlogHighlightEvent_blogPostId_idx" ON "BlogHighlightEvent"("blogPostId");
CREATE INDEX "BlogHighlightEvent_highlightId_idx" ON "BlogHighlightEvent"("highlightId");
CREATE INDEX "BlogHighlightEvent_event_idx" ON "BlogHighlightEvent"("event");
CREATE INDEX "BlogHighlightEvent_createdAt_idx" ON "BlogHighlightEvent"("createdAt");

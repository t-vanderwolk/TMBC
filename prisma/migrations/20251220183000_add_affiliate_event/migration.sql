CREATE TABLE "AffiliateEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "affiliateName" TEXT NOT NULL,
  "affiliateType" TEXT NOT NULL,
  "network" TEXT NOT NULL,
  "merchantId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "payoutValue" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "AffiliateEvent_userId_affiliateName_key" ON "AffiliateEvent"("userId", "affiliateName");

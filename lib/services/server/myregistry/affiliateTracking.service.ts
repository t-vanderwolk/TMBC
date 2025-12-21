"use server";

import { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";
import { MYREGISTRY_CANON, MYREGISTRY_SIGNUP_COMPLETED } from "@/lib/constants/affiliateCanon";

export async function trackMyRegistrySignup(userId: string) {
  const affiliateName = MYREGISTRY_CANON.name;
  await prisma.$executeRaw`
    INSERT INTO "AffiliateEvent" (
      "id",
      "userId",
      "affiliateName",
      "affiliateType",
      "network",
      "merchantId",
      "eventType",
      "payoutValue",
      "createdAt"
    ) VALUES (
      ${randomUUID()},
      ${userId},
      ${affiliateName},
      ${MYREGISTRY_CANON.type},
      ${MYREGISTRY_CANON.network},
      ${MYREGISTRY_CANON.merchantId},
      ${MYREGISTRY_SIGNUP_COMPLETED},
      ${MYREGISTRY_CANON.payoutValue},
      NOW()
    )
    ON CONFLICT ("userId", "affiliateName") DO UPDATE
      SET
        "affiliateType" = EXCLUDED."affiliateType",
        "network" = EXCLUDED."network",
        "merchantId" = EXCLUDED."merchantId",
        "eventType" = EXCLUDED."eventType",
        "payoutValue" = EXCLUDED."payoutValue";
  `;
}

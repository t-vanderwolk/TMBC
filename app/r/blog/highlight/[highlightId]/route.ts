import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { buildAffiliateLink } from "@/lib/services/server/affiliate.service";

type RouteContext = {
  params: { highlightId: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taylormadebaby.co";

export async function GET(request: Request, context: RouteContext) {
  const highlight = await prisma.blogHighlight.findUnique({
    where: { id: context.params.highlightId },
    include: {
      blogPost: { select: { slug: true, id: true } },
      product: {
        include: {
          affiliateLinks: { orderBy: { isPrimary: "desc" } },
        },
      },
    },
  });

  if (!highlight) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const fallbackUrl = `${siteUrl}/blog/${highlight.blogPost.slug}`;
  let destinationUrl = fallbackUrl;

  if (highlight.product?.affiliateLinks.length) {
    const affiliate = highlight.product.affiliateLinks[0];
    destinationUrl = buildAffiliateLink({
      url: affiliate.outboundUrl,
      merchant: highlight.product.brand ?? affiliate.retailerName,
    });
  }

  void prisma.blogHighlightEvent
    .create({
      data: {
        blogPostId: highlight.blogPost.id,
        highlightId: highlight.id,
        event: "CLICK",
      },
    })
    .catch((error) => {
      console.warn("[blog highlight] failed to track click", error);
    });

  return NextResponse.redirect(new URL(destinationUrl, request.url));
}

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { decodeAffiliateDestination } from '@/lib/services/server/affiliateLinkMetadata';

type Params = { affiliateLinkId: string };

export async function GET(
  _request: Request,
  { params }: { params: Params },
) {
  const affiliateLinkId = params?.affiliateLinkId;
  if (!affiliateLinkId) {
    return new NextResponse(null, { status: 404 });
  }

  const link = await prisma.blogAffiliateLink.findUnique({
    where: { id: affiliateLinkId },
    select: {
      id: true,
      destinationUrl: true,
      blogPostId: true,
    },
  });

  const destination = link?.destinationUrl
    ? decodeAffiliateDestination(link.destinationUrl)
    : null;
  if (!destination?.url || destination.status === 'PAUSED') {
    return new NextResponse(null, { status: 404 });
  }

  if (link) {
    void (async () => {
      try {
        await prisma.blogAffiliateEvent.create({
          data: {
            event: 'CLICK',
            blogPostId: link.blogPostId,
            affiliateLinkId: link.id,
          },
        });
      } catch (error) {
        console.warn('Unable to log affiliate click', error);
      }
    })();
  }

  const response = NextResponse.redirect(destination.url, 302);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

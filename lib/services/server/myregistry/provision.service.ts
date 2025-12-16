import { User } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { emitRegistryAnalytics } from '../analytics.service';
import { MyRegistryAutomation, MyRegistryAccount } from './auto.service';

export const REGISTRY_SOURCE = 'MYREGISTRY';

export const ensureMyRegistryAccount = async (user: User): Promise<MyRegistryAccount | null> => {
  if (!MyRegistryAutomation.isConfigured()) {
    return null;
  }

  if (user.myRegistryUserId && user.myRegistryRegistryId) {
    return null;
  }

  const [firstName, ...rest] = (user.name ?? '').trim().split(' ');
  const lastName = rest.join(' ') || 'Parent';
  const creation = await MyRegistryAutomation.createUserAndRegistry({
    email: user.email,
    firstName: firstName || 'Member',
    lastName,
    city: user.location ?? undefined,
  });

  const title = user.name || 'TMBC Registry';
  const [registry] = await prisma.$transaction([
    prisma.registry.upsert({
      where: { userId: user.id },
      update: {
        myRegistryId: creation.myRegistryRegistryId,
        title,
        source: REGISTRY_SOURCE,
      },
      create: {
        userId: user.id,
        myRegistryId: creation.myRegistryRegistryId,
        title,
        source: REGISTRY_SOURCE,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        myRegistryUserId: creation.myRegistryUserId,
        myRegistryRegistryId: creation.myRegistryRegistryId,
        myRegistryAccessToken: creation.credentials.accessToken,
        myRegistryRefreshToken: creation.credentials.refreshToken,
        myRegistryTokenExpires: creation.credentials.expiresAt,
        myRegistryCreatedAt: creation.createdAt,
        myRegistryEmail: creation.myRegistryEmail,
      },
    }),
  ]);

  emitRegistryAnalytics('registry_created', {
    userId: user.id,
    registryId: registry.id,
    myRegistryId: registry.myRegistryId,
  });

  return creation;
};

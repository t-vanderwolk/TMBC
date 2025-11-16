import { Prisma, RegistryStatus } from '@prisma/client';

import { prisma } from '../utils/prisma';
import { buildAffiliateLink, buildAffiliateUrl } from './affiliate.service';
import {
  MyRegistryResponse,
  addGift,
  isConnected,
  removeMyRegistryGift,
  updateMyRegistryGift,
} from './myRegistry.service';
import { ProductResponse, productToResponse } from './product.service';

export type MentorNoteResponse = {
  id: string;
  note: string;
  mentorId: string;
  mentorName: string | null;
  productId: string;
  createdAt: string;
};

export type RegistryItemResponse = {
  id: string;
  productId: string | null;
  quantity: number;
  status: RegistryStatus;
  notes: string | null;
  purchaseSource: string | null;
  myRegistryId: string | null;
  affiliateUrl: string;
  product: ProductResponse;
  mentorNotes: MentorNoteResponse[];
  isCustom: boolean;
};

type RegistryItemWithProduct = Prisma.RegistryItemGetPayload<{
  include: { product: true };
}>;

const createProductPayload = (item: RegistryItemWithProduct): ProductResponse => {
  if (item.product) {
    return productToResponse(item.product);
  }

  return {
    id: `custom-${item.id}`,
    name: item.title,
    brand: item.merchant || 'Custom Item',
    category: item.category || 'custom',
    imageUrl: item.image || '',
    affiliateUrl: item.url,
    merchant: item.merchant || 'Custom',
    moduleCodes: item.moduleCode ? [item.moduleCode] : [],
    price: item.price ?? null,
    inStock: true,
  };
};

const formatItem = (
  item: RegistryItemWithProduct,
  mentorNotesLookup: Map<string, MentorNoteResponse[]>,
  mentorRef?: string,
): RegistryItemResponse => {
  const mentorNotes = item.productId ? mentorNotesLookup.get(item.productId) ?? [] : [];
  const merchant = item.merchant || item.product?.merchant;

  const affiliateUrl = mentorRef
    ? buildAffiliateUrl({ url: item.url, merchant, mentorRef })
    : item.url;

  return {
    id: item.id,
    productId: item.productId ?? null,
    quantity: item.quantity,
    status: item.status,
    notes: item.notes,
    purchaseSource: item.purchaseSource,
    myRegistryId: item.myRegistryId,
    affiliateUrl,
    product: createProductPayload(item),
    mentorNotes,
    isCustom: item.isCustom,
  };
};

const hydrateMentorNotes = async (userId: string, productIds: (string | null)[]) => {
  const ids = productIds.filter((id): id is string => Boolean(id));
  if (!ids.length) {
    return new Map<string, MentorNoteResponse[]>();
  }

  const notes = await prisma.mentorNote.findMany({
    where: {
      memberId: userId,
      productId: { in: ids },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      mentor: { select: { id: true, name: true } },
    },
  });

  const grouped = new Map<string, MentorNoteResponse[]>();
  for (const note of notes) {
    if (!grouped.has(note.productId)) {
      grouped.set(note.productId, []);
    }
    grouped.get(note.productId)!.push({
      id: note.id,
      note: note.note,
      mentorId: note.mentorId,
      mentorName: note.mentor.name || null,
      productId: note.productId,
      createdAt: note.createdAt.toISOString(),
    });
  }

  return grouped;
};

export const listRegistryItems = async (userId: string, mentorRef?: string) => {
  const items = await prisma.registryItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });

  const mentorNotesLookup = await hydrateMentorNotes(
    userId,
    items.map((item) => item.productId ?? null),
  );

  return items.map((item) => formatItem(item, mentorNotesLookup, mentorRef));
};

type AddRegistryItemInput = {
  userId: string;
  productId: string;
  quantity?: number;
  notes?: string;
  status?: RegistryStatus;
  mentorRef?: string;
};

const syncMyRegistryAdd = async (userId: string, item: RegistryItemWithProduct) => {
  if (!(await isConnected(userId))) return null;

  try {
    const giftId = await addGift({
      userId,
      title: item.title,
      url: item.url,
      price: item.price ?? item.product?.price ?? null,
      image: item.image ?? item.product?.imageUrl ?? null,
    });

    if (giftId) {
      await prisma.registryItem.update({
        where: { id: item.id },
        data: { myRegistryId: giftId },
      });

      item.myRegistryId = giftId;
      return { success: true, operation: 'AddGift', data: { giftId } } satisfies MyRegistryResponse;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MyRegistry add failed', error);
  }

  return null;
};

export const addRegistryItem = async ({
  userId,
  productId,
  quantity = 1,
  notes,
  status = RegistryStatus.NEEDED,
  mentorRef,
}: AddRegistryItemInput) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error('Product not found');
  }

  const affiliateUrl = buildAffiliateUrl({ url: product.affiliateUrl, merchant: product.merchant });

  const item = await prisma.registryItem.create({
    data: {
      userId,
      productId,
      isCustom: false,
      title: product.name,
      url: affiliateUrl,
      merchant: product.merchant,
      category: product.category,
      moduleCode: product.moduleCodes[0] ?? null,
      image: product.imageUrl,
      price: product.price,
      quantity,
      notes,
      status,
    },
    include: { product: true },
  });

  const myRegistryResponse = await syncMyRegistryAdd(userId, item);
  const mentorLookup = await hydrateMentorNotes(userId, [productId]);

  return {
    item: formatItem(item, mentorLookup, mentorRef),
    myRegistryResponse,
  };
};

type AddCustomItemInput = {
  userId: string;
  title: string;
  url: string;
  merchant?: string | null;
  price?: number | null;
  image?: string | null;
  category?: string | null;
  moduleCode?: string | null;
};

export const addCustomItem = async ({
  userId,
  title,
  url,
  merchant,
  price,
  image,
  category,
  moduleCode,
}: AddCustomItemInput) => {
  const affiliateUrl = buildAffiliateUrl({ url, merchant });

  let myRegistryId: string | null = null;
  if (await isConnected(userId)) {
    try {
      const giftId = await addGift({
        userId,
        title,
        url: affiliateUrl,
        price: price ?? null,
        image: image ?? null,
      });
      myRegistryId = giftId;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('MyRegistry custom add failed', error);
    }
  }

  const created = await prisma.registryItem.create({
    data: {
      userId,
      isCustom: true,
      title,
      url: affiliateUrl,
      merchant,
      category,
      moduleCode,
      image,
      price,
      status: RegistryStatus.ACTIVE,
      myRegistryId,
    },
    include: { product: true },
  });

  return formatItem(created, new Map(), undefined);
};

type UpdateRegistryItemInput = {
  itemId: string;
  userId: string;
  quantity?: number;
  notes?: string | null;
  status?: RegistryStatus;
  purchaseSource?: string | null;
  mentorRef?: string;
};

export const updateRegistryItem = async ({
  itemId,
  userId,
  quantity,
  notes,
  status,
  purchaseSource,
  mentorRef,
}: UpdateRegistryItemInput) => {
  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, userId },
    include: { product: true },
  });

  if (!item) {
    throw new Error('Registry item not found');
  }

  const updated = await prisma.registryItem.update({
    where: { id: itemId },
    data: {
      quantity,
      notes,
      status,
      purchaseSource,
    },
    include: { product: true },
  });

  if (updated.myRegistryId && (await isConnected(userId))) {
    try {
      const affiliateUrl = updated.product
        ? buildAffiliateLink(updated.product, mentorRef)
        : buildAffiliateUrl({ url: updated.url, merchant: updated.merchant, mentorRef });

      await updateMyRegistryGift({
        giftId: updated.myRegistryId,
        quantity: updated.quantity,
        notes: updated.notes,
        affiliateUrl,
        status: updated.status,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('MyRegistry update failed', error);
    }
  }

  const mentorLookup = await hydrateMentorNotes(userId, [updated.productId ?? null]);
  return formatItem(updated, mentorLookup, mentorRef);
};

export const removeRegistryItem = async (itemId: string, userId: string) => {
  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!item) {
    throw new Error('Registry item not found');
  }

  await prisma.registryItem.delete({ where: { id: itemId } });

  if (item.myRegistryId && (await isConnected(userId))) {
    try {
      await removeMyRegistryGift({ giftId: item.myRegistryId });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('MyRegistry remove failed', error);
    }
  }

  return { success: true };
};

type MentorNoteInput = {
  memberId: string;
  mentorId: string;
  productId: string;
  note: string;
};

export const createMentorNote = async ({ memberId, mentorId, productId, note }: MentorNoteInput) => {
  const mentorNote = await prisma.mentorNote.create({
    data: {
      memberId,
      mentorId,
      productId,
      note,
    },
    include: {
      mentor: { select: { id: true, name: true } },
    },
  });

  return {
    id: mentorNote.id,
    memberId,
    mentorId,
    productId,
    note: mentorNote.note,
    mentorName: mentorNote.mentor.name || null,
    createdAt: mentorNote.createdAt.toISOString(),
  };
};

export const listMentorNotes = async (memberId: string) => {
  const notes = await prisma.mentorNote.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
    include: { mentor: { select: { id: true, name: true } }, product: true },
  });

  return notes.map((note) => ({
    id: note.id,
    note: note.note,
    mentorId: note.mentorId,
    mentorName: note.mentor.name || null,
    productId: note.productId,
    product: productToResponse(note.product!),
    createdAt: note.createdAt.toISOString(),
  }));
};

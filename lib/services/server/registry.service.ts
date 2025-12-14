import { Prisma, RegistryStatus, AffiliateNetwork, AffiliatePartner } from '@prisma/client';

import crypto from 'crypto';

import { prisma } from '@/lib/prisma';
import { buildAffiliateLink, buildAffiliateUrl } from './affiliate.service';
import {
  MyRegistryResponse,
  addGift,
  isConnected,
  removeMyRegistryGift,
  updateMyRegistryGift,
} from './myRegistryLegacy.service';
import { ProductResponse, productToResponse } from './product.service';
import { RecommendationsResult } from '@/lib/utils/server/recommendations';
import { MyRegistryService } from './myregistry/myregistry.service';
import { emitRegistryAnalytics } from './analytics.service';

export type MentorNoteResponse = {
  id: string;
  note: string;
  mentorId: string;
  mentorName: string | null;
  productId: string | null;
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
    const noteKey = note.productId;
    if (!noteKey) {
      continue;
    }
    if (!grouped.has(noteKey)) {
      grouped.set(noteKey, []);
    }
    grouped.get(noteKey)!.push({
      id: note.id,
      note: note.content,
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
  productId?: string | null;
  note: string;
};

export const createMentorNote = async ({ memberId, mentorId, productId, note }: MentorNoteInput) => {
  const mentorNote = await prisma.mentorNote.create({
    data: {
      memberId,
      mentorId,
      productId: productId ?? undefined,
      content: note,
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
    note: mentorNote.content,
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
    note: note.content,
    mentorId: note.mentorId,
    mentorName: note.mentor.name || null,
    productId: note.productId,
    product: productToResponse(note.product!),
    createdAt: note.createdAt.toISOString(),
  }));
};

type SuggestedRegistryItem = {
  id: string;
  title: string;
  category: string | null;
  notes: string | null;
  status: RegistryStatus;
};

export const seedRegistryFromOnboarding = async (
  userId: string,
  recommendations: RecommendationsResult,
): Promise<SuggestedRegistryItem[]> => {
  const buckets: { items: string[]; category: string }[] = [
    { items: recommendations.strollers, category: 'Strollers' },
    { items: recommendations.carSeats, category: 'Car Seats' },
    { items: recommendations.nursery, category: 'Nursery' },
    { items: recommendations.travel, category: 'Travel' },
  ];

  const created: SuggestedRegistryItem[] = [];
  const seen = new Set<string>();

  for (const bucket of buckets) {
    for (const label of bucket.items) {
      if (!label || seen.has(label)) {
        continue;
      }
      seen.add(label);

      const item = await prisma.registryItem.create({
        data: {
          userId,
          isCustom: true,
          title: label,
          url: 'https://taylormadebabyco.com/registry',
          merchant: 'Taylor-Made Baby Co.',
          category: bucket.category,
          moduleCode: 'onboarding',
          status: RegistryStatus.NEEDED,
          notes: 'Suggested from onboarding recommendations',
          purchaseSource: 'recommendation',
        },
      });

      created.push({
        id: item.id,
        title: item.title,
        category: item.category,
        notes: item.notes,
        status: item.status,
      });
    }
  }

  return created;
};

export const getRegistrySummary = async (userId: string) => {
  const suggestedCount = await prisma.registryItem.count({
    where: {
      userId,
      purchaseSource: 'recommendation',
    },
  });

  const confirmedCount = await prisma.registryItem.count({
    where: {
      userId,
      status: RegistryStatus.PURCHASED,
    },
  });

  return {
    suggestedCount,
    confirmedCount,
  };
};

const REGISTRY_SOURCE = 'MYREGISTRY';
const MY_REGISTRY_PARTNER_ID = '88335';

type RemoteRegistryItem = {
  id: string;
  name: string;
  brand?: string;
  merchant?: string;
  category?: string | null;
  quantity?: number | null;
  price?: number | null;
  imageUrl?: string | null;
  affiliateUrl?: string | null;
  affiliateId?: string | null;
  notes?: string | null;
  status?: string | null;
  raw?: Record<string, unknown>;
};

type RemoteRegistryEntry = {
  id: string;
  title: string | null;
  items: RemoteRegistryItem[];
  shippingAddress?: Record<string, unknown>;
  raw?: Record<string, unknown>;
};

export type RegistryShippingAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  raw?: Record<string, unknown>;
};

export type MentorFeedbackDto = {
  id: string;
  mentorId: string;
  mentorName: string | null;
  note: string;
  createdAt: string;
};

export type RegistryItemDto = {
  id: string;
  registryId: string | null;
  externalGiftId: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  price: number | null;
  quantity: number | null;
  imageUrl: string | null;
  affiliateLink: string | null;
  affiliatePartner: {
    id: string;
    name: string;
    network: AffiliateNetwork;
  } | null;
  mentorNotes: MentorFeedbackDto[];
  status: RegistryStatus;
  notes: string | null;
  source: string;
  myRegistryId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RegistryDto = {
  id: string;
  myRegistryId: string;
  title: string | null;
  source: string;
  lastSyncedAt: string | null;
  shippingAddress: RegistryShippingAddress | null;
  items: RegistryItemDto[];
};

const normalizeText = (value?: string | null) =>
  (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

const toRegistryStatus = (value?: string | null): RegistryStatus => {
  if (!value) return RegistryStatus.ACTIVE;
  const normalized = value.toUpperCase();
  if (Object.values(RegistryStatus).includes(normalized as RegistryStatus)) {
    return normalized as RegistryStatus;
  }
  if (normalized.includes('PURCHASED')) return RegistryStatus.PURCHASED;
  if (normalized.includes('RESERVE')) return RegistryStatus.RESERVED;
  if (normalized.includes('NEED')) return RegistryStatus.NEEDED;
  return RegistryStatus.ACTIVE;
};

const findAffiliateId = (item: Record<string, unknown>) => {
  for (const key of Object.keys(item)) {
    const normalized = key.toLowerCase();
    if (!normalized.includes('id') || normalized.includes('url')) continue;
    if (normalized.includes('partner') || normalized.includes('affiliate')) {
      const value = item[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
      if (typeof value === 'number') return String(value);
    }
  }
  return null;
};

const normalizeRemoteItem = (item: Record<string, unknown>): RemoteRegistryItem | null => {
  const idValue = item.giftId ?? item.GiftId ?? item.itemId ?? item.ItemId ?? item.id ?? item.externalGiftId;
  const id = idValue ? String(idValue).trim() : '';
  if (!id) return null;

  const quantityCandidate = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity ?? 0);
  const priceCandidate = typeof item.price === 'number' ? item.price : Number(item.price ?? 0);
  const imageCandidate = item.imageUrl ?? item.ImageUrl ?? item.image ?? item.Image;
  const affiliateCandidate = item.affiliateUrl ?? item.AffiliateUrl ?? item.url ?? item.Url;
  const categoryValue = item.category ?? item.Category ?? item.productCategory;

  return {
    id,
    name: String(item.productName || item.ProductName || item.ItemName || item.title || 'Registry item'),
    brand: item.brand ? String(item.brand) : item.merchant ? String(item.merchant) : undefined,
    merchant: item.merchant ? String(item.merchant) : undefined,
    category: categoryValue ? String(categoryValue) : null,
    quantity: Number.isFinite(quantityCandidate) ? Number(quantityCandidate) : null,
    price: Number.isFinite(priceCandidate) ? Number(priceCandidate) : null,
    imageUrl: imageCandidate ? String(imageCandidate) : null,
    affiliateUrl: affiliateCandidate ? String(affiliateCandidate) : null,
    affiliateId: findAffiliateId(item),
    notes: (item.notes || item.Notes) as string | null,
    status: (item.status || item.Status) as string | null,
    raw: item,
  };
};

const extractRegistryItems = (entry: Record<string, unknown>): RemoteRegistryItem[] => {
  const candidates = entry.Items || entry.items || entry.Gifts || entry.gifts || entry.data || [];
  if (!Array.isArray(candidates)) return [];
  return candidates
    .map((item) => normalizeRemoteItem(item as Record<string, unknown>))
    .filter((item): item is RemoteRegistryItem => Boolean(item));
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

const recordsFrom = (value: unknown): Record<string, unknown>[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((record) => asRecord(record))
      .filter((entry): entry is Record<string, unknown> => Boolean(entry));
  }
  const record = asRecord(value);
  return record ? [record] : [];
};

const normalizeRegistryEntry = (entry: Record<string, unknown>): RemoteRegistryEntry | null => {
  const idValue = entry.RegistryId ?? entry.registryId ?? entry.id ?? entry.RegistryUserId;
  const id = idValue ? String(idValue).trim() : '';
  if (!id) return null;

  const shippingAddressRaw = entry.ShippingAddress ?? entry.Address ?? entry.address;
  const shippingAddressRecord = asRecord(shippingAddressRaw);

  const titleValue = entry.RegistryName ?? entry.name ?? entry.Title;
  const normalizedTitle = titleValue ? String(titleValue) : null;

  return {
    id,
    title: normalizedTitle,
    items: extractRegistryItems(entry),
    shippingAddress: shippingAddressRecord ?? undefined,
    raw: entry,
  };
};

const extractRegistryEntries = (payload: unknown): RemoteRegistryEntry[] => {
  if (!payload) return [];
  const candidates: Record<string, unknown>[] = [];
  candidates.push(...recordsFrom(payload));

  const root = asRecord(payload);
  if (root) {
    for (const key of ['Registries', 'registries', 'Registry', 'registry']) {
      candidates.push(...recordsFrom(root[key]));
    }
    const nestedData = asRecord(root.data);
    if (nestedData) {
      for (const key of ['Registries', 'registries', 'Registry', 'registry']) {
        candidates.push(...recordsFrom(nestedData[key]));
      }
    }
  }

  return candidates
    .map((entry) => normalizeRegistryEntry(entry))
    .filter((entry): entry is RemoteRegistryEntry => Boolean(entry));
};

const parseShippingAddressPayload = (payload: Record<string, unknown> | null | undefined): RegistryShippingAddress | null => {
  if (!payload) return null;
  const address: RegistryShippingAddress = {
    line1: (payload.Address1 || payload.Line1 || payload.Street || payload.Street1) as string | undefined,
    line2: (payload.Address2 || payload.Line2 || payload.Street2) as string | undefined,
    city: (payload.City || payload.Town) as string | undefined,
    state: (payload.State || payload.Region) as string | undefined,
    postalCode: (payload.PostalCode || payload.Zip || payload.ZipCode) as string | undefined,
    country: (payload.Country || payload.CountryCode) as string | undefined,
    raw: payload,
  };
  if (!address.line1 && !address.city && !address.state && !address.postalCode && !address.country) {
    return null;
  }
  return address;
};

const buildAffiliateMaps = (partners: AffiliatePartner[]) => {
  const byId = new Map<string, AffiliatePartner>();
  const byName = new Map<string, AffiliatePartner>();
  partners.forEach((partner) => {
    byId.set(partner.id, partner);
    const normalized = normalizeText(partner.name);
    if (normalized) {
      byName.set(normalized, partner);
    }
  });
  return { byId, byName };
};

const resolveAffiliatePartner = (
  remote: RemoteRegistryItem,
  byId: Map<string, AffiliatePartner>,
  byName: Map<string, AffiliatePartner>,
) => {
  if (remote.affiliateId && byId.has(remote.affiliateId)) {
    return byId.get(remote.affiliateId)!;
  }

  const brand = remote.brand ?? remote.merchant;
  if (brand) {
    const normalizedBrand = normalizeText(brand);
    if (normalizedBrand && byName.has(normalizedBrand)) {
      return byName.get(normalizedBrand)!;
    }
  }

  if (byId.has(MY_REGISTRY_PARTNER_ID)) {
    return byId.get(MY_REGISTRY_PARTNER_ID)!;
  }

  return null;
};

const formatRegistryItemDto = (
  item: Prisma.RegistryItemGetPayload<{
    include: {
      affiliate: true;
      mentorFeedback: { include: { mentor: { select: { id: true; name: true } } } };
    };
  }>,
): RegistryItemDto => {
  const mentorNotes =
    item.mentorFeedback?.map((feedback) => ({
      id: feedback.id,
      mentorId: feedback.mentorId,
      mentorName: feedback.mentor?.name || null,
      note: feedback.message,
      createdAt: feedback.createdAt.toISOString(),
    })) ?? [];

  return {
    id: item.id,
    registryId: item.registryId ?? null,
    externalGiftId: item.externalGiftId ?? null,
    name: item.name ?? item.title,
    brand: item.brand ?? item.merchant ?? null,
    category: item.category ?? null,
    price: item.price ?? null,
    quantity: item.quantity ?? null,
    imageUrl: item.imageUrl ?? item.image ?? null,
    affiliateLink: item.affiliateLink ?? null,
    affiliatePartner: item.affiliate
      ? { id: item.affiliate.id, name: item.affiliate.name, network: item.affiliate.network }
      : null,
    mentorNotes,
    status: item.status,
    notes: item.notes ?? null,
    source: item.source,
    myRegistryId: item.myRegistryId ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
};

export const getMemberRegistryState = async (userId: string): Promise<RegistryDto | null> => {
  const registry = await prisma.registry.findUnique({
    where: { userId },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          affiliate: true,
          mentorFeedback: { include: { mentor: { select: { id: true, name: true } } } },
        },
      },
    },
  });

  if (!registry) return null;

  const items = registry.items.map((item) => formatRegistryItemDto(item));

  return {
    id: registry.id,
    myRegistryId: registry.myRegistryId,
    title: registry.title,
    source: registry.source,
    lastSyncedAt: registry.lastSyncedAt?.toISOString() ?? null,
    shippingAddress: parseShippingAddressPayload(registry.shippingAddress as Record<string, unknown> | null),
    items,
  };
};

export const createMemberRegistry = async (userId: string): Promise<RegistryDto> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const [firstName, ...rest] = (user.name ?? '').split(' ');
  const lastName = rest.join(' ') || 'Parent';
  const payload = {
    Email: user.email,
    Password: crypto.randomBytes(12).toString('hex'),
    FirstName: firstName || 'Member',
    LastName: lastName,
    City: user.location || undefined,
  };

  const response = await MyRegistryService.signupUser(payload);
  if (!response?.myRegistryUserId) {
    throw new Error('Unable to create MyRegistry account');
  }

  const registry = await prisma.registry.upsert({
    where: { userId },
    update: {
      myRegistryId: response.myRegistryUserId,
      title: user.name,
      source: REGISTRY_SOURCE,
    },
    create: {
      userId,
      myRegistryId: response.myRegistryUserId,
      title: user.name,
      source: REGISTRY_SOURCE,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      myRegistryUserId: response.myRegistryUserId,
      myRegistryEmail: response.email || user.email,
    },
  });

  emitRegistryAnalytics('registry_created', {
    userId,
    registryId: registry.id,
    myRegistryId: registry.myRegistryId,
  });

  const state = await getMemberRegistryState(userId);
  if (!state) throw new Error('Unable to load registry after creation');
  return state;
};

export const syncMemberRegistry = async (userId: string): Promise<RegistryDto> => {
  const [user, registry] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.registry.findUnique({ where: { userId } }),
  ]);
  if (!user) throw new Error('User not found');
  if (!registry) throw new Error('Registry not created yet');

  const email = user.myRegistryEmail || user.email;
  const payload = await MyRegistryService.searchRegistries({ Email: email });
  const entries = extractRegistryEntries(payload);
  const target = entries.find((entry) => entry.id === registry.myRegistryId) ?? entries[0];
  if (!target) throw new Error('Unable to locate registry in MyRegistry');

  let shippingAddress: Record<string, unknown> | undefined;
  try {
    shippingAddress = (await MyRegistryService.getShippingAddress({ RegistryId: target.id })) as Record<string, unknown>;
  } catch {
    // ignore shipping address failures
  }

  const partners = await prisma.affiliatePartner.findMany();
  const { byId, byName } = buildAffiliateMaps(partners);
  const existingItems = await prisma.registryItem.findMany({
    where: { registryId: registry.id },
    select: { id: true, status: true, externalGiftId: true },
  });
  const existingMap = new Map(existingItems.map((item) => [item.externalGiftId, item]));

  const seenIds = new Set<string>();
  for (const remoteItem of target.items) {
    seenIds.add(remoteItem.id);
    const partner = resolveAffiliatePartner(remoteItem, byId, byName);
    const upsertData = {
      userId,
      registryId: registry.id,
      externalGiftId: remoteItem.id,
      name: remoteItem.name,
      title: remoteItem.name,
      url: remoteItem.affiliateUrl ?? (remoteItem.raw?.Url as string) ?? '',
      brand: remoteItem.brand ?? remoteItem.merchant ?? null,
      merchant: remoteItem.merchant ?? remoteItem.brand ?? null,
      category: remoteItem.category ?? null,
      price: remoteItem.price ?? null,
      quantity: remoteItem.quantity ?? 1,
      image: remoteItem.imageUrl ?? null,
      imageUrl: remoteItem.imageUrl ?? null,
      affiliateId: partner?.id ?? null,
      affiliateLink: remoteItem.affiliateUrl ?? partner?.defaultLink ?? null,
      source: REGISTRY_SOURCE,
      myRegistryId: remoteItem.id,
      notes: remoteItem.notes ?? null,
      status: toRegistryStatus(remoteItem.status),
      purchaseSource: REGISTRY_SOURCE,
    };

    const saved = await prisma.registryItem.upsert({
      where: {
        registryId_externalGiftId: {
          registryId: registry.id,
          externalGiftId: remoteItem.id,
        },
      },
      create: upsertData,
      update: upsertData,
    });

    const previous = existingMap.get(remoteItem.id);
    if (!previous) {
      emitRegistryAnalytics('gift_added', {
        userId,
        registryId: registry.id,
        registryItemId: saved.id,
        externalGiftId: remoteItem.id,
      });
    } else if (previous.status !== RegistryStatus.PURCHASED && upsertData.status === RegistryStatus.PURCHASED) {
      emitRegistryAnalytics('gift_purchased', {
        userId,
        registryId: registry.id,
        registryItemId: saved.id,
        externalGiftId: remoteItem.id,
      });
    }

    if (partner) {
      emitRegistryAnalytics('partner_attribution', {
        userId,
        registryId: registry.id,
        registryItemId: saved.id,
        affiliatePartnerId: partner.id,
      });
    }
  }

  const removedIds = existingItems
    .filter((item) => item.externalGiftId && !seenIds.has(item.externalGiftId))
    .map((item) => item.id);
  if (removedIds.length) {
    await prisma.registryItem.updateMany({
      where: { id: { in: removedIds } },
      data: { status: RegistryStatus.REMOVED_REMOTE },
    });
  }

  const mergedShippingAddress =
    (shippingAddress ?? registry.shippingAddress ?? undefined) as
      | Prisma.InputJsonValue
      | Prisma.NullableJsonNullValueInput
      | undefined;

  await prisma.registry.update({
    where: { id: registry.id },
    data: {
      lastSyncedAt: new Date(),
      title: target.title ?? registry.title,
      shippingAddress: mergedShippingAddress,
    },
  });

  const state = await getMemberRegistryState(userId);
  if (!state) throw new Error('Unable to load registry after sync');
  return state;
};

export const resolveRegistryOutboundLink = async (userId: string, itemId: string): Promise<string> => {
  const item = await prisma.registryItem.findFirst({
    where: { id: itemId, userId },
    select: { affiliateLink: true },
  });

  if (!item?.affiliateLink) {
    throw new Error('Affiliate link is unavailable for this item.');
  }

  emitRegistryAnalytics('affiliate_click', {
    userId,
    itemId,
    affiliateLink: item.affiliateLink,
  });
  return item.affiliateLink;
};

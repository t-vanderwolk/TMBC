import {
  AffiliateNetwork,
  AffiliatePartner,
  Prisma,
  RegistryItemStatus,
  RegistrySection,
} from '@prisma/client';

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
import { ensureMyRegistryAccount, REGISTRY_SOURCE } from './myregistry/provision.service';
import { recordPurchaseForWatch } from './priceIntelligence.service';

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
  status: RegistryItemStatus;
  section: RegistrySection;
  notes: string | null;
  purchaseSource: string | null;
  myRegistryId: string | null;
  affiliateUrl: string;
  product: ProductResponse;
  mentorNotes: MentorNoteResponse[];
  affiliatePartner: {
    id: string;
    name: string;
    network: AffiliateNetwork;
  } | null;
  title?: string;
  merchant?: string | null;
  category?: string | null;
  image?: string | null;
  price?: number | null;
};

type RegistryItemWithProduct = Prisma.RegistryItemGetPayload<{
  include: {
    product: {
      include: { affiliateLinks: true };
    };
    affiliate: true;
  };
}>;

const createProductPayload = (item: RegistryItemWithProduct): ProductResponse => {
  if (item.product) {
    return productToResponse(item.product);
  }

  return {
    id: `custom-${item.id}`,
    name: item.title ?? 'Custom item',
    brand: item.brand ?? 'Custom Item',
    category: item.category || 'custom',
    imageUrl: item.imageUrl ?? item.image ?? '',
    affiliateUrl: item.url ?? 'https://taylor-madebaby.com',
    merchant: item.merchant ?? 'Custom',
    price: item.price ?? null,
  };
};

const CUSTOM_PRODUCT_ID = 'custom-item';

const ensureCustomProduct = async () => {
  await prisma.product.upsert({
    where: { id: CUSTOM_PRODUCT_ID },
    create: {
      id: CUSTOM_PRODUCT_ID,
      name: 'Custom registry item',
      category: 'custom',
      brand: 'Taylor-Made Baby Co.',
      description: 'Placeholder product for custom registry items.',
      notes: 'Custom items created through the registry.',
    },
    update: {
      name: 'Custom registry item',
      category: 'custom',
      brand: 'Taylor-Made Baby Co.',
      description: 'Placeholder product for custom registry items.',
      notes: 'Custom items created through the registry.',
    },
  });
  return CUSTOM_PRODUCT_ID;
};

const DEFAULT_SECTION = RegistrySection.GEAR;

const inferSectionFromCategory = (category?: string | null): RegistrySection => {
  if (!category) {
    return DEFAULT_SECTION;
  }
  const normalized = category.toLowerCase();
  if (normalized.includes('nursery')) {
    return RegistrySection.NURSERY;
  }
  if (
    normalized.includes('feed') ||
    normalized.includes('bottle') ||
    normalized.includes('breast') ||
    normalized.includes('feeding')
  ) {
    return RegistrySection.FEEDING;
  }
  if (normalized.includes('postpartum') || normalized.includes('healing') || normalized.includes('wellness')) {
    return RegistrySection.POSTPARTUM;
  }
  if (normalized.includes('later')) {
    return RegistrySection.LATER;
  }
  return RegistrySection.GEAR;
};

const resolveSection = (category?: string | null, explicit?: RegistrySection | null) =>
  explicit ?? inferSectionFromCategory(category);

const formatItem = (
  item: RegistryItemWithProduct,
  mentorNotesLookup: Map<string, MentorNoteResponse[]>,
  mentorRef?: string,
): RegistryItemResponse => {
  const mentorNotes = item.productId ? mentorNotesLookup.get(item.productId) ?? [] : [];
  const productPayload = createProductPayload(item);
  const baseUrl = item.url ?? productPayload.affiliateUrl;
  const affiliateUrl = mentorRef
    ? buildAffiliateUrl({ url: baseUrl, merchant: productPayload.merchant, mentorRef })
    : baseUrl;

  const affiliatePartner = item.affiliate
    ? { id: item.affiliate.id, name: item.affiliate.name, network: item.affiliate.network }
    : null;

  return {
    id: item.id,
    productId: item.productId ?? null,
    quantity: item.quantity ?? 1,
    status: item.status,
    section: item.section,
    notes: item.notes,
    purchaseSource: item.purchaseSource,
    myRegistryId: item.myRegistryId,
    affiliateUrl,
    product: productPayload,
    mentorNotes,
    title: item.title ?? productPayload.name,
    merchant: item.merchant ?? productPayload.merchant,
    category: item.category ?? productPayload.category,
    image: item.imageUrl ?? item.image ?? productPayload.imageUrl,
    price: item.price ?? productPayload.price ?? null,
    affiliatePartner,
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
    include: {
      product: {
        include: { affiliateLinks: true },
      },
      affiliate: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  const mentorNotesLookup = await hydrateMentorNotes(
    userId,
    items.map((item) => item.productId ?? null),
  );

  return items.map((item) => formatItem(item, mentorNotesLookup, mentorRef));
};

type RegistryItemCreateInput = {
  userId: string;
  productId: string;
  quantity?: number;
  notes?: string;
  status?: RegistryItemStatus;
  section: RegistrySection;
  mentorRef?: string;
};

const syncMyRegistryAdd = async (userId: string, item: RegistryItemWithProduct) => {
  if (!(await isConnected(userId))) return null;

  try {
    const giftId = await addGift({
      userId,
      title: item.title ?? 'Registry item',
      url: item.url ?? 'https://taylor-madebaby.com/registry',
      price: item.price ?? null,
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
  status = RegistryItemStatus.ADDED,
  section,
  mentorRef,
}: RegistryItemCreateInput) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { affiliateLinks: true },
  });
  if (!product) {
    throw new Error('Product not found');
  }

  const productPayload = productToResponse(product);
  const resolvedSection = resolveSection(product.category, section);
  const baseAffiliateUrl = productPayload.affiliateUrl;

  const item = await prisma.registryItem.create({
    data: {
      userId,
      productId,
      title: product.name,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      image: product.imageUrl,
      url: baseAffiliateUrl,
      affiliateLink: baseAffiliateUrl,
      merchant: productPayload.merchant,
      quantity,
      notes,
      status,
      section: resolvedSection,
    },
    include: {
      product: {
        include: { affiliateLinks: true },
      },
      affiliate: true,
    },
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
  section?: RegistrySection;
};

export const addCustomItem = async ({
  userId,
  title,
  url,
  merchant,
  price,
  image,
  category,
  section,
}: AddCustomItemInput) => {
  const affiliateUrl = buildAffiliateUrl({ url, merchant });
  const resolvedSection = resolveSection(category, section);

  const customProductId = await ensureCustomProduct();

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
      productId: customProductId,
      title,
      url: affiliateUrl,
      affiliateLink: affiliateUrl,
      merchant,
      category,
      image,
      imageUrl: image,
      price,
      status: RegistryItemStatus.ADDED,
      section: resolvedSection,
      myRegistryId,
    },
    include: {
      product: {
        include: { affiliateLinks: true },
      },
      affiliate: true,
    },
  });

  return formatItem(created, new Map(), undefined);
};

type UpdateRegistryItemInput = {
  itemId: string;
  userId: string;
  quantity?: number;
  notes?: string | null;
  status?: RegistryItemStatus;
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
    include: {
      product: {
        include: { affiliateLinks: true },
      },
    },
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
    include: {
      product: {
        include: { affiliateLinks: true },
      },
      affiliate: true,
    },
  });

  if (item.status !== RegistryItemStatus.PURCHASED && updated.status === RegistryItemStatus.PURCHASED) {
    await recordPurchaseForWatch(updated.id);
  }

  if (updated.myRegistryId && (await isConnected(userId))) {
    try {
      const productPayload = updated.product ? productToResponse(updated.product) : null;
      const affiliateUrl = productPayload
        ? buildAffiliateLink(
            { url: productPayload.affiliateUrl, merchant: productPayload.merchant },
            mentorRef,
          )
        : buildAffiliateUrl({
            url: updated.url ?? 'https://taylor-madebaby.com/registry',
            merchant: updated.merchant ?? undefined,
            mentorRef,
          });

      await updateMyRegistryGift({
        giftId: updated.myRegistryId,
        quantity: updated.quantity ?? 1,
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
    include: {
      mentor: { select: { id: true, name: true } },
      product: { include: { affiliateLinks: true } },
    },
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
  status: RegistryItemStatus;
};

export const seedRegistryFromOnboarding = async (
  _userId: string,
  _recommendations: RecommendationsResult,
): Promise<SuggestedRegistryItem[]> => {
  // TMBC Canon:
  // Onboarding informs mentors.
  // Registry items are NEVER auto-created.
  console.warn('[registry] seedRegistryFromOnboarding is disabled');
  return [];
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
      status: RegistryItemStatus.PURCHASED,
    },
  });

  return {
    suggestedCount,
    confirmedCount,
  };
};

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

const REMOTE_PRODUCT_PREFIX = 'myregistry';

const buildRemoteProductId = (remoteItem: RemoteRegistryItem) => `${REMOTE_PRODUCT_PREFIX}-${remoteItem.id}`;

const ensureRemoteProduct = async (remoteItem: RemoteRegistryItem) => {
  const productId = buildRemoteProductId(remoteItem);
  await prisma.product.upsert({
    where: { id: productId },
    create: {
      id: productId,
      name: remoteItem.name,
      category: remoteItem.category ?? 'legacy',
      brand: remoteItem.brand ?? remoteItem.merchant ?? undefined,
      description: remoteItem.notes ?? undefined,
      notes: remoteItem.notes ?? undefined,
      imageUrl: remoteItem.imageUrl ?? undefined,
    },
    update: {
      name: remoteItem.name,
      category: remoteItem.category ?? 'legacy',
      brand: remoteItem.brand ?? remoteItem.merchant ?? undefined,
      description: remoteItem.notes ?? undefined,
      notes: remoteItem.notes ?? undefined,
      imageUrl: remoteItem.imageUrl ?? undefined,
    },
  });
  return productId;
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

export type RegistryDto = {
  id: string;
  myRegistryId: string;
  title: string | null;
  source: string;
  lastSyncedAt: string | null;
  shippingAddress: RegistryShippingAddress | null;
  items: RegistryItemResponse[];
};

const normalizeText = (value?: string | null) =>
  (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();

const toRegistryStatus = (value?: string | null): RegistryItemStatus => {
  if (!value) {
    return RegistryItemStatus.ADDED;
  }
  const normalized = value.toUpperCase();
  if (normalized.includes('PURCHASED')) {
    return RegistryItemStatus.PURCHASED;
  }
  if (normalized.includes('REMOVED')) {
    return RegistryItemStatus.REMOVED;
  }
  return RegistryItemStatus.ADDED;
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

export const getMemberRegistryState = async (userId: string): Promise<RegistryDto | null> => {
  const registry = await prisma.registry.findUnique({
    where: { userId },
  });

  if (!registry) return null;

  const items = await listRegistryItems(userId);

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

  await ensureMyRegistryAccount(user);

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
  if (!registry.myRegistryId) throw new Error('Registry has not been linked to MyRegistry');

  const payload = await MyRegistryService.getRegistryItems({ RegistryId: registry.myRegistryId });
  const entries = extractRegistryEntries(payload);
  const target = entries.find((entry) => entry.id === registry.myRegistryId) ?? entries[0];
  if (!target) throw new Error('Unable to load registry from MyRegistry');

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
    select: { id: true, status: true, myRegistryItemId: true, externalGiftId: true },
  });
  const existingMap = new Map<string, { id: string; status: RegistryItemStatus }>();
  existingItems.forEach((item) => {
    const key = item.myRegistryItemId ?? item.externalGiftId;
    if (key) {
      existingMap.set(key, { id: item.id, status: item.status });
    }
  });

  const seenIds = new Set<string>();
  for (const remoteItem of target.items ?? []) {
    const remoteId = remoteItem.id;
    if (!remoteId) continue;
    seenIds.add(remoteId);
    const partner = resolveAffiliatePartner(remoteItem, byId, byName);
    const productId = await ensureRemoteProduct(remoteItem);
    const upsertData = {
      userId,
      productId,
      registryId: registry.id,
      externalGiftId: remoteId,
      myRegistryItemId: remoteId,
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
      myRegistryId: remoteId,
      notes: remoteItem.notes ?? null,
      status: toRegistryStatus(remoteItem.status),
      section: resolveSection(remoteItem.category ?? null),
      purchaseSource: REGISTRY_SOURCE,
    };

    const existingEntry = await prisma.registryItem.findFirst({
      where: {
        registryId: registry.id,
        externalGiftId: remoteId,
      },
      select: { id: true },
    });
    const saved = existingEntry
      ? await prisma.registryItem.update({ where: { id: existingEntry.id }, data: upsertData })
      : await prisma.registryItem.create({ data: upsertData });

    const previous = existingMap.get(remoteId);
    if (!previous) {
      emitRegistryAnalytics('gift_added', {
        userId,
        registryId: registry.id,
        registryItemId: saved.id,
        externalGiftId: remoteId,
      });
    } else if (
      previous.status !== RegistryItemStatus.PURCHASED &&
      upsertData.status === RegistryItemStatus.PURCHASED
    ) {
      emitRegistryAnalytics('gift_purchased', {
        userId,
        registryId: registry.id,
        registryItemId: saved.id,
        externalGiftId: remoteId,
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
    .filter((item) => {
      const key = item.myRegistryItemId ?? item.externalGiftId;
      return Boolean(key && !seenIds.has(key));
    })
    .map((item) => item.id);
  if (removedIds.length) {
    await prisma.registryItem.updateMany({
      where: { id: { in: removedIds } },
    data: { status: RegistryItemStatus.REMOVED },
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

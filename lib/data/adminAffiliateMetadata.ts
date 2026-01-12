import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

import type { AffiliateNetwork, AffiliatePartnerStatus } from "@/types/adminAffiliates";

const METADATA_PATH = join(process.cwd(), "data", "admin-affiliate-metadata.json");

export type AffiliateMetadataVisibility = {
  blogEligible?: boolean;
  registryEligible?: boolean;
  mentorVisible?: boolean;
};

export type AffiliateMetadataBlogSettings = {
  eligible?: boolean;
  defaultCta?: "Shop" | "Explore" | "Learn More";
  placement?: "END_CARD";
  primaryEligible?: boolean;
};

export type AffiliateMetadataRegistrySettings = {
  retailerTier?: "Tier-1" | "Tier-2";
  priority?: number;
  categoryExclusions?: string[];
  fallbackToBrandDirect?: boolean;
};

export type AffiliateMetadataEntry = {
  category?: string;
  role?: "Brand" | "Retailer" | "Infrastructure";
  commissionRate?: string | null;
  visibility?: AffiliateMetadataVisibility;
  blogSettings?: AffiliateMetadataBlogSettings;
  registrySettings?: AffiliateMetadataRegistrySettings;
  affiliateIds?: Partial<Record<AffiliateNetwork, string>>;
  internalNotes?: string | null;
  status?: AffiliatePartnerStatus;
};

type MetadataSchema = {
  partners: Record<string, AffiliateMetadataEntry>;
};

const ensureMetadataFile = async () => {
  try {
    await readFile(METADATA_PATH, { encoding: "utf-8" });
  } catch {
    await mkdir(dirname(METADATA_PATH), { recursive: true });
    await writeFile(METADATA_PATH, JSON.stringify({ partners: {} }, null, 2), { encoding: "utf-8" });
  }
};

const readMetadata = async (): Promise<MetadataSchema> => {
  await ensureMetadataFile();
  try {
    const raw = await readFile(METADATA_PATH, { encoding: "utf-8" });
    return JSON.parse(raw) as MetadataSchema;
  } catch {
    await writeFile(METADATA_PATH, JSON.stringify({ partners: {} }, null, 2), { encoding: "utf-8" });
    return { partners: {} };
  }
};

const writeMetadata = async (metadata: MetadataSchema) => {
  await mkdir(dirname(METADATA_PATH), { recursive: true });
  await writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2), { encoding: "utf-8" });
};

export const listAffiliateMetadata = async (): Promise<Record<string, AffiliateMetadataEntry>> => {
  const metadata = await readMetadata();
  return metadata.partners;
};

export const getAffiliateMetadata = async (partnerId: string): Promise<AffiliateMetadataEntry | undefined> => {
  const metadata = await readMetadata();
  return metadata.partners[partnerId];
};

export const updateAffiliateMetadata = async (
  partnerId: string,
  updates: Partial<AffiliateMetadataEntry>,
): Promise<AffiliateMetadataEntry> => {
  const metadata = await readMetadata();
  const current = metadata.partners[partnerId] ?? {};
  const visibility = {
    blogEligible: updates.visibility?.blogEligible ?? current.visibility?.blogEligible,
    registryEligible: updates.visibility?.registryEligible ?? current.visibility?.registryEligible,
    mentorVisible: updates.visibility?.mentorVisible ?? current.visibility?.mentorVisible,
  };
  const blogSettings: AffiliateMetadataBlogSettings = {
    eligible: updates.blogSettings?.eligible ?? current.blogSettings?.eligible,
    defaultCta: updates.blogSettings?.defaultCta ?? current.blogSettings?.defaultCta,
    placement: "END_CARD",
    primaryEligible: updates.blogSettings?.primaryEligible ?? current.blogSettings?.primaryEligible,
  };
  const registrySettings = {
    retailerTier: updates.registrySettings?.retailerTier ?? current.registrySettings?.retailerTier,
    priority: updates.registrySettings?.priority ?? current.registrySettings?.priority,
    categoryExclusions:
      updates.registrySettings?.categoryExclusions ?? current.registrySettings?.categoryExclusions ?? [],
    fallbackToBrandDirect:
      updates.registrySettings?.fallbackToBrandDirect ?? current.registrySettings?.fallbackToBrandDirect ?? false,
  };
  const affiliateIds = {
    ...(current.affiliateIds ?? {}),
    ...(updates.affiliateIds ?? {}),
  };
  const merged: AffiliateMetadataEntry = {
    ...current,
    ...updates,
    visibility,
    blogSettings,
    registrySettings,
    affiliateIds,
    internalNotes:
      updates.internalNotes === undefined ? current.internalNotes : updates.internalNotes,
  };

  metadata.partners[partnerId] = merged;
  await writeMetadata(metadata);
  return merged;
};

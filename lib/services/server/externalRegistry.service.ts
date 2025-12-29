import { prisma } from "@/lib/prisma";

export type ExternalRegistryNoteDto = {
  id: string;
  authorId: string;
  authorName: string | null;
  authorRole: string;
  note: string;
  createdAt: string;
};

export type ExternalRegistryDto = {
  id: string;
  memberId: string;
  provider: string;
  title: string | null;
  url: string | null;
  documentUrl: string | null;
  documentLabel: string | null;
  referenceOnly: boolean;
  createdAt: string;
  updatedAt: string;
  notes: ExternalRegistryNoteDto[];
};

const formatExternalRegistryNote = (
  note: {
    id: string;
    authorId: string;
    note: string;
    createdAt: Date;
    author: { name: string | null; role: string };
  },
): ExternalRegistryNoteDto => ({
  id: note.id,
  authorId: note.authorId,
  authorName: note.author.name ?? null,
  authorRole: note.author.role,
  note: note.note,
  createdAt: note.createdAt.toISOString(),
});

const formatExternalRegistry = (
  registry: {
    id: string;
    memberId: string;
    provider: string;
    title: string | null;
    url: string | null;
    documentUrl: string | null;
    documentLabel: string | null;
    referenceOnly: boolean;
    createdAt: Date;
    updatedAt: Date;
    notes: Array<{
      id: string;
      authorId: string;
      note: string;
      createdAt: Date;
      author: { name: string | null; role: string };
    }>;
  },
): ExternalRegistryDto => ({
  id: registry.id,
  memberId: registry.memberId,
  provider: registry.provider,
  title: registry.title,
  url: registry.url,
  documentUrl: registry.documentUrl,
  documentLabel: registry.documentLabel,
  referenceOnly: registry.referenceOnly,
  createdAt: registry.createdAt.toISOString(),
  updatedAt: registry.updatedAt.toISOString(),
  notes: registry.notes.map(formatExternalRegistryNote),
});

export const listExternalRegistriesForMember = async (memberId: string) => {
  const registries = await prisma.externalRegistry.findMany({
    where: { memberId },
    include: {
      notes: {
        include: {
          author: {
            select: { name: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return registries.map(formatExternalRegistry);
};

export const createExternalRegistry = async (input: {
  memberId: string;
  provider: string;
  title?: string | null;
  url?: string | null;
  documentUrl?: string | null;
  documentLabel?: string | null;
}) => {
  const provider = input.provider.trim();
  if (!provider) {
    throw new Error("Provider is required.");
  }

  const url = input.url?.trim() || null;
  const documentUrl = input.documentUrl?.trim() || null;
  if (!url && !documentUrl) {
    throw new Error("Add a registry link or upload URL.");
  }

  const registry = await prisma.externalRegistry.create({
    data: {
      memberId: input.memberId,
      provider,
      title: input.title?.trim() || null,
      url,
      documentUrl,
      documentLabel: input.documentLabel?.trim() || null,
    },
    include: {
      notes: {
        include: { author: { select: { name: true, role: true } } },
      },
    },
  });

  return formatExternalRegistry(registry);
};

export const addExternalRegistryNote = async (input: {
  registryId: string;
  authorId: string;
  note: string;
}) => {
  const trimmed = input.note.trim();
  if (!trimmed) {
    throw new Error("Note cannot be empty.");
  }

  const registry = await prisma.externalRegistry.findUnique({
    where: { id: input.registryId },
    select: { id: true },
  });

  if (!registry) {
    throw new Error("External registry not found.");
  }

  const created = await prisma.externalRegistryNote.create({
    data: {
      registryId: input.registryId,
      authorId: input.authorId,
      note: trimmed,
    },
    include: {
      author: {
        select: { name: true, role: true },
      },
    },
  });

  return formatExternalRegistryNote(created);
};

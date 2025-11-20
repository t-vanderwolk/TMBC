"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loadSession } from "@/lib/auth";
import { useMyRegistry } from "@/lib/hooks/useMyRegistry";
import RegistryItemCard, { MyRegistryItem } from "@/components/registry/RegistryItemCard";

const defaultConnectIntro = [
  "MyRegistry is where your baby gear wishlist lives.",
  "Once connected, TMBC keeps everything in sync and opens concierge support.",
  "Need help with your registry? Our team can walk through setup.",
];

const extractRegistryId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const maybeRegistries = (payload as { Registries?: unknown }).Registries;
  if (Array.isArray(maybeRegistries)) {
    const first = maybeRegistries[0];
    if (first && typeof first === "object") {
      return (
        (first as { RegistryId?: string }).RegistryId ||
        (first as { registryId?: string }).registryId ||
        null
      );
    }
  }

  if (Array.isArray(payload)) {
    const first = payload[0];
    if (first && typeof first === "object") {
      return (
        (first as { RegistryId?: string }).RegistryId ||
        (first as { registryId?: string }).registryId ||
        null
      );
    }
  }

  const asRecord = payload as Record<string, unknown>;
  return (
    (asRecord["RegistryId"] as string) ||
    (asRecord["registryId"] as string) ||
    (asRecord["Id"] as string) ||
    null
  );
};

const deriveErrorMessage = (value: unknown, fallback: string): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;
  if (typeof value === "object" && value !== null && "message" in value) {
    const maybe = (value as Record<string, unknown>)["message"];
    if (typeof maybe === "string") {
      return maybe;
    }
  }
  return fallback;
};

const extractItems = (payload: unknown, registryId?: string): MyRegistryItem[] => {
  if (!payload || typeof payload !== "object") return [];

  const maybeItems = (payload as { Items?: unknown }).Items ?? (payload as { items?: unknown }).items;
  const itemsArray = Array.isArray(maybeItems) ? maybeItems : Array.isArray(payload) ? payload : [];

  return itemsArray
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === "object"))
    .map((entry) => ({
      ItemID: (entry["ItemID"] as string) ?? (entry["itemId"] as string) ?? "",
      RegistryId: (entry["RegistryId"] as string | undefined) ?? registryId,
      Title: (entry["Title"] as string) ?? (entry["title"] as string),
      Description: (entry["Description"] as string) ?? (entry["description"] as string),
      Price: typeof entry["Price"] === "number" ? (entry["Price"] as number) : undefined,
      ImageUrl: (entry["ImageUrl"] as string) ?? (entry["imageUrl"] as string),
      Purchased: (entry["Purchased"] as boolean) ?? (entry["purchased"] as boolean),
    }))
    .filter((item) => Boolean(item.ItemID));
};

const emptyNewItem = {
  title: "",
  description: "",
  price: "",
};

export default function RegistryDashboardPage() {
  const router = useRouter();
  const session = loadSession();
  const storedEmail = session?.payload?.myRegistryEmail || session?.payload?.email || "";

  const { getRegistries, getRegistryItems, addItem, updateItem, removeItem, markPurchased } =
    useMyRegistry();

  const [registryId, setRegistryId] = useState<string | null>(null);
  const [items, setItems] = useState<MyRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(Boolean(session?.payload?.myRegistryUserId));
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState(emptyNewItem);

  useEffect(() => {
    const hydrate = async () => {
      if (!storedEmail) {
        setConnected(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const registries = await getRegistries({ Email: storedEmail });
        const id = extractRegistryId(registries.data);

        if (!id) {
          setConnected(false);
          setError("We could not find your MyRegistry account yet.");
          return;
        }

        setRegistryId(id);
        const itemsResponse = await getRegistryItems({ RegistryId: id });
        const normalizedItems = extractItems(itemsResponse.data, id);
        setItems(normalizedItems);
        setConnected(true);
      } catch (err: unknown) {
        setError(deriveErrorMessage(err, "Unable to load registry items right now."));
        setConnected(false);
        setRegistryId(null);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void hydrate();
  }, [storedEmail, getRegistries, getRegistryItems]);

  const refreshItems = async (id: string) => {
    setError(null);
    try {
      const itemsResponse = await getRegistryItems({ RegistryId: id });
      setItems(extractItems(itemsResponse.data, id));
    } catch (err: unknown) {
      setError(deriveErrorMessage(err, "Unable to refresh items."));
    }
  };

  const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registryId) return;

    const trimmedTitle = newItem.title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    try {
      setError(null);
      await addItem({
        RegistryId: registryId,
        ItemName: trimmedTitle,
        Description: newItem.description.trim() || undefined,
        Price: newItem.price ? Number(newItem.price) : undefined,
      });
      setNewItem(emptyNewItem);
      await refreshItems(registryId);
      } catch (err: unknown) {
        setError(deriveErrorMessage(err, "Unable to add item."));
      }
  };

  const handleUpdateItem = async (item: MyRegistryItem) => {
    if (!registryId || !item.ItemID) return;

    const newTitle = window.prompt("Update title", item.Title ?? "");
    if (!newTitle) return;

    try {
      setError(null);
      setBusyItemId(item.ItemID);
      await updateItem({
        RegistryId: registryId,
        ItemId: item.ItemID,
        ItemName: newTitle,
      });
      await refreshItems(registryId);
    } catch (err: unknown) {
      setError(deriveErrorMessage(err, "Unable to update item."));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (item: MyRegistryItem) => {
    if (!registryId || !item.ItemID) return;

    try {
      setError(null);
      setBusyItemId(item.ItemID);
      await removeItem({ RegistryId: registryId, ItemId: item.ItemID });
      await refreshItems(registryId);
    } catch (err: unknown) {
      setError(deriveErrorMessage(err, "Unable to remove item."));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleTogglePurchased = async (item: MyRegistryItem) => {
    if (!registryId || !item.ItemID) return;

    try {
      setError(null);
      setBusyItemId(item.ItemID);
      await markPurchased({
        RegistryId: registryId,
        ItemId: item.ItemID,
        Purchased: !Boolean(item.Purchased),
      });
      await refreshItems(registryId);
    } catch (err: unknown) {
      setError(deriveErrorMessage(err, "Unable to update purchased status."));
    } finally {
      setBusyItemId(null);
    }
  };

  const connectForm = (
    <div className="p-6 rounded-3xl border border-tmDust bg-white/80 shadow-soft">
      <h1 className="text-2xl font-semibold text-tmCharcoal">Connect MyRegistry</h1>
      <p className="mt-2 text-sm text-tmCharcoal/70">
        Link your MyRegistry account to access concierge matching and add items from one place.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-tmCharcoal/70">
        {defaultConnectIntro.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>

      <form
        className="mt-6 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/signup");
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="First name" className="w-full" />
          <input placeholder="Last name" className="w-full" />
        </div>
        <button className="btn-primary" type="submit">
          Go to signup
        </button>
        <p className="text-xs text-tmCharcoal/60">
          Already have an invite? Paste the code in the signup URL (&nbsp;
          <Link href="/requestinvite" className="text-tmMauve underline">
            request invite
          </Link>
          &nbsp;).
        </p>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 text-sm text-tmCharcoal/70">
        Loading registry… <span aria-hidden="true">⏳</span>
      </div>
    );
  }

  if (!connected) {
    return connectForm;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-tmDust bg-white/80 p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-tmCharcoal">MyRegistry Dashboard</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">Manage your requested gifts with live updates.</p>

        <form className="mt-6 grid gap-3" onSubmit={handleAddItem}>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={newItem.title}
              onChange={(event) => setNewItem({ ...newItem, title: event.target.value })}
              placeholder="Item title"
              required
              className="w-full"
            />
            <input
              value={newItem.description}
              onChange={(event) => setNewItem({ ...newItem, description: event.target.value })}
              placeholder="Description"
              className="w-full"
            />
            <input
              value={newItem.price}
              onChange={(event) => setNewItem({ ...newItem, price: event.target.value })}
              placeholder="Price"
              type="number"
              className="w-full"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-center">
            Add item
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {!items.length ? (
        <p className="rounded-3xl border border-tmDust bg-white/70 p-6 text-center text-sm text-tmCharcoal/70">
          No items found. Add your first gift to get started.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <RegistryItemCard
              key={item.ItemID}
              item={item}
              busy={busyItemId === item.ItemID}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
              onTogglePurchased={handleTogglePurchased}
            />
          ))}
        </div>
      )}
    </div>
  );
}

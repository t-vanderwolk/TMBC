"use client";

import { DollarSign, CheckCircle2, Trash2, RefreshCcw } from "lucide-react";

export type MyRegistryItem = {
  ItemID: string;
  RegistryId?: string;
  Title?: string;
  Description?: string;
  Price?: number;
  ImageUrl?: string;
  Purchased?: boolean;
};

type RegistryItemCardProps = {
  item: MyRegistryItem;
  busy?: boolean;
  onUpdate: (item: MyRegistryItem) => void;
  onRemove: (item: MyRegistryItem) => void;
  onTogglePurchased: (item: MyRegistryItem) => void;
};

const formatPrice = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    : "Price unavailable";

export default function RegistryItemCard({
  item,
  busy = false,
  onUpdate,
  onRemove,
  onTogglePurchased,
}: RegistryItemCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-tmDust bg-white/90 p-5 shadow-soft">
      <div className="rounded-2xl border border-tmDust/70 bg-tmAsh/10 p-2">
        <img
          src={item.ImageUrl || "https://via.placeholder.com/400x300?text=Registry+Item"}
          alt={item.Title ?? "Registry item image"}
          className="h-48 w-full object-cover rounded-2xl"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Registry item</p>
          <h3 className="mt-1 text-xl font-semibold text-tmCharcoal">{item.Title ?? "Untitled piece"}</h3>
          {item.Description && <p className="mt-1 text-sm text-tmCharcoal/70">{item.Description}</p>}
        </div>

        <div className="flex items-center justify-between text-sm text-tmCharcoal/70">
          <span className="inline-flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {formatPrice(item.Price)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.Purchased ? "bg-tmGarden/10 text-tmGarden" : "bg-tmBlush/10 text-tmBlush"
            }`}
          >
            {item.Purchased ? "Purchased" : "Active"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
        <button
          className="flex-1 rounded-2xl border border-tmDust px-3 py-2 text-xs font-semibold text-tmCharcoal disabled:opacity-60"
          onClick={() => onUpdate(item)}
          disabled={busy}
        >
          <RefreshCcw className="inline-block h-3 w-3" /> Update
        </button>
        <button
          className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-60"
          onClick={() => onRemove(item)}
          disabled={busy}
        >
          <Trash2 className="inline-block h-3 w-3" /> Remove
        </button>
        <button
          className="flex-1 rounded-2xl border border-tmGarden/30 bg-tmGarden/10 px-3 py-2 text-xs font-semibold text-tmGarden disabled:opacity-60"
          onClick={() => onTogglePurchased(item)}
          disabled={busy}
        >
          <CheckCircle2 className="inline-block h-3 w-3" /> {item.Purchased ? "Unmark" : "Purchased"}
        </button>
      </div>
    </article>
  );
}

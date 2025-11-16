'use client';

import { useEffect, useMemo, useState } from 'react';
import { Gift, Link2 } from 'lucide-react';

import type { RegistryItem } from '@/types/registry';

import MentorNotes from './MentorNotes';

type RegistryListProps = {
  items: RegistryItem[];
  onUpdate: (itemId: string, payload: Partial<Pick<RegistryItem, 'quantity' | 'status' | 'notes' | 'purchaseSource'>>) => Promise<void> | void;
  onRemove: (itemId: string) => Promise<void> | void;
};

const statusLabels: Record<RegistryItem['status'], string> = {
  ACTIVE: 'Active',
  NEEDED: 'Needed',
  RESERVED: 'Reserved',
  PURCHASED: 'Purchased',
  PURCHASED_ELSEWHERE: 'Purchased elsewhere',
};

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

const RegistryListItem = ({
  item,
  onUpdate,
  onRemove,
}: {
  item: RegistryItem;
  onUpdate: RegistryListProps['onUpdate'];
  onRemove: RegistryListProps['onRemove'];
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [status, setStatus] = useState<RegistryItem['status']>(item.status);
  const [notes, setNotes] = useState(item.notes ?? '');
  const [purchaseSource, setPurchaseSource] = useState(item.purchaseSource ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuantity(item.quantity);
    setStatus(item.status);
    setNotes(item.notes ?? '');
    setPurchaseSource(item.purchaseSource ?? '');
  }, [item]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await onUpdate(item.id, { quantity, status, notes, purchaseSource });
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to update item.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePurchasedElsewhere = async () => {
    setStatus('PURCHASED_ELSEWHERE');
    await onUpdate(item.id, {
      status: 'PURCHASED_ELSEWHERE',
      purchaseSource: purchaseSource || 'Purchased elsewhere',
    });
  };

  const unitPrice = item.price ?? item.product.price ?? null;
  const priceLabel = useMemo(() => {
    if (unitPrice === null || Number.isNaN(unitPrice)) return 'Price varies';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(unitPrice);
  }, [unitPrice]);

  return (
    <div className="space-y-5 rounded-3xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-20 w-20 rounded-2xl border border-tmDust bg-white object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">{item.product.brand}</p>
              {item.isCustom && (
                <span className="rounded-full bg-tmBlush/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-tmCharcoal">
                  Custom
                </span>
              )}
            </div>
            <h3 className="text-xl text-tmCharcoal">{item.product.name}</h3>
            <p className="text-sm text-tmCharcoal/70">
              {item.product.merchant} · {priceLabel}
            </p>
          </div>
        </div>
        <span className="inline-flex h-fit items-center rounded-full bg-tmMauve/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve">
          {statusLabels[item.status]}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">
            Status
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value as RegistryItem['status'])}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">
            Purchased elsewhere
          </label>
          <input
            type="text"
            placeholder="Store or giftee"
            value={purchaseSource}
            onChange={(event) => setPurchaseSource(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">
            Your note
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-tmMauve px-4 py-2 font-semibold text-white shadow-soft disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          onClick={handlePurchasedElsewhere}
          className="rounded-full border border-tmMauve/40 px-4 py-2 text-tmMauve"
        >
          Mark purchased elsewhere
        </button>
        <button onClick={() => onRemove(item.id)} className="text-sm text-red-500">
          Remove
        </button>
        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-tmDust/80 px-4 py-2 text-sm text-tmCharcoal/80"
        >
          <Link2 className="h-4 w-4" />
          View affiliate link
        </a>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <MentorNotes notes={item.mentorNotes} />
    </div>
  );
};

export default function RegistryList({ items, onUpdate, onRemove }: RegistryListProps) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-tmBlush/60 bg-white/80 p-6 text-center">
        <Gift className="mx-auto h-10 w-10 text-tmMauve" />
        <p className="mt-4 text-lg font-semibold text-tmCharcoal">No items yet</p>
        <p className="text-sm text-tmCharcoal/70">Add your first finds from the Academy recommendations below.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <RegistryListItem key={item.id} item={item} onUpdate={onUpdate} onRemove={onRemove} />
      ))}
    </div>
  );
}

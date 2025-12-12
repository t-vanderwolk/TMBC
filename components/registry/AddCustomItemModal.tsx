'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import { addCustomItem } from '@/lib/api';
import type { AcademyModuleMeta } from '@/types/registry';

const merchants = ['MacroBaby', 'AlbeeBaby', 'Silver Cross', 'Amazon', 'Other'];
const categories = ['Stroller', 'Car Seat', 'Nursery', 'Feeding', 'Travel', 'Gear', 'Essentials', 'Custom'];

type AddCustomItemModalProps = {
  open: boolean;
  onClose: () => void;
  modules: AcademyModuleMeta[];
  defaultModuleCode?: string;
  onSuccess: () => void;
};

export default function AddCustomItemModal({
  open,
  onClose,
  modules,
  defaultModuleCode,
  onSuccess,
}: AddCustomItemModalProps) {
  const [title, setTitle] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setModuleCode(defaultModuleCode || '');
    }
  }, [open, defaultModuleCode]);

  const moduleOptions = useMemo(
    () =>
      modules.map((module) => ({
        value: module.id,
        label: module.title,
      })),
    [modules],
  );

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const parsedPrice = price ? Number(price) : undefined;

      await addCustomItem({
        title,
        url: productUrl,
        merchant: merchant || undefined,
        category: category || undefined,
        moduleCode: moduleCode || undefined,
        price: Number.isNaN(parsedPrice) ? undefined : parsedPrice,
        image: imageUrl || undefined,
      });

      onSuccess();
      onClose();
      setTitle('');
      setProductUrl('');
      setMerchant('');
      setCategory('');
      setPrice('');
      setImageUrl('');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to add custom item.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Custom Item</p>
            <h2 className="text-2xl text-tmCharcoal">Add to Registry</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-tmIvory p-2 text-tmCharcoal/70">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Title</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Product URL</label>
            <input type="url" value={productUrl} onChange={(event) => setProductUrl(event.target.value)} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Merchant</label>
              <select value={merchant} onChange={(event) => setMerchant(event.target.value)}>
                <option value="">Select merchant</option>
                {merchants.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Category</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Select category</option>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Price</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="USD"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/70">Module</label>
            <select value={moduleCode} onChange={(event) => setModuleCode(event.target.value)}>
              <option value="">Unassigned</option>
              {moduleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-tmDust px-4 py-2 text-sm text-tmCharcoal/70">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

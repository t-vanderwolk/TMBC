'use client';

import { useEffect, useState } from 'react';
import { Gift, Link as LinkIcon, PlusCircle, Share2 } from 'lucide-react';

import { api } from '@/lib/api';

type RegistryItem = {
  id: string;
  name: string;
  brand: string;
  status: 'Needed' | 'Purchased' | 'Reserved';
};

const mockItems: RegistryItem[] = [
  { id: '1', name: 'Featherweight Stroller', brand: 'Maison Bébé', status: 'Needed' },
  { id: '2', name: 'Organic Muslin Set', brand: 'Luna Loom', status: 'Reserved' },
  { id: '3', name: 'Heirloom Rocker', brand: 'Taylor Atelier', status: 'Purchased' },
  { id: '4', name: 'Air Purifier', brand: 'Serein Home', status: 'Needed' },
];

const statusStyles: Record<RegistryItem['status'], string> = {
  Needed: 'bg-tmMauve/10 text-tmMauve',
  Purchased: 'bg-emerald-50 text-emerald-600',
  Reserved: 'bg-tmBlush/50 text-tmCharcoal',
};

export default function RegistryPage() {
  const [items, setItems] = useState<RegistryItem[]>(mockItems);

  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        await api.get('/api/registry');
        // TODO: integrate MyRegistry builder + concierge sync
      } catch (error) {
        console.error('Registry placeholder error', error);
      }
    };

    fetchRegistry();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Registry Concierge</p>
          <h1 className="text-4xl text-tmCharcoal">Your Taylor-Made Registry</h1>
          <p className="mt-2 text-sm text-tmCharcoal/70">
            Track every curated find, sync with MyRegistry, and share updates with your mentor.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white shadow-soft">
            <PlusCircle className="h-4 w-4" />
            Add Item
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-5 py-3 text-sm font-semibold text-tmMauve">
            <LinkIcon className="h-4 w-4" />
            Sync with MyRegistry
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-tmBlush/60 px-5 py-3 text-sm font-semibold text-tmCharcoal">
            <Share2 className="h-4 w-4" />
            Share with Mentor
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-tmBlush/40 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">{item.brand}</p>
                <h2 className="text-xl text-tmCharcoal">{item.name}</h2>
              </div>
              <Gift className="h-6 w-6 text-tmMauve" />
            </div>
            <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
              {item.status}
            </span>
            <p className="mt-3 text-xs text-tmCharcoal/60">// TODO: connect inventory + price data</p>
          </div>
        ))}
      </section>
    </div>
  );
}

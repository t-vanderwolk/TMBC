"use client";

import AffiliateBadge from './AffiliateBadge';
import type { RegistryItemResponse } from '@/lib/services/server/registry.service';

type Props = {
  item: RegistryItemResponse;
};

const formatCurrency = (value: number | null) =>
  value === null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function RegistryItemCard({ item }: Props) {
  const price = formatCurrency(item.price ?? item.product.price ?? null);
  const productName = item.product.name ?? item.title ?? 'Registry item';
  const brand = item.product.brand ?? item.merchant ?? 'Taylor-Made Baby Co.';
  const category = item.product.category ?? item.category ?? 'Registry';
  const imageUrl = item.product.imageUrl ?? item.image ?? '';
  const statusLabel = item.status.toLowerCase().replace('_', ' ');

  return (
    <article className="space-y-4 rounded-2xl border border-[#ECE0EB] bg-white/80 p-5 shadow-sm">
      <div className="grid gap-4 text-[#3E2F35] md:grid-cols-[auto,1fr,auto]">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#F7F0F7]">
          {imageUrl ? (
            <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
              Image
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[#3E2F35]">{productName}</h3>
              <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">{brand}</p>
            </div>
            <span className="rounded-full border border-[#E3D1E0] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/70">
              Qty {item.quantity ?? 1}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AffiliateBadge partner={item.affiliatePartner} />
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
              {category}
            </span>
          </div>
          <p className="text-base font-semibold text-[#3E2F35]">{price}</p>
        </div>
        <div className="flex flex-col items-end justify-between gap-3">
          <a
            href={`/api/registry/outbound?itemId=${item.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-[#3E2F35]/70 px-5 py-2 text-[0.7rem] uppercase tracking-[0.4em] text-[#3E2F35] transition-colors hover:border-[#3E2F35]"
          >
            Shop
          </a>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">{statusLabel}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-[#ECE0EB] bg-[#FCF7FC] p-4 text-sm text-[#4F2D44]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#7B4E62]/70">Mentor notes</p>
        {item.mentorNotes.length ? (
          <ul className="mt-3 space-y-2 text-sm text-[#3E2F35]">
            {item.mentorNotes.map((note) => (
              <li key={note.id}>
                <span className="mr-1 font-semibold text-[#3E2F35]">
                  {note.mentorName ?? 'Mentor'}
                </span>
                · {note.note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-[#7B4E62]/80">Mentor guidance will appear here once it’s added.</p>
        )}
      </div>
    </article>
  );
}

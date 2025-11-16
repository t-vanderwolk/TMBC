'use client';

import { ReactNode } from 'react';
import { Store } from 'lucide-react';

import type { ProductSummary } from '@/types/registry';

type ProductCardProps = {
  product: ProductSummary;
  action?: ReactNode;
  footer?: ReactNode;
};

const formatCurrency = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return 'Price varies';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ProductCard({ product, action, footer }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-20 w-20 rounded-2xl border border-tmDust bg-white object-cover"
        />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{product.brand}</p>
          <h3 className="text-lg text-tmCharcoal">{product.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-tmCharcoal/70">
            <span className="inline-flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-tmMauve" />
              {product.merchant}
            </span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>
      </div>
      {action && <div>{action}</div>}
      {footer && <div className="text-sm text-tmCharcoal/80">{footer}</div>}
    </div>
  );
}

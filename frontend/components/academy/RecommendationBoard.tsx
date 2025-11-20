'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';

import { api } from '@/lib/api';

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  merchant: string;
  price: number | null;
  inStock: boolean;
};

type RecommendationBoardProps = {
  moduleId: string;
};

const formatPrice = (value: number | null) =>
  value != null
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    : 'Price upon request';

const RecommendationBoard = ({ moduleId }: RecommendationBoardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | 'all' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    setLoading(true);
    api
      .get(`/api/academy/module/${moduleId}/recommendations`)
      .then((response) => {
        const data = response.data?.products ?? [];
        setProducts(data);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [moduleId]);

  const handleAddAll = async () => {
    if (!products.length || addingId === 'all') return;
    setAddingId('all');
    setFeedback(null);

    try {
      await api.post('/api/registry/bulk/add', {
        productIds: products.map((product) => product.id),
      });
      setFeedback('Curated selections added to your registry.');
    } catch (error: any) {
      setFeedback(error?.response?.data?.error || 'Unable to add items right now.');
    } finally {
      setAddingId(null);
    }
  };

  const handleAddSingle = async (productId: string) => {
    if (addingId) return;
    setAddingId(productId);
    setFeedback(null);

    try {
      await api.post('/api/registry/bulk/add', { productIds: [productId] });
      setFeedback('Item added to registry.');
    } catch (error: any) {
      setFeedback(error?.response?.data?.error || 'Unable to add this item.');
    } finally {
      setAddingId(null);
    }
  };

  const availability = useMemo(
    () => products.filter((product) => product.inStock).length,
    [products],
  );

  return (
    <section className="tm-editorial-card tm-paper-texture space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="h-5 w-5 text-[var(--tm-gold)]" />
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Recommendation board</p>
          <h2 className="tm-serif-title text-3xl">Registry whispers</h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]">
        <span>{products.length} curated picks</span>
        <span>{availability} in stock now</span>
        <button
          type="button"
          onClick={handleAddAll}
          disabled={addingId === 'all' || !products.length}
          className="rounded-full border border-[var(--tm-deep-mauve)] px-4 py-1 text-[0.65rem] font-semibold tracking-[0.35em] text-[var(--tm-deep-mauve)]"
        >
          {addingId === 'all' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Add curated set'
          )}
        </button>
      </div>
      {feedback && <p className="text-sm text-[var(--tm-deep-mauve)]/80">{feedback}</p>}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--tm-deep-mauve)]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col rounded-[32px] border border-[var(--tm-blush)] bg-white/80 p-4 shadow-[0_20px_40px_rgba(134,75,95,0.15)]"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
                <span>{product.brand}</span>
                <span>{product.category}</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-[var(--tm-deep-mauve)]">{product.name}</p>
              <p className="mt-2 text-sm text-[var(--tm-charcoal)]/70">{product.merchant}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--tm-deep-mauve)]">
                {formatPrice(product.price)}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAddSingle(product.id)}
                  disabled={addingId === product.id}
                  className="rounded-full border border-[var(--tm-deep-mauve)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] disabled:opacity-60"
                >
                  {addingId === product.id ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Adding…
                    </span>
                  ) : (
                    'Add to registry'
                  )}
                </button>
                <Link
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationBoard;

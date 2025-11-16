import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Share2, Sparkles } from 'lucide-react';

import AddCustomItemButton from '@/components/registry/AddCustomItemButton';
import AddToRegistryButton from '@/components/registry/AddToRegistryButton';
import ProductCard from '@/components/registry/ProductCard';
import RegistryList from '@/components/registry/RegistryList';
import SyncButton from '@/components/registry/SyncButton';
import { api } from '@/lib/api';
import type {
  AcademyModuleMeta,
  ModuleRecommendationsResponse,
  RegistryConflict,
  RegistryItem,
  RegistrySyncState,
} from '@/types/registry';

export default function RegistryPage() {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [modules, setModules] = useState<AcademyModuleMeta[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [recommendations, setRecommendations] = useState<ModuleRecommendationsResponse | null>(null);
  const [loadingRegistry, setLoadingRegistry] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [registryError, setRegistryError] = useState<string | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<RegistrySyncState>({ lastSyncedAt: null, conflicts: [] });
  const [syncBanner, setSyncBanner] = useState<string | null>(null);

  const fetchRegistry = useCallback(async () => {
    try {
      setRegistryError(null);
      setLoadingRegistry(true);
      const response = await api.get('/api/registry');
      setItems(response.data);
    } catch (error) {
      console.error('Registry load error', error);
      setRegistryError('Unable to load your registry right now.');
    } finally {
      setLoadingRegistry(false);
    }
  }, []);

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await api.get('/api/myregistry/status');
        setSyncState(response.data as RegistrySyncState);
      } catch {
        // silently ignore when not connected
      }
    };

    const fetchModules = async () => {
      try {
        const response = await api.get('/api/academy/modules');
        const serverModules = response.data as AcademyModuleMeta[];
        setModules(serverModules);
        if (!selectedModule && serverModules.length) {
          setSelectedModule(serverModules[0].id);
        }
      } catch (error) {
        console.error('Module load error', error);
      }
    };

    fetchRegistry();
    fetchModules();
    fetchSyncStatus();
  }, [fetchRegistry, selectedModule]);

  useEffect(() => {
    if (!selectedModule) return;

    const fetchRecommendations = async () => {
      try {
        setRecommendationError(null);
        setLoadingRecommendations(true);
        const response = await api.get(`/api/academy/${selectedModule}/recommendations`);
        setRecommendations(response.data as ModuleRecommendationsResponse);
      } catch (error) {
        console.error('Recommendation load error', error);
        setRecommendationError('Unable to load recommendations right now.');
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [selectedModule]);

  const handleItemAdded = (item: RegistryItem) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleUpdateItem = async (
    itemId: string,
    payload: Partial<Pick<RegistryItem, 'quantity' | 'status' | 'notes' | 'purchaseSource'>>,
  ) => {
    const response = await api.post('/api/registry/update', {
      itemId,
      ...payload,
    });
    const updated = response.data as RegistryItem;
    setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
  };

  const handleRemoveItem = async (itemId: string) => {
    await api.post('/api/registry/remove', { itemId });
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const activeModule = useMemo(() => {
    return modules.find((module) => module.id === selectedModule);
  }, [modules, selectedModule]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Registry Concierge</p>
          <h1 className="text-4xl text-tmCharcoal">Your Taylor-Made Registry</h1>
          <p className="mt-2 text-sm text-tmCharcoal/70">
            Track every curated find, see mentor notes, and push items to MyRegistry with affiliate tracking intact.
          </p>
          {syncState.conflicts.length > 0 && (
            <p className="mt-2 text-sm text-amber-700">
              {syncState.conflicts.length} conflict{syncState.conflicts.length === 1 ? '' : 's'} pending —{' '}
              <Link href="/dashboard/registry/conflicts" className="font-semibold underline">
                review now
              </Link>
              .
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <AddCustomItemButton modules={modules} defaultModuleCode={selectedModule} onSuccess={fetchRegistry} />
          <SyncButton
            initialState={syncState}
            onItemsUpdated={(updated) => setItems(updated)}
            onConflictsUpdate={(conflicts: RegistryConflict[]) =>
              setSyncState((prev) => ({ ...prev, conflicts }))
            }
            onFallback={(fallbackItems, errorMessage) => {
              if (fallbackItems.length) {
                setItems(fallbackItems);
              }
              setRegistryError(errorMessage);
              setSyncBanner('MyRegistry is temporarily unavailable — showing your saved items.');
            }}
            onSyncState={(state) => {
              setSyncState(state);
              setSyncBanner(null);
            }}
          />
          <button className="inline-flex items-center gap-2 rounded-full border border-tmBlush/60 px-5 py-3 text-sm font-semibold text-tmCharcoal">
            <Share2 className="h-4 w-4" />
            Share with Mentor
          </button>
        </div>
      </header>
      {syncBanner && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {syncBanner}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-tmCharcoal">Registry Items</h2>
          {loadingRegistry && (
            <span className="inline-flex items-center gap-2 text-sm text-tmCharcoal/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your items…
            </span>
          )}
        </div>
        {registryError && <p className="text-sm text-red-500">{registryError}</p>}
        {!loadingRegistry && (
          <RegistryList items={items} onUpdate={handleUpdateItem} onRemove={handleRemoveItem} />
        )}
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Academy Integration</p>
            <h2 className="text-2xl text-tmCharcoal">Add These to Your Registry</h2>
            <p className="text-sm text-tmCharcoal/70">
              Each module unlocks curated gear that matches your stage, mentor notes, and affiliate tracking.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.4em] text-tmCharcoal/70">
              Module
            </label>
            <select
              value={selectedModule}
              onChange={(event) => setSelectedModule(event.target.value)}
              className="min-w-[240px]"
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        {activeModule && (
          <div className="mt-4 rounded-2xl border border-tmBlush/60 bg-tmIvory/80 p-4 text-sm text-tmCharcoal/80">
            <p className="font-semibold text-tmCharcoal">{activeModule.title}</p>
            <p>
              Stage: <span className="font-semibold">{activeModule.stage}</span>
            </p>
            {activeModule.mentorNotes && <p className="mt-2 italic text-tmCharcoal/70">“{activeModule.mentorNotes}”</p>}
          </div>
        )}
        {loadingRecommendations && (
          <div className="mt-6 flex items-center gap-2 text-sm text-tmCharcoal/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading module recommendations…
          </div>
        )}
        {recommendationError && <p className="mt-4 text-sm text-red-500">{recommendationError}</p>}
        {!loadingRecommendations && recommendations && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-2 text-sm text-tmCharcoal/70">
              <Sparkles className="h-4 w-4 text-tmMauve" />
              {recommendations.products.length} match{recommendations.products.length === 1 ? '' : 'es'} curated for
              this lesson
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  action={<AddToRegistryButton productId={product.id} onAdded={handleItemAdded} />}
                />
              ))}
            </div>
          </div>
        )}
        {!loadingRecommendations && !recommendations && (
          <div className="mt-6 rounded-2xl border border-dashed border-tmBlush/60 bg-white/80 p-4 text-sm text-tmCharcoal/70">
            <p>No recommendations yet. Select a module to see curated picks.</p>
          </div>
        )}
      </section>
    </div>
  );
}

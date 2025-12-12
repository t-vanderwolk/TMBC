import RegistryConflictsPanel from '@/components/registry/RegistryConflictsPanel';

export default function RegistryConflictsPage() {
  return (
    <div className="space-y-6 px-6 py-10 md:px-10">
      <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Registry Sync</p>
        <h1 className="mt-2 text-3xl text-tmCharcoal">Resolve MyRegistry Conflicts</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Choose how to reconcile each difference so both registries stay perfectly aligned.
        </p>
      </div>
      <RegistryConflictsPanel />
    </div>
  );
}

'use client';

import { FormEvent, useMemo, useState } from 'react';

import type { ModuleMeta } from '@/hooks/useModuleEditor';
import SlideDeckEditorial from '@/components/academy/SlideDeckEditorial';

type EditModuleFormProps = {
  module: ModuleMeta;
  onSave: (payload: Partial<ModuleMeta>) => Promise<void> | void;
};

const splitLectureIntoSlides = (raw: string) =>
  raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

export default function EditModuleForm({ module, onSave }: EditModuleFormProps) {
  const [form, setForm] = useState({
    title: module.title,
    subtitle: module.subtitle,
    heroImage: module.heroImage ?? '',
    lecture: module.lecture,
    explore: module.explore,
    apply: module.apply,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const previewSlides = useMemo(() => splitLectureIntoSlides(form.lecture), [form.lecture]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({ id: module.id, ...form });
      setMessage('Saved');
    } catch (err) {
      console.error('Unable to save module', err);
      setMessage('Unable to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/70 bg-tmBlush/40 p-5 shadow-inner">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-[0.4em] text-tmMauve">{module.code}</h3>
        <p className="text-[10px] text-tmCharcoal/60">{new Date(module.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Title
          <input
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
          Subtitle
          <input
            value={form.subtitle}
            onChange={(event) => handleChange('subtitle', event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          />
        </label>
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
        Hero Image URL
        <input
          value={form.heroImage}
          onChange={(event) => handleChange('heroImage', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
        Lecture copy
        <textarea
          value={form.lecture}
          onChange={(event) => handleChange('lecture', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          rows={3}
        />
      </label>
      <div className="space-y-3 rounded-3xl border border-[var(--tm-blush)] bg-white/90 p-4 shadow-inner">
        <div className="flex items-center justify-between">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Live slide preview</p>
          <span className="text-[0.6rem] text-[#7A5E73]">{previewSlides.length} slides</span>
        </div>
        <SlideDeckEditorial slides={previewSlides} />
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
        Explore copy
        <textarea
          value={form.explore}
          onChange={(event) => handleChange('explore', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          rows={2}
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-tmCharcoal/60">
        Apply copy
        <textarea
          value={form.apply}
          onChange={(event) => handleChange('apply', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/70 bg-white/90 px-3 py-2 text-sm text-tmCharcoal focus:border-tmCharcoal focus:outline-none"
          rows={2}
        />
      </label>
      <div className="flex items-center justify-between">
        <p className="text-xs text-tmCharcoal/60">{message}</p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-tmCharcoal/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-tmCharcoal"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

import { api } from '@/lib/api';
import type { AdminEvent } from '@/hooks/useEvents';

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (event: AdminEvent) => void;
};

const initialFormState = {
  name: '',
  date: '',
  location: '',
  description: '',
};

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post<AdminEvent>('/api/admin/events', form);
      onSuccess?.(response.data);
      setForm(initialFormState);
      onClose();
    } catch (err) {
      console.error('Failed to create event', err);
      setError('Unable to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-5 rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Create Event</p>
            <h2 className="text-2xl font-semibold text-tmCharcoal">Add a new experience</h2>
          </div>
          <button type="button" onClick={onClose} className="text-tmCharcoal/60 transition hover:text-tmCharcoal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-semibold text-tmCharcoal">
            Title
            <input
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="mt-2 rounded-2xl border border-tmBlush/60 bg-tmIvory/60 px-3 py-2 focus:border-tmCharcoal focus:outline-none"
              placeholder="Event title"
              required
            />
          </label>
          <label className="flex flex-col text-sm font-semibold text-tmCharcoal">
            Date
            <input
              value={form.date}
              type="date"
              onChange={(event) => handleChange('date', event.target.value)}
              className="mt-2 rounded-2xl border border-tmBlush/60 bg-tmIvory/60 px-3 py-2 focus:border-tmCharcoal focus:outline-none"
              required
            />
          </label>
        </div>
        <label className="flex flex-col text-sm font-semibold text-tmCharcoal">
          Location
          <input
            value={form.location}
            onChange={(event) => handleChange('location', event.target.value)}
            className="mt-2 rounded-2xl border border-tmBlush/60 bg-tmIvory/60 px-3 py-2 focus:border-tmCharcoal focus:outline-none"
            placeholder="Studio, city, or virtual link"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-tmCharcoal">
          Description
          <textarea
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            className="mt-2 h-32 rounded-2xl border border-tmBlush/60 bg-tmIvory/60 px-3 py-2 focus:border-tmCharcoal focus:outline-none"
            placeholder="Notes for the concierge team + RSVP expectations"
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-tmCharcoal/90 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-tmCharcoal"
        >
          {loading ? 'Saving…' : 'Save Event'}
        </button>
      </form>
    </div>
  );
}

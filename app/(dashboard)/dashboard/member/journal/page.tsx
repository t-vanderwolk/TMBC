'use client';

import { useEffect, useMemo, useState } from 'react';

import { SectionLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';

type JournalEntryType = 'MOMENT' | 'LETTER' | 'WISDOM' | 'REFLECTION';

type JournalEntry = {
  id: string;
  type: JournalEntryType;
  title: string | null;
  content: string;
  emotionTags: string[];
  sourceLabel: string | null;
  isPrivate: boolean;
  createdAt: string;
};

type SectionDraft = {
  title: string;
  content: string;
  tags: string;
  sourceLabel: 'Mentor' | 'Academy' | '';
};

type SectionConfig = {
  type: JournalEntryType;
  icon: string;
  title: string;
  description: string;
  formLabel: string;
  showForm: boolean;
  showTags?: boolean;
  showTitleInput?: boolean;
  photoHint?: string;
  emptyCopy: string;
};

type EditorState = {
  entryId: string;
  type: JournalEntryType;
  title: string;
  content: string;
  tags: string;
};

const SECTION_CONFIGS: SectionConfig[] = [
  {
    type: 'MOMENT',
    icon: '🧸',
    title: 'Moments',
    description: 'Free-form entries that honor the small, stirring beats of your day. Add emotion tags and, someday, a cherished photo.',
    formLabel: 'What should this keepsake remember?',
    showForm: true,
    showTags: true,
    photoHint: 'Photo uploads are on the way—bookmark one for a future chapter.',
    emptyCopy: 'Nothing captured yet. Start with a single quiet feeling from today.',
  },
  {
    type: 'LETTER',
    icon: '✉️',
    title: 'Letters to Baby',
    description: 'Long-form letters written with intention. No summaries, just your whole heart collected in one place.',
    formLabel: 'What would you read to baby later?',
    showForm: true,
    showTitleInput: true,
    emptyCopy: 'No letters saved yet. Begin with a single note that feels like a lullaby.',
  },
  {
    type: 'WISDOM',
    icon: '⭐',
    title: 'Saved Wisdom',
    description: 'Mentor reflections and Academy insights you choose to keep. These are curated and private, with the source noted below each card.',
    formLabel: '',
    showForm: false,
    emptyCopy: 'When mentors or the Academy share something special, it will appear here.',
  },
  {
    type: 'REFLECTION',
    icon: '📝',
    title: 'Private Reflections',
    description: 'Daily or occasional check-ins. Loose, tender, and never shared unless you decide otherwise.',
    formLabel: 'What felt slow, soft, or sincere today?',
    showForm: true,
    showTags: true,
    emptyCopy: 'Reflections are waiting. You can jot a few sentences or linger longer.',
  },
];

const FUTURE_FEATURES = [
  'Print-ready PDF export for a tactile keepsake.',
  'Seal this chapter into a read-only page whenever you are ready.',
  'Photo uploads that feel like sticking a Polaroid into the book.',
  'Mentor-visible toggles for each entry so you control what they can read.',
];

const createDrafts = (): Record<JournalEntryType, SectionDraft> => ({
  MOMENT: { title: '', content: '', tags: '', sourceLabel: '' },
  LETTER: { title: '', content: '', tags: '', sourceLabel: '' },
  WISDOM: { title: '', content: '', tags: '', sourceLabel: 'Mentor' },
  REFLECTION: { title: '', content: '', tags: '', sourceLabel: '' },
});

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const parseTags = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<JournalEntryType, SectionDraft>>(createDrafts);
  const [savingSection, setSavingSection] = useState<JournalEntryType | null>(null);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [savingEntryId, setSavingEntryId] = useState<string | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await api.get('/journal');
        setEntries(response.data.entries ?? []);
        setError(null);
      } catch (fetchError) {
        console.error('Unable to load journal', fetchError);
        setError('It is still loading moments. Try refreshing in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const groupedEntries = useMemo(() => {
    const result: Record<JournalEntryType, JournalEntry[]> = {
      MOMENT: [],
      LETTER: [],
      WISDOM: [],
      REFLECTION: [],
    };
    const sorted = [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    sorted.forEach((entry) => {
      result[entry.type]?.push(entry);
    });
    return result;
  }, [entries]);

  const handleDraftChange = (type: JournalEntryType, changes: Partial<SectionDraft>) => {
    setDrafts((prev) => ({ ...prev, [type]: { ...prev[type], ...changes } }));
  };

  const resetDraft = (type: JournalEntryType) => {
    setDrafts((prev) => ({ ...prev, [type]: createDrafts()[type] }));
  };

  const handleCreate = async (type: JournalEntryType) => {
    const draft = drafts[type];
    if (!draft.content.trim()) return;
    setSavingSection(type);
    try {
      const payload: Record<string, unknown> = {
        type,
        content: draft.content.trim(),
      };
      if (draft.title.trim()) {
        payload.title = draft.title.trim();
      }
      if (draft.tags.trim()) {
        payload.emotionTags = parseTags(draft.tags);
      }
      if (type === 'WISDOM' && draft.sourceLabel) {
        payload.sourceLabel = draft.sourceLabel;
      }
      const response = await api.post('/journal', payload);
      const created = response.data.entry as JournalEntry;
      setEntries((prev) => [created, ...prev]);
      setError(null);
      resetDraft(type);
    } catch (createError) {
      console.error('Unable to save entry', createError);
      setError('That didn’t save — please try again.');
    } finally {
      setSavingSection(null);
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditor({
      entryId: entry.id,
      type: entry.type,
      title: entry.title ?? '',
      content: entry.content,
      tags: entry.emotionTags.join(', '),
    });
  };

  const cancelEditing = () => setEditor(null);

  const handleSaveEdit = async () => {
    if (!editor || !editor.content.trim()) return;
    setSavingEntryId(editor.entryId);
    try {
      const payload: Record<string, unknown> = {
        content: editor.content.trim(),
      };
      if (editor.type !== 'WISDOM' && editor.tags.trim()) {
        payload.emotionTags = parseTags(editor.tags);
      }
      if (editor.type === 'LETTER' && editor.title.trim()) {
        payload.title = editor.title.trim();
      }
      const response = await api.patch(`/journal/${editor.entryId}`, payload);
      const updated = response.data.entry as JournalEntry;
      setEntries((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
      setError(null);
      setEditor(null);
    } catch (updateError) {
      console.error('Unable to update entry', updateError);
      setError('We could not save your edit. Try again in a moment.');
    } finally {
      setSavingEntryId(null);
    }
  };

  const handleDelete = async (entryId: string) => {
    setDeletingEntryId(entryId);
    try {
      await api.delete(`/journal/${entryId}`);
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      setError(null);
      if (editor?.entryId === entryId) {
        setEditor(null);
      }
    } catch (deleteError) {
      console.error('Unable to delete entry', deleteError);
      setError('We could not remove that entry.');
    } finally {
      setDeletingEntryId(null);
    }
  };

  return (
    <SectionLayout>
      <div className="flex justify-center px-4 py-10">
        <div className="flex w-full max-w-5xl flex-col gap-10">
        <header className="rounded-[28px] border border-tmMauve/40 bg-ivory/80 p-8 shadow-soft">
          <p className="font-playfair text-4xl text-tmCharcoal">My Baby Book</p>
          <p className="mt-3 max-w-3xl text-base text-tmCharcoal/70">
            A private space to remember this chapter—thoughts, moments, and quiet reflections. This journal is intimate,
            heirloom-ready, and private by default.
          </p>
          <p className="mt-2 text-sm text-tmCharcoal/60">Shared only if you choose.</p>
          <div className="mt-6 space-y-1 text-sm text-tmCharcoal/70">
            {FUTURE_FEATURES.map((feature) => (
              <p key={feature} className="leading-relaxed">
                • {feature}
              </p>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="rounded-[28px] border border-tmMauve/30 bg-white/80 p-8 text-center text-sm text-tmCharcoal/70">
            Loading reflections…
          </div>
        ) : (
          error && (
            <div className="rounded-[28px] border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
              {error}
            </div>
          )
        )}

        <section className="flex flex-col gap-8">
          {SECTION_CONFIGS.map((section) => {
            const sectionEntries = groupedEntries[section.type];
            const hasEntries = sectionEntries.length > 0;
            return (
              <article
                key={section.type}
                className="rounded-[28px] border border-tmMauve/40 bg-white/90 p-8 shadow-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl leading-none">{section.icon}</span>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.3em] text-tmMauve/80">
                      {section.type.toLowerCase()}
                    </p>
                    <h2 className="font-playfair text-3xl text-tmCharcoal">{section.title}</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm text-tmCharcoal/70">{section.description}</p>

                {section.showForm && (
                  <div className="mt-6 space-y-4 rounded-[26px] border border-tmMauve/30 bg-tmIvory/90 p-6">
                    <p className="text-sm font-semibold text-tmCharcoal">{section.formLabel}</p>
                    {section.showTitleInput && (
                      <input
                        value={drafts[section.type].title}
                        onChange={(event) => handleDraftChange(section.type, { title: event.target.value })}
                        placeholder="Title (optional)"
                        className="w-full rounded-2xl border border-tmMauve/30 bg-white/70 px-4 py-2 text-sm text-tmCharcoal outline-none"
                      />
                    )}
                    <textarea
                      value={drafts[section.type].content}
                      onChange={(event) => handleDraftChange(section.type, { content: event.target.value })}
                      placeholder="Write slowly. Whisper to baby. Note the sensations."
                      className="min-h-[160px] w-full rounded-2xl border border-tmMauve/30 bg-white/80 px-4 py-3 text-sm text-tmCharcoal/80 outline-none"
                    />
                    {section.showTags && (
                      <input
                        value={drafts[section.type].tags}
                        onChange={(event) => handleDraftChange(section.type, { tags: event.target.value })}
                        placeholder="Emotion tags (joy, tender, wobbly)"
                        className="w-full rounded-2xl border border-tmMauve/30 bg-white/70 px-4 py-2 text-sm text-tmCharcoal outline-none"
                      />
                    )}
                    {section.photoHint && (
                      <p className="text-xs text-tmCharcoal/60">{section.photoHint}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-tmCharcoal/70">
                      <span>Private by default.</span>
                      <button
                        type="button"
                        onClick={() => handleCreate(section.type)}
                        disabled={savingSection === section.type}
                        className="rounded-full bg-tmMauve px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 disabled:bg-tmMauve/50"
                      >
                        {savingSection === section.type ? 'Saving…' : 'Save entry'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  {hasEntries ? (
                    sectionEntries.map((entry) => {
                      const isEditing = editor?.entryId === entry.id;
                      return (
                        <div
                          key={entry.id}
                          className="rounded-[26px] border border-tmMauve/30 bg-ivory/90 p-6"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-xs tracking-[0.4em] text-tmMauve/70">{formatDate(entry.createdAt)}</p>
                                <p className="text-xl font-semibold text-tmCharcoal">
                                  {entry.title || 'Untitled moment'}
                                </p>
                              </div>
                              {section.type !== 'WISDOM' && (
                                <div className="flex items-center gap-2 text-xs text-tmCharcoal/70">
                                  <button
                                    onClick={() => (isEditing ? cancelEditing() : startEditing(entry))}
                                    className="rounded-full border border-tmMauve/30 px-3 py-1"
                                  >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={deletingEntryId === entry.id}
                                    className="rounded-full border border-red-200 px-3 py-1 text-red-600 disabled:opacity-40"
                                  >
                                    {deletingEntryId === entry.id ? 'Deleting…' : 'Delete'}
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-tmCharcoal/70 whitespace-pre-line">{entry.content}</p>
                          </div>
                          {entry.emotionTags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {entry.emotionTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-tmMauve/50 bg-white/80 px-3 py-1 text-xs text-tmDeepMauve"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {section.type === 'WISDOM' && entry.sourceLabel && (
                            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-tmCharcoal/60">
                              {entry.sourceLabel}
                            </p>
                          )}
                          <p className="mt-3 text-xs text-tmCharcoal/60">
                            Private by default. Only you (and a chosen mentor) can read this.
                          </p>

                          {isEditing && editor && (
                            <div className="mt-4 space-y-3 rounded-[22px] border border-tmMauve/20 bg-white/90 p-4">
                              <textarea
                                value={editor.content}
                                onChange={(event) => setEditor({ ...editor, content: event.target.value })}
                                className="min-h-[140px] w-full rounded-2xl border border-tmMauve/30 bg-tmIvory/80 px-4 py-3 text-sm text-tmCharcoal/80 outline-none"
                              />
                              {(entry.type === 'MOMENT' || entry.type === 'REFLECTION') && (
                                <input
                                  value={editor.tags}
                                  onChange={(event) => setEditor({ ...editor, tags: event.target.value })}
                                  placeholder="Emotion tags"
                                  className="w-full rounded-2xl border border-tmMauve/30 bg-white/80 px-4 py-2 text-sm text-tmCharcoal outline-none"
                                />
                              )}
                              {entry.type === 'LETTER' && (
                                <input
                                  value={editor.title}
                                  onChange={(event) => setEditor({ ...editor, title: event.target.value })}
                                  placeholder="Title"
                                  className="w-full rounded-2xl border border-tmMauve/30 bg-white/80 px-4 py-2 text-sm text-tmCharcoal outline-none"
                                />
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <button
                                  onClick={handleSaveEdit}
                                  disabled={savingEntryId === entry.id}
                                  className="rounded-full bg-tmMauve px-4 py-2 font-semibold text-white disabled:bg-tmMauve/50"
                                >
                                  {savingEntryId === entry.id ? 'Saving…' : 'Save edit'}
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="rounded-full border border-tmMauve/40 px-4 py-2 text-xs text-tmCharcoal"
                                >
                                  Keep as is
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-tmCharcoal/60">{section.emptyCopy}</p>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  </SectionLayout>
  );
}

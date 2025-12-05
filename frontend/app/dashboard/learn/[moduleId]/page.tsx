'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Auth } from '@/lib/auth.client';
import { academyClient } from '@/lib/academyClient';
import { AcademyModule, fallbackModules, journeyMeta } from '../modules';
import BreadcrumbEditorial from '@/components/academy/BreadcrumbEditorial';
import EncouragementBubble from '@/components/academy/EncouragementBubble';
import MentorNotesPanel from '@/components/academy/MentorNotesPanel';
import ModuleHeroEditorial from '@/components/academy/ModuleHeroEditorial';
import ModuleSection from '@/components/academy/ModuleSection';
import MiniMap from '@/components/academy/MiniMap';
import SlideDeckEditorial from '@/components/academy/SlideDeckEditorial';
import WorkbookEditorial from '@/components/workbook/WorkbookEditorial';
import FlowBar, { FlowBarStep } from '@/components/academy-flow/FlowBar';
import FlowCelebration from '@/components/academy-flow/FlowCelebration';
import FlowHeader from '@/components/academy-flow/FlowHeader';
import FlowNav from '@/components/academy-flow/FlowNav';
import FlowStageWrap from '@/components/academy-flow/FlowStageWrap';

const MODULE_MAP_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'explore', label: 'Explore' },
  { id: 'lecture', label: 'Lecture' },
  { id: 'workbook', label: 'Workbook' },
  { id: 'apply', label: 'Apply' },
  { id: 'notes', label: 'Notes' },
];

const splitParagraphs = (value?: string | string[]) => {
  if (!value) return [];
  const source = Array.isArray(value) ? value : [value];
  return source
    .flatMap((block) => block.split(/\n\s*\n/))
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

const splitLectureIntoSlides = (value?: string | string[]) => {
  if (!value) return [];
  const source = Array.isArray(value) ? value : [value];
  return source
    .flatMap((block) => block.split(/\n\s*\n/))
    .map((chunk) => chunk.trim())
    .filter(Boolean);
};

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const { moduleId } = params;
  const [module, setModule] = useState<AcademyModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(MODULE_MAP_SECTIONS[0].id);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchModule = async () => {
      try {
        const data = await academyClient.getModule(moduleId);
        if (!mounted) return;
        if (data) {
          setModule(data as AcademyModule);
        } else {
          setModule(fallbackModules.find((fallback) => fallback.id === moduleId) ?? null);
        }
      } catch {
        if (!mounted) return;
        setModule(fallbackModules.find((fallback) => fallback.id === moduleId) ?? null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchModule();

    return () => {
      mounted = false;
    };
  }, [moduleId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tm_user');
    if (!stored) return;
    try {
      setUser(JSON.parse(stored));
    } catch {
      // ignore malformed payload
    }
  }, []);

  useEffect(() => {
    if (!module) return;
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('tmbc:last-module', module.id);
    setActiveSection(MODULE_MAP_SECTIONS[0].id);
  }, [module]);

  const content = module?.content;
  const exploreParagraphs = useMemo(() => splitParagraphs(content?.explore), [content?.explore]);
  const applyList = useMemo(() => content?.apply ?? [], [content?.apply]);
  const noteItems = useMemo(() => {
    const notes: string[] = [];
    if (content?.resources?.length) {
      notes.push(...content.resources);
    }
    if (content?.journalPrompt) {
      notes.push(content.journalPrompt);
    }
    return notes;
  }, [content?.journalPrompt, content?.resources]);

  const lectureSlides = useMemo(() => {
    if (content?.lectureSlides?.length) {
      return content.lectureSlides;
    }
    return splitLectureIntoSlides(content?.lecture);
  }, [content?.lecture, content?.lectureSlides]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const lectureSlidesCount = lectureSlides.length;
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleSlideJump = useCallback(
    (index: number) => {
      if (!lectureSlidesCount) return;
      const clamped = Math.max(0, Math.min(lectureSlidesCount - 1, index));
      setCurrentSlide(clamped);
    },
    [lectureSlidesCount],
  );

  useEffect(() => {
    if (currentSlide >= lectureSlidesCount) {
      setCurrentSlide(Math.max(lectureSlidesCount - 1, 0));
    }
  }, [lectureSlidesCount, currentSlide]);

  const scrollTargets = useMemo(
    () => ({
      journal: '#journal',
      moodboard: '#moodboard',
      checklist: '#checklist',
      reflection: '#reflection',
      apply: '#apply',
      notes: '#notes',
      mentor: '#mentor-notes',
    }),
    [],
  );

  const sectionMap = useMemo<Record<string, string>>(
    () => ({
      '#lecture': 'lecture',
      '#journal': 'workbook',
      '#moodboard': 'workbook',
      '#checklist': 'workbook',
      '#reflection': 'workbook',
      '#apply': 'apply',
      '#notes': 'notes',
      '#mentor-notes': 'notes',
    }),
    [],
  );

  const handleSectionChange = useCallback(
    (target: string) => {
      const mapped = sectionMap[target];
      if (mapped) {
        setActiveSection(mapped);
      }
    },
    [sectionMap],
  );

  const memberId = user?.id ?? user?.userId;
  const token = (user?.token as string | undefined) ?? Auth.get() ?? undefined;
  const roleLabel = String(user?.role ?? '').toLowerCase();
  const canWrite = roleLabel === 'mentor' || roleLabel === 'admin';

  if (loading) {
    return <div className="text-center py-20 text-[var(--tm-charcoal)]/60">Loading module...</div>;
  }

  if (!module) {
    return (
      <div className="text-center py-20 text-[var(--tm-charcoal)]/60">
        Module not found - check your invite path.
      </div>
    );
  }

  const activeLabel =
    MODULE_MAP_SECTIONS.find((section) => section.id === activeSection)?.label ?? 'Overview';

  const currentStepIndex = MODULE_MAP_SECTIONS.findIndex((entry) => entry.id === activeSection);
  const flowSteps: FlowBarStep[] = MODULE_MAP_SECTIONS.map((section, index) => ({
    label: section.label,
    description: index === 0 ? 'Welcome notes' : 'Continue the journey',
    completed: currentStepIndex >= 0 && index <= currentStepIndex,
  }));

  return (
    <div className="space-y-10">
      <BreadcrumbEditorial
        journeyLabel={journeyMeta[module.journey].label}
        moduleTitle={module.title}
        sectionLabel={activeLabel}
      />

      <ModuleHeroEditorial module={module} />

      <FlowHeader
        stageLabel={`${journeyMeta[module.journey].label} · Module ${module.order}`}
        title="Academy Flow System"
        description="Soft choreography for your learning—each section feels like a hush of expertise."
        status="Invite-only · Guided by mentors"
      />

      <div className="space-y-6">
        <FlowBar steps={flowSteps} />
        <FlowNav sections={MODULE_MAP_SECTIONS} activeId={activeSection} onSectionChange={setActiveSection} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="w-full lg:sticky lg:top-24">
          <MiniMap
            slidesCount={lectureSlides.length}
            currentSlide={currentSlide}
            onSlideJump={handleSlideJump}
            scrollTargets={scrollTargets}
            onSectionChange={handleSectionChange}
          />
        </div>
        <FlowStageWrap>
          <ModuleSection
            id="overview"
            title="Overview"
            description={`${module.registryFocus} • ${module.subtitle}`}
            className="bg-[var(--tm-ivory)]/70"
          >
            <p className="leading-relaxed text-[var(--tm-charcoal)]/80">{module.description}</p>
          </ModuleSection>

          <ModuleSection id="explore" title="Explore" description="Warm-up notes">
            <div className="space-y-4">
              {exploreParagraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-[var(--tm-charcoal)]/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </ModuleSection>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <section
                id="lecture"
                className="space-y-6 rounded-[32px] border border-[var(--tm-blush)] bg-white/80 p-6 shadow-editorial shadow-[0_30px_60px_rgba(134,75,95,0.18)]"
              >
                <div className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
                    Lecture atelier
                  </p>
                  <h3 className="tm-serif-title text-3xl leading-tight text-[var(--tm-deep-mauve)]">
                    Slide-based journal
                  </h3>
                  <p className="text-sm text-[var(--tm-charcoal)]/70">
                    Glide through the curated narrative, pause on each frame, and let the story gently unfold.
                  </p>
                </div>
                <div className="pt-4">
                  <SlideDeckEditorial
                    slides={lectureSlides}
                    slideIndex={currentSlide}
                    onSlideChange={handleSlideChange}
                  />
                </div>
              </section>

              <section id="workbook" className="space-y-6">
                <div aria-hidden className="pointer-events-none">
                  <div id="journal" className="h-px" />
                  <div id="moodboard" className="h-px" />
                  <div id="checklist" className="h-px" />
                  <div id="reflection" className="h-px" />
                </div>
                <EncouragementBubble>
                  <WorkbookEditorial module={module} />
                </EncouragementBubble>
              </section>
            </div>

            {memberId && token && (
              <MentorNotesPanel
                memberId={memberId}
                moduleId={module.id}
                token={token}
                canWrite={canWrite}
              />
            )}
          </div>

          <ModuleSection id="apply" title="Apply" description="Bring the atelier to life">
            <ul className="space-y-3 text-[var(--tm-charcoal)]/80">
              {applyList.length ? (
                applyList.map((item, index) => (
                  <li key={index} className="list-disc pl-5 text-sm leading-relaxed">
                    {item}
                  </li>
                ))
              ) : (
                <p className="text-sm leading-relaxed text-[var(--tm-charcoal)]/80">
                  Capture three focused actions to keep the momentum steady.
                </p>
              )}
            </ul>
          </ModuleSection>

          <ModuleSection id="notes" title="Notes" description="Resources & whispers">
            <div id="mentor-notes" className="h-px" aria-hidden />
            <div className="space-y-4">
              {noteItems.length ? (
                noteItems.map((item, index) => (
                  <p key={index} className="rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-[var(--tm-charcoal)]/80">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-relaxed text-[var(--tm-charcoal)]/70">
                  No additional notes here yet, but a graceful space is reserved for your reflections.
                </p>
              )}
            </div>
          </ModuleSection>
        </FlowStageWrap>
      </div>
      <FlowCelebration
        highlight="Milestone unlocked"
        message="One completed studio, many soft steps ahead."
      />
    </div>
  );
}

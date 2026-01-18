"use client";

// TODO: Integrate recording controls and storage once voice APIs are available.
export default function VoiceNotesSection() {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-white/90 p-5">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Voice Notes</p>
        <h2 className="text-xl font-semibold text-[#3E2F35]">Sometimes it’s easier to speak than write.</h2>
      </div>
      <div className="flex flex-col items-start gap-3 text-sm text-[#3E2F35]/70">
        <div className="rounded-[1rem] border border-dashed border-[#A4556A] px-4 py-3 text-[0.75rem] uppercase tracking-[0.4em] text-[#A4556A]">
          Record a voice note
        </div>
        <p className="text-xs text-[#3E2F35]/60">
          The microphone is silent for now — this area will become a secure recorder once the backend is ready.
        </p>
      </div>
    </section>
  );
}

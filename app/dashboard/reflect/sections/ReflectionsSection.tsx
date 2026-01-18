"use client";

// TODO: Capture these reflections with auto-save to the vault once persistence is hooked up.
const PROMPTS = [
  "How are you feeling today?",
  "What surprised you this week?",
  "What do you want to remember from this moment?",
];

export default function ReflectionsSection() {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-white/90 p-5">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Reflections</p>
        <h2 className="text-xl font-semibold text-[#3E2F35]">Jot what is still forming</h2>
      </div>
      <div className="space-y-4">
        {PROMPTS.map((prompt) => (
          <label key={prompt} className="space-y-2 text-sm text-[#3E2F35]/70">
            <span className="text-[#3E2F35]">{prompt}</span>
            <textarea
              rows={4}
              placeholder="Write freely — there is no right amount."
              className="w-full rounded-[1rem] border border-[#E3C6D4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

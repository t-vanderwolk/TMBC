import { saveIntakeStep } from "@/app/onboarding/actions";

export default function Emotional() {
  return (
    <form
      action={saveIntakeStep}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <input type="hidden" name="step" value="emotional" />
      <input type="hidden" name="nextStep" value="/onboarding/results" />
      <h2 className="font-serif text-3xl text-[#3E2F35]">Emotional check-in</h2>
      <p className="text-sm text-[#3E2F35]/70">
        How can we keep your inner rhythm calm and resilient?
      </p>
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        What emotion are you carrying most right now?
        <input
          name="emotion"
          className="mt-2 rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]"
          placeholder="Joy, overwhelmed, hopeful…"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-tmMauve px-4 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white"
      >
        Save & see your results
      </button>
    </form>
  );
}

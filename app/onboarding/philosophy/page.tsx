import { saveIntakeStep } from "@/app/onboarding/actions";

export default function Philosophy() {
  return (
    <form
      action={saveIntakeStep}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <input type="hidden" name="step" value="philosophy" />
      <input type="hidden" name="nextStep" value="/onboarding/budget" />
      <h2 className="font-serif text-3xl text-[#3E2F35]">Philosophy</h2>
      <p className="text-sm text-[#3E2F35]/70">
        How do you want to show up for your family during this season?
      </p>
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Describe the core value that guides your parenting practice.
        <textarea
          name="philosophy"
          rows={3}
          className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Presence, ease, ritual, playful intention…"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-tmMauve px-4 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white"
      >
        Save & continue
      </button>
    </form>
  );
}

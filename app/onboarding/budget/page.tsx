import { saveIntakeStep } from "@/app/onboarding/actions";

export default function Budget() {
  return (
    <form
      action={saveIntakeStep}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <input type="hidden" name="step" value="budget" />
      <input type="hidden" name="nextStep" value="/onboarding/emotional" />
      <h2 className="font-serif text-3xl text-[#3E2F35]">Budget</h2>
      <p className="text-sm text-[#3E2F35]/70">
        Share what feels luxe vs. practical so we tailor intel to you.
      </p>
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        Where do you want to splurge (details, rituals, education)?
        <input
          name="splurge"
          className="mt-2 rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]"
          placeholder="Nursery armchair, mentor consultations…"
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

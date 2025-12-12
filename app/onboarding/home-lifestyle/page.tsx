import { saveIntakeStep } from "@/app/onboarding/actions";

export default function HomeLifestyle() {
  return (
    <form
      action={saveIntakeStep}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <input type="hidden" name="step" value="home-lifestyle" />
      <input type="hidden" name="nextStep" value="/onboarding/mobility" />
      <h2 className="font-serif text-3xl text-[#3E2F35]">Home & lifestyle</h2>
      <p className="text-sm text-[#3E2F35]/70">
        Tell us about your rituals so we can reflect them in your registry.
      </p>
      <label className="flex flex-col gap-2 text-sm text-[#3E2F35]">
        How would you describe the feeling of your home?
        <textarea
          name="homeFeeling"
          rows={4}
          className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
          placeholder="Warm blush, collected woods, or airy modern?"
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

"use client";

// TODO: Hook these inputs up to auto-save inputs backed by the Reflect data model.
export default function BabyDetailsSection() {
  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[#F1D5DA] bg-white/90 p-5">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Baby Details</p>
        <h2 className="text-xl font-semibold text-[#3E2F35]">Softly keep track of the ideas forming today</h2>
      </div>
      <div className="space-y-3">
        <label className="block space-y-1 text-sm text-[#3E2F35]/70">
          Names you’re considering
          <input
            placeholder="Perhaps a name that feels like home"
            className="w-full rounded-[1rem] border border-[#E3C6D4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
          />
        </label>
        <label className="block space-y-1 text-sm text-[#3E2F35]/70">
          Due date (if you like)
          <input
            type="date"
            className="w-full rounded-[1rem] border border-[#E3C6D4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]"
          />
        </label>
        <label className="block space-y-1 text-sm text-[#3E2F35]/70">
          Baby sex (optional)
          <select className="w-full rounded-[1rem] border border-[#E3C6D4] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EAC9D1]">
            <option>Prefer not to say</option>
            <option>Girl</option>
            <option>Boy</option>
            <option>Not sure yet</option>
          </select>
        </label>
        <div className="rounded-[1rem] border border-dashed border-[#E3C6D4] px-4 py-5 text-sm text-[#3E2F35]/70">
          <p className="font-semibold text-[#3E2F35]">Ultrasound photo</p>
          <p className="text-xs uppercase tracking-[0.4em] text-[#A4556A]">Upload placeholder</p>
          <p className="mt-2 text-[0.8rem] text-[#3E2F35]/60">Drop a photo when you feel ready.</p>
        </div>
      </div>
    </section>
  );
}

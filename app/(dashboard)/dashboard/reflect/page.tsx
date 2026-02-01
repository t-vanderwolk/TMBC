"use client";

import ReflectLayout from "./ReflectLayout";

export default function ReflectPage() {
  return (
    <div className="space-y-10 px-4 py-10 sm:px-6">
      <section className="space-y-2 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 px-6 py-8 text-center shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#C8A1B4]">My Baby Book</p>
        <h1 className="text-4xl font-serif text-[#3E2F35]">Reflect</h1>
        <p className="mx-auto max-w-2xl text-sm text-[#3E2F35]/70">
          A quiet place to hold this season. There is no expectation, only this gentle invitation to
          note what matters today.
        </p>
      </section>
      <ReflectLayout />
    </div>
  );
}

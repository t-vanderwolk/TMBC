"use client";

type FlowCelebrationProps = {
  message: string;
  highlight: string;
};

const FlowCelebration = ({ message, highlight }: FlowCelebrationProps) => (
  <section className="rounded-[40px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-mauve)]/80 via-[var(--tmbc-blush)]/60 to-[var(--tmbc-mauve)]/80 p-6 text-center text-[var(--tmbc-ivory)] shadow-[0_35px_90px_rgba(199,166,199,0.35)]">
    <p className="text-[0.65rem] uppercase tracking-[0.5em]">{highlight}</p>
    <h3 className="mt-2 font-serif text-2xl">{message}</h3>
  </section>
);

export default FlowCelebration;

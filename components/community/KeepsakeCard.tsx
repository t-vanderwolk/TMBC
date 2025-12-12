"use client";

interface KeepsakeCardProps {
  title: string;
  detail: string;
  moments: string[];
  link?: string;
  unlockDate?: string;
}

export default function KeepsakeCard({
  title,
  detail,
  moments,
  link,
  unlockDate,
}: KeepsakeCardProps) {
  return (
    <article className="rounded-3xl border border-[#D7BDCB] bg-white p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)] transition hover:-translate-y-1 hover:border-[#C8A1B4]">
      <p className="text-[0.45rem] uppercase tracking-[0.5em] text-[#C8A1B4]">Virtual time capsule</p>
      <h3 className="text-xl font-serif text-[#3E2F35]">{title}</h3>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{detail}</p>
      <ul className="mt-4 space-y-2 text-xs text-[#3E2F35]/70">
        {moments.map((moment) => (
          <li key={moment} className="flex items-start gap-2">
            <span className="mt-0.5 h-2 w-2 rounded-full bg-[#C8A1B4]" />
            <span>{moment}</span>
          </li>
        ))}
      </ul>
      {unlockDate && (
        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-[#B98AA5]">
          Unlocks on {unlockDate}
        </p>
      )}
      {link && (
        <a
          href={link}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:text-[#B98AA5]"
        >
          Open capsule →
        </a>
      )}
    </article>
  );
}

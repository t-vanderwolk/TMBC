import Link from "next/link";

const DAY_MS = 1000 * 60 * 60 * 24;

type PregnancyMomentCardProps = {
  dueDate?: string | Date | null;
  userName?: string | null;
};

const toDateInstance = (value?: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function PregnancyMomentCard({ dueDate, userName }: PregnancyMomentCardProps) {
  const dueDateInstance = toDateInstance(dueDate);
  const now = new Date();
  const daysRemaining =
    dueDateInstance !== null
      ? Math.max(0, Math.ceil((dueDateInstance.getTime() - now.getTime()) / DAY_MS))
      : null;
  const weeksRemaining = daysRemaining !== null ? Math.ceil(daysRemaining / 7) : null;
  const introduction = userName
    ? `${userName}, today is about listening inward; your body is doing meaningful work, even when it feels quiet.`
    : "Today is about listening inward; your body is doing meaningful work, even when it feels quiet.";

  const hasDueDate = daysRemaining !== null;
  const primaryCopy = hasDueDate ? `${daysRemaining} days to go` : "Your timeline will appear once your due date is added.";
  const secondaryCopy = hasDueDate
    ? "Every day is optional. You’re doing beautifully."
    : "Add your due date so we can guide the week beside you.";

  return (
    <div className="rounded-[2rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_20px_40px_rgba(84,35,52,0.12)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Your pregnancy moment</p>
      <h3 className="mt-2 font-serif text-2xl text-[#3E2F35]">Gentle rhythm, right now</h3>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{introduction}</p>
      <div className="mt-6">
        <p className="text-3xl font-serif text-[#3E2F35]">{primaryCopy}</p>
        <p className="mt-2 text-sm text-[#3E2F35]/70">{secondaryCopy}</p>
        {hasDueDate && weeksRemaining !== null && (
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/50">
            ~{weeksRemaining} week{weeksRemaining === 1 ? "" : "s"} remain
          </p>
        )}
        {!hasDueDate && (
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5] transition hover:text-[#A56B89]"
          >
            Share your due date
          </Link>
        )}
      </div>
    </div>
  );
}

type MentorReviewBadgeProps = {
  state: "Not reviewed" | "Reviewed" | "Needs discussion";
};

export default function MentorReviewBadge({ state }: MentorReviewBadgeProps) {
  return (
    <section className="rounded-[28px] border border-dashed border-[#EAE2E8] bg-[#FFF9F5] p-5 text-sm text-[#3E2F35]/80 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Mentor review</p>
      <p className="mt-2 text-lg font-semibold text-[#3E2F35]">{state}</p>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">TODO: Bind to mentor review events</p>
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
        TODO: Show timestamp & mentor name
      </p>
    </section>
  );
}

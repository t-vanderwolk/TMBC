export type MenteeRosterEntry = {
  id: string;
  name: string;
  trimester: string;
  lastInteraction: string;
  focus: string;
  dueDate: string;
  status: "Needs attention" | "On track" | "Flagged";
};

type MenteeRosterPreviewProps = {
  mentees: MenteeRosterEntry[];
};

const statusColor = (status: string) => {
  switch (status) {
    case "Needs attention":
      return "bg-[#C8A1B4]";
    case "Flagged":
      return "bg-[#D4B579]";
    default:
      return "bg-[#C8A1B4]/50";
  }
};

export default function MenteeRosterPreview({ mentees }: MenteeRosterPreviewProps) {
  if (!mentees.length) {
    return <p>No mentees assigned yet.</p>;
  }

  return (
    <div className="mentor-roster">
      {mentees.map((mentee) => (
        <div key={mentee.id} className="mentor-card">
          <div className="mentor-card__header">
            <span className={`mentor-card__dot ${statusColor(mentee.status)}`} />
            <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
              {mentee.trimester}
            </p>
          </div>
          <h3 className="mt-2 font-serif text-lg text-[#3E2F35]">{mentee.name}</h3>
          <p className="text-sm text-[#3E2F35]/70">{mentee.focus}</p>
          <p className="mt-3 text-xs text-[#3E2F35]/60">{mentee.lastInteraction}</p>
          <div className="mentor-card__actions">
            <button type="button" className="mentor-card__action">
              Message
            </button>
            <button type="button" className="mentor-card__action">
              Notes
            </button>
            <button type="button" className="mentor-card__action">
              Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

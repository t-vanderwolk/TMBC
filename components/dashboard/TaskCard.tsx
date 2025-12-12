"use client";

type TaskCardProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

export default function TaskCard({ title, description, onClick }: TaskCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-[2rem] border border-[#EAD4D8] bg-white p-6 shadow-[0_12px_30px_rgba(200,161,180,0.1)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(200,161,180,0.15)]"
    >
      <h3 className="font-serif text-lg text-[#3E2F35]">{title}</h3>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{description}</p>
    </button>
  );
}

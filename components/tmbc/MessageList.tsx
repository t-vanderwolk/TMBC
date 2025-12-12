export type MessageListProps = {
  threads: {
    id: string;
    title: string;
    preview: string;
    updatedAt: string;
  }[];
  activeId?: string;
  onSelect: (id: string) => void;
};

export default function MessageList({ threads, activeId, onSelect }: MessageListProps) {
  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <button
          key={thread.id}
          type="button"
          onClick={() => onSelect(thread.id)}
          className={`w-full rounded-[1.8rem] border px-4 py-3 text-left text-sm ${
            activeId === thread.id ? "border-[#B98AA5] bg-[#FFF2F6]" : "border-[#E3C6D4] bg-white"
          }`}
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">
            <span>{thread.title}</span>
            <span>{new Date(thread.updatedAt).toLocaleTimeString()}</span>
          </div>
          <p className="mt-2 text-[#3E2F35]/75">{thread.preview}</p>
        </button>
      ))}
    </div>
  );
}

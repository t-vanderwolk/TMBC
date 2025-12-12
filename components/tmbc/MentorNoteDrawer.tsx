"use client";

import { useState } from "react";

export type MentorNoteDrawerProps = {
  notes: string | string[];
};

export default function MentorNoteDrawer({ notes }: MentorNoteDrawerProps) {
  const [open, setOpen] = useState(false);
  const noteList = Array.isArray(notes) ? notes : [notes];
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-xs font-semibold uppercase tracking-[0.4em] text-[#C7A6C9]"
      >
        {open ? "Hide mentor notes" : "Show mentor notes"}
      </button>
      {open && (
        <div className="mt-2 space-y-2 rounded-[1.5rem] border border-dashed border-[#E3C6D4] bg-[#FFF8F6]/80 p-3 text-xs text-[#3E2F35]/75">
          {noteList.map((note, index) => (
            <p key={`${note}-${index}`}>{note}</p>
          ))}
        </div>
      )}
    </div>
  );
}

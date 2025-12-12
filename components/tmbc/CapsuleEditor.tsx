"use client";

import { useState } from "react";
import StyledButton from "@/components/tmbc/StyledButton";
import StyledInput from "@/components/tmbc/StyledInput";
import StyledTextArea from "@/components/tmbc/StyledTextArea";

export default function CapsuleEditor() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("letter");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <h2 className="text-lg font-semibold text-[#3E2F35]">Create a new capsule</h2>
      <StyledInput
        placeholder="Capsule name"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <StyledInput
        placeholder="Type (letter, audio, photo...)"
        value={type}
        onChange={(event) => setType(event.target.value)}
      />
      <StyledTextArea
        rows={4}
        placeholder="What should this capsule capture?"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <StyledButton>Save & return to vault</StyledButton>
    </div>
  );
}

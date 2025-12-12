"use client";

import { useState } from "react";
import StyledButton from "@/components/tmbc/StyledButton";

export default function EmotionTrigger() {
  const [triggered, setTriggered] = useState(false);
  return (
    <div className="space-y-3 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <p className="text-sm font-semibold text-[#3E2F35]">Overwhelmed?</p>
      <p className="text-xs uppercase tracking-[0.4em] text-[#C7A6C9]">
        Create a draft capsule and breathe.
      </p>
      <StyledButton
        variant="ghost"
        onClick={() => setTriggered(true)}
      >
        Capture a calm moment
      </StyledButton>
      {triggered && (
        <p className="text-xs text-[#B98AA5]">Draft capsule ready. Breathe with us.</p>
      )}
    </div>
  );
}

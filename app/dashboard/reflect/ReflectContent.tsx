"use client";

import BabyDetailsSection from "./sections/BabyDetailsSection";
import MemoriesSection from "./sections/MemoriesSection";
import ReflectionsSection from "./sections/ReflectionsSection";
import VoiceNotesSection from "./sections/VoiceNotesSection";
import VaultStatusSection from "./sections/VaultStatusSection";
import WelcomeSection from "./sections/WelcomeSection";
import OptionalShareHint from "./components/OptionalShareHint";

export default function ReflectContent() {
  // TODO: Load section state from persisted storage once the persistence layer is ready.
  return (
    <div className="space-y-10 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <WelcomeSection />
      <OptionalShareHint />
      <BabyDetailsSection />
      <MemoriesSection />
      <ReflectionsSection />
      <VoiceNotesSection />
      <VaultStatusSection />
    </div>
  );
}

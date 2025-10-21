import React from "react";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";

const prompts = [
  {
    title: "Today&apos;s Little Moment",
    prompt:
      "What made your baby smile today? Capture the details so you can relive it later.",
  },
  {
    title: "Self-Care Check",
    prompt:
      "How did you care for yourself this week? Even small rituals count.",
  },
];

export default function JournalScreen() {
  return (
    <ScreenContainer
      activeRoute="Journal"
      contentClassName="px-6 pt-6 pb-16 gap-6"
    >
      <TMCard className="gap-3 bg-ivory/90">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-widest">
          Reflections
        </TMText>
        <TMText className="text-charcoal text-2xl font-bold">
          Keep the Story of This Season
        </TMText>
        <TMText className="text-charcoal/75 text-sm">
          Capture milestones, shifts, and heart moments. Your journal is private
          unless you choose to share it with your concierge.
        </TMText>
        <TMButton label="Start a Journal Entry" onPress={() => {}} />
      </TMCard>

      {prompts.map((item) => (
        <TMCard key={item.title} className="gap-3">
          <TMText className="text-charcoal text-lg font-semibold">
            {item.title}
          </TMText>
          <TMText className="text-charcoal/70 text-sm">{item.prompt}</TMText>
          <TMButton label="Write" variant="outline" onPress={() => {}} />
        </TMCard>
      ))}

      <TMCard className="gap-3">
        <TMText className="text-charcoal text-lg font-semibold">
          Share with Concierge
        </TMText>
        <TMText className="text-charcoal/70 text-sm">
          Toggle sharing for any entry to give your concierge insight before a
          session.
        </TMText>
        <TMButton label="Manage Entries" variant="secondary" onPress={() => {}} />
      </TMCard>
    </ScreenContainer>
  );
}

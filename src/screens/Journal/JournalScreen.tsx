import React from "react";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";

const prompts = [
  {
    title: "Today's Little Moment",
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
    <ScreenContainer activeRoute="Journal" contentClassName="gap-6 pb-16">
      <TMCard className="gap-3 bg-ivory/95">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Reflections
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Keep the Story of This Season
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          Capture milestones, shifts, and heart moments. Your journal is private
          unless you choose to share it with your concierge.
        </TMText>
        <TMButton label="Start a Journal Entry" onPress={() => {}} />
      </TMCard>

      {prompts.map((item) => (
        <TMCard key={item.title} className="gap-3">
          <TMText className="font-playfair text-lg text-charcoal">
            {item.title}
          </TMText>
          <TMText className="text-charcoal/70 text-sm">{item.prompt}</TMText>
          <TMButton label="Write" variant="outline" onPress={() => {}} />
        </TMCard>
      ))}

      <TMCard className="gap-3">
        <TMText className="font-playfair text-lg text-charcoal">
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

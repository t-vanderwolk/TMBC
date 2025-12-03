export function generateWorkbookSuggestions({
  journal,
  tiles,
  checklist,
}: {
  journal?: string;
  tiles?: Array<{ caption?: string }>;
  checklist?: Array<{ text?: string }>;
}) {
  const ideas: string[] = [];

  if (journal?.toLowerCase().includes('overwhelmed')) {
    ideas.push('Try reducing one décor area to lower visual load.');
  }

  if (tiles?.some((t) => t.caption?.toLowerCase().includes('wood'))) {
    ideas.push('Match wood tones for a warmer, cohesive look.');
  }

  if ((checklist?.length ?? 0) > 3) {
    ideas.push('Consider grouping checklist items into “Today” and “Later”.');
  }

  return ideas.slice(0, 3);
}

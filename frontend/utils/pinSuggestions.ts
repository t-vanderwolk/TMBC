import type { MoodboardTile } from '@/hooks/useWorkbook';

const brandMatchers = [
  { name: 'West Elm', pattern: /\bwest\s?elm\b/i },
  { name: 'Pottery Barn', pattern: /\bpottery\s?barn\b/i },
  { name: 'CB2', pattern: /\bcb2\b/i },
  { name: 'Anthropologie', pattern: /\banthropologie\b/i },
  { name: 'IKEA', pattern: /\bikea\b/i },
  { name: 'Crate & Barrel', pattern: /\bcrate\s?&\s?barrel\b/i },
  { name: 'RH', pattern: /\brh\b/i },
];

export const detectBrandFromText = (text?: string | null) => {
  if (!text) return null;
  const normalized = text.toLowerCase();
  const match = brandMatchers.find((brand) => brand.pattern.test(normalized));
  return match?.name ?? null;
};

export function generatePinSuggestions(tiles: MoodboardTile[]) {
  const trimmed = tiles.map((tile) => tile.caption ?? '');
  const suggestions: string[] = [];

  if (trimmed.some((caption) => /\b(wood|rattan|warm|earth|cozy)\b/i.test(caption))) {
    suggestions.push(
      'Your pins lean warm + natural — consider adding a neutral rug or woven basket to anchor the palette.',
    );
  }

  if (trimmed.some((caption) => /\b(modern|minimal|sleek|graphic)\b/i.test(caption))) {
    suggestions.push(
      'Loving your modern picks — mix in matte black hardware or linear lighting for sleek balance.',
    );
  }

  const detectedBrands = Array.from(
    new Set(tiles.map((tile) => detectBrandFromText(tile.caption)).filter(Boolean)),
  ) as string[];
  detectedBrands.forEach((brand) => {
    suggestions.push(`Spotted ${brand} energy — treat it like a capsule and lean into its curated finishes.`);
  });

  return suggestions.slice(0, 3);
}

import githubColors from '../data/colors.json';
import brandColors from '../data/brand-colors.json';
import languageAliases from '../data/language-aliases.json';

type GitHubLanguageColors = Record<
  string,
  { color: string | null; url: string }
>;

// Predefined color palette for tags with good contrast and accessibility
export const TAG_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#f59e0b', // amber-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#0284c7', // sky-600
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
] as const;

// Brand and application colors for popular tags (imported from data file)
export const BRAND_COLORS = brandColors as Record<string, string>;

// Language aliases mapping (imported from data file)
const aliases = languageAliases as Record<string, string>;

// Simple hash function to consistently map tag names to colors
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent color for a tag name using hashing
 * Same tag name will always return the same color
 */
export function getHashedTagColor(tagName: string): string {
  const hash = simpleHash(tagName.toLowerCase().trim());
  const colorIndex = hash % TAG_COLORS.length;
  return TAG_COLORS[colorIndex];
}

/**
 * Get predefined color for a tag name, checking brand colors and GitHub language colors
 * @param tagName - The name of the tag (will be normalized to lowercase)
 * @returns The hex color string (with #) or undefined if not found
 */
export function getPredefinedColor(tagName: string): string | undefined {
  if (!tagName) return undefined;

  const normalizedName = tagName.toLowerCase().trim();

  // First check brand colors
  if (BRAND_COLORS[normalizedName]) {
    return BRAND_COLORS[normalizedName].toLowerCase();
  }

  const colors = githubColors as unknown as GitHubLanguageColors;

  // Then try exact match in GitHub colors
  if (colors[tagName]) {
    return colors[tagName].color?.toLowerCase() || undefined;
  }

  // Try case-insensitive match in GitHub colors
  const languageKey = Object.keys(colors).find(
    key => key.toLowerCase() === normalizedName
  );

  if (languageKey) {
    return colors[languageKey].color?.toLowerCase() || undefined;
  }

  // Try common variations and aliases for GitHub languages
  if (aliases[normalizedName]) {
    const aliasedLanguage = aliases[normalizedName];
    return colors[aliasedLanguage]?.color?.toLowerCase() || undefined;
  }

  return undefined;
}

// Keep the old function name as an alias for backward compatibility during transition
export const getLanguageColor = getPredefinedColor;

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
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
] as const;

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

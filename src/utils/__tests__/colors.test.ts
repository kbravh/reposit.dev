import { describe, it, expect } from 'vitest';
import { getHashedTagColor, TAG_COLORS } from '../colors';

describe('colors utilities', () => {
  describe('getHashedTagColor', () => {
    it('should return consistent colors for the same tag name', () => {
      const tagName = 'javascript';
      const color1 = getHashedTagColor(tagName);
      const color2 = getHashedTagColor(tagName);

      expect(color1).toBe(color2);
    });

    it('should be case insensitive and trim whitespace', () => {
      const color1 = getHashedTagColor('JavaScript');
      const color2 = getHashedTagColor('javascript');
      const color3 = getHashedTagColor('  javascript  ');

      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
    });

    it('should return colors from the predefined palette', () => {
      const testTags = ['dog', 'cat', 'javascript', 'react', 'vue', 'angular'];

      testTags.forEach(tag => {
        const color = getHashedTagColor(tag);
        expect(TAG_COLORS).toContain(color);
      });
    });

    it('should return valid hex color codes', () => {
      const testTags = ['dog', 'cat', 'javascript', 'react'];
      const hexColorRegex = /^#[0-9a-f]{6}$/i;

      testTags.forEach(tag => {
        const color = getHashedTagColor(tag);
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should distribute different tag names across different colors', () => {
      const testTags = [
        'dog',
        'cat',
        'javascript',
        'react',
        'vue',
        'angular',
        'python',
        'java',
      ];
      const colors = testTags.map(tag => getHashedTagColor(tag));
      const uniqueColors = new Set(colors);

      // With 8 different tags and 12 colors, we should get some distribution
      // (though collisions are possible with hashing)
      expect(uniqueColors.size).toBeGreaterThan(1);
    });

    it('should handle edge cases', () => {
      expect(() => getHashedTagColor('')).not.toThrow();
      expect(() => getHashedTagColor(' ')).not.toThrow();
      expect(() => getHashedTagColor('a')).not.toThrow();

      // Should return valid colors even for edge cases
      expect(TAG_COLORS).toContain(getHashedTagColor(''));
      expect(TAG_COLORS).toContain(getHashedTagColor(' '));
      expect(TAG_COLORS).toContain(getHashedTagColor('a'));
    });
  });
});

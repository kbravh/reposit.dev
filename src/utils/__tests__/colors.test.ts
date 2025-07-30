import { describe, it, expect } from 'vitest';
import { getHashedTagColor, TAG_COLORS, getPredefinedColor } from '../colors';

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

  describe('getPredefinedColor', () => {
    it('should return verified brand colors', () => {
      expect(getPredefinedColor('obsidian')).toBe('#8758ff');
      expect(getPredefinedColor('twitter')).toBe('#1da1f2');
      expect(getPredefinedColor('facebook')).toBe('#1877f2');
      expect(getPredefinedColor('github')).toBe('#181717');
      expect(getPredefinedColor('google')).toBe('#4285f4');
    });

    it('should be case insensitive for brand colors', () => {
      expect(getPredefinedColor('OBSIDIAN')).toBe('#8758ff');
      expect(getPredefinedColor('TWITTER')).toBe('#1da1f2');
      expect(getPredefinedColor('GitHub')).toBe('#181717');
      expect(getPredefinedColor('GOOGLE')).toBe('#4285f4');
    });

    it('should return GitHub language colors when no brand color exists', () => {
      // These should fall back to GitHub language colors since they're not in our brand list
      expect(getPredefinedColor('JavaScript')).toBe('#f1e05a');
      expect(getPredefinedColor('Python')).toBe('#3572a5');
      expect(getPredefinedColor('TypeScript')).toBe('#3178c6');
      expect(getPredefinedColor('Java')).toBe('#b07219');
      expect(getPredefinedColor('Go')).toBe('#00add8');
      expect(getPredefinedColor('Vue')).toBe('#42b883'); // GitHub Vue color, not a brand color
    });

    it('should return color for case-insensitive match', () => {
      expect(getPredefinedColor('javascript')).toBe('#f1e05a');
      expect(getPredefinedColor('PYTHON')).toBe('#3572a5');
      expect(getPredefinedColor('typescript')).toBe('#3178c6');
      expect(getPredefinedColor('JAVA')).toBe('#b07219');
    });

    it('should return color for common aliases', () => {
      expect(getPredefinedColor('js')).toBe('#f1e05a'); // JavaScript
      expect(getPredefinedColor('ts')).toBe('#3178c6'); // TypeScript
      expect(getPredefinedColor('py')).toBe('#3572a5'); // Python
      expect(getPredefinedColor('cpp')).toBe('#f34b7d'); // C++
      expect(getPredefinedColor('c++')).toBe('#f34b7d'); // C++
      expect(getPredefinedColor('cs')).toBe('#178600'); // C#
      expect(getPredefinedColor('c#')).toBe('#178600'); // C#
      expect(getPredefinedColor('csharp')).toBe('#178600'); // C#
      expect(getPredefinedColor('golang')).toBe('#00add8'); // Go
      expect(getPredefinedColor('rs')).toBe('#dea584'); // Rust
      expect(getPredefinedColor('rb')).toBe('#701516'); // Ruby
    });

    it('should return color for shell and scripting aliases', () => {
      expect(getPredefinedColor('bash')).toBe('#89e051'); // Shell
      expect(getPredefinedColor('sh')).toBe('#89e051'); // Shell
      expect(getPredefinedColor('shell')).toBe('#89e051'); // Shell
      expect(getPredefinedColor('powershell')).toBe('#012456'); // PowerShell
      expect(getPredefinedColor('ps1')).toBe('#012456'); // PowerShell
    });

    it('should return color for web technologies', () => {
      expect(getPredefinedColor('html')).toBe('#e34c26'); // HTML
      expect(getPredefinedColor('css')).toBe('#663399'); // CSS
      expect(getPredefinedColor('scss')).toBe('#c6538c'); // SCSS
      expect(getPredefinedColor('sass')).toBe('#a53b70'); // Sass
      expect(getPredefinedColor('vue')).toBe('#42b883'); // GitHub Vue color
    });

    it('should return color for functional languages', () => {
      expect(getPredefinedColor('haskell')).toBe('#5e5086'); // Haskell
      expect(getPredefinedColor('hs')).toBe('#5e5086'); // Haskell
      expect(getPredefinedColor('clojure')).toBe('#db5855'); // Clojure
      expect(getPredefinedColor('clj')).toBe('#db5855'); // Clojure
      expect(getPredefinedColor('elixir')).toBe('#6e4a7e'); // Elixir
      expect(getPredefinedColor('ex')).toBe('#6e4a7e'); // Elixir
      expect(getPredefinedColor('elm')).toBe('#60b5cc'); // Elm
    });

    it('should return color for systems languages', () => {
      expect(getPredefinedColor('c')).toBe('#555555'); // C
      expect(getPredefinedColor('rust')).toBe('#dea584'); // Rust
      expect(getPredefinedColor('zig')).toBe('#ec915c'); // Zig
      expect(getPredefinedColor('nim')).toBe('#ffc200'); // Nim
      expect(getPredefinedColor('assembly')).toBe('#6e4c13'); // Assembly
      expect(getPredefinedColor('asm')).toBe('#6e4c13'); // Assembly
    });

    it('should return undefined for tags that do not exist', () => {
      expect(getPredefinedColor('NonExistentLanguage')).toBeUndefined();
      expect(getPredefinedColor('FakeScript')).toBeUndefined();
      expect(getPredefinedColor('MadeUpLang')).toBeUndefined();
    });

    it('should return undefined for empty or null input', () => {
      expect(getPredefinedColor('')).toBeUndefined();
      expect(getPredefinedColor(' ')).toBeUndefined();
    });

    it('should handle languages with null colors gracefully', () => {
      // Some languages in the GitHub colors file have null colors
      // Our function should return undefined for these
      const result = getPredefinedColor('ASL'); // ASL has null color in the data
      expect(result).toBeUndefined();
    });

    it('should handle special characters and numbers in language names', () => {
      expect(getPredefinedColor('F#')).toBe('#b845fc'); // F#
      expect(getPredefinedColor('f#')).toBe('#b845fc'); // F# case insensitive
      expect(getPredefinedColor('fsharp')).toBe('#b845fc'); // F# alias
      expect(getPredefinedColor('C++')).toBe('#f34b7d'); // C++
      expect(getPredefinedColor('1C Enterprise')).toBe('#814ccc'); // Language with number and space
    });
  });
});

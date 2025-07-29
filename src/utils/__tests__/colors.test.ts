import { describe, it, expect } from 'vitest';
import { getHashedTagColor, TAG_COLORS, getLanguageColor } from '../colors';

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

  describe('getLanguageColor', () => {
    it('should return color for exact language match', () => {
      expect(getLanguageColor('JavaScript')).toBe('#f1e05a');
      expect(getLanguageColor('Python')).toBe('#3572A5');
      expect(getLanguageColor('TypeScript')).toBe('#3178c6');
      expect(getLanguageColor('Java')).toBe('#b07219');
      expect(getLanguageColor('Go')).toBe('#00ADD8');
    });

    it('should return color for case-insensitive match', () => {
      expect(getLanguageColor('javascript')).toBe('#f1e05a');
      expect(getLanguageColor('PYTHON')).toBe('#3572A5');
      expect(getLanguageColor('typescript')).toBe('#3178c6');
      expect(getLanguageColor('JAVA')).toBe('#b07219');
    });

    it('should return color for common aliases', () => {
      expect(getLanguageColor('js')).toBe('#f1e05a'); // JavaScript
      expect(getLanguageColor('ts')).toBe('#3178c6'); // TypeScript
      expect(getLanguageColor('py')).toBe('#3572A5'); // Python
      expect(getLanguageColor('cpp')).toBe('#f34b7d'); // C++
      expect(getLanguageColor('c++')).toBe('#f34b7d'); // C++
      expect(getLanguageColor('cs')).toBe('#178600'); // C#
      expect(getLanguageColor('c#')).toBe('#178600'); // C#
      expect(getLanguageColor('csharp')).toBe('#178600'); // C#
      expect(getLanguageColor('golang')).toBe('#00ADD8'); // Go
      expect(getLanguageColor('rs')).toBe('#dea584'); // Rust
      expect(getLanguageColor('rb')).toBe('#701516'); // Ruby
    });

    it('should return color for shell and scripting aliases', () => {
      expect(getLanguageColor('bash')).toBe('#89e051'); // Shell
      expect(getLanguageColor('sh')).toBe('#89e051'); // Shell
      expect(getLanguageColor('shell')).toBe('#89e051'); // Shell
      expect(getLanguageColor('powershell')).toBe('#012456'); // PowerShell
      expect(getLanguageColor('ps1')).toBe('#012456'); // PowerShell
    });

    it('should return color for web technologies', () => {
      expect(getLanguageColor('html')).toBe('#e34c26'); // HTML
      expect(getLanguageColor('css')).toBe('#663399'); // CSS
      expect(getLanguageColor('scss')).toBe('#c6538c'); // SCSS
      expect(getLanguageColor('sass')).toBe('#a53b70'); // Sass
      expect(getLanguageColor('vue')).toBe('#41b883'); // Vue
    });

    it('should return color for functional languages', () => {
      expect(getLanguageColor('haskell')).toBe('#5e5086'); // Haskell
      expect(getLanguageColor('hs')).toBe('#5e5086'); // Haskell
      expect(getLanguageColor('clojure')).toBe('#db5855'); // Clojure
      expect(getLanguageColor('clj')).toBe('#db5855'); // Clojure
      expect(getLanguageColor('elixir')).toBe('#6e4a7e'); // Elixir
      expect(getLanguageColor('ex')).toBe('#6e4a7e'); // Elixir
      expect(getLanguageColor('elm')).toBe('#60B5CC'); // Elm
    });

    it('should return color for systems languages', () => {
      expect(getLanguageColor('c')).toBe('#555555'); // C
      expect(getLanguageColor('rust')).toBe('#dea584'); // Rust
      expect(getLanguageColor('zig')).toBe('#ec915c'); // Zig
      expect(getLanguageColor('nim')).toBe('#ffc200'); // Nim
      expect(getLanguageColor('assembly')).toBe('#6E4C13'); // Assembly
      expect(getLanguageColor('asm')).toBe('#6E4C13'); // Assembly
    });

    it('should return undefined for languages that do not exist', () => {
      expect(getLanguageColor('NonExistentLanguage')).toBeUndefined();
      expect(getLanguageColor('FakeScript')).toBeUndefined();
      expect(getLanguageColor('MadeUpLang')).toBeUndefined();
    });

    it('should return undefined for empty or null input', () => {
      expect(getLanguageColor('')).toBeUndefined();
      expect(getLanguageColor(' ')).toBeUndefined();
    });

    it('should handle languages with null colors gracefully', () => {
      // Some languages in the GitHub colors file have null colors
      // Our function should return undefined for these
      const result = getLanguageColor('ASL'); // ASL has null color in the data
      expect(result).toBeUndefined();
    });

    it('should handle special characters and numbers in language names', () => {
      expect(getLanguageColor('F#')).toBe('#b845fc'); // F#
      expect(getLanguageColor('f#')).toBe('#b845fc'); // F# case insensitive
      expect(getLanguageColor('fsharp')).toBe('#b845fc'); // F# alias
      expect(getLanguageColor('C++')).toBe('#f34b7d'); // C++
      expect(getLanguageColor('1C Enterprise')).toBe('#814CCC'); // Language with number and space
    });

    it('should handle framework aliases that map to base languages', () => {
      expect(getLanguageColor('react')).toBe('#f1e05a'); // Maps to JavaScript
      expect(getLanguageColor('angular')).toBe('#3178c6'); // Maps to TypeScript
    });
  });
});

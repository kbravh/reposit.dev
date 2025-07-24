import { describe, it, expect } from 'vitest';
import { getLanguageColor, parseRepositoryUrl } from '../github';

describe('GitHub Language Colors', () => {
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

describe('parseRepositoryUrl', () => {
  describe('HTTPS URLs', () => {
    it('should parse basic HTTPS GitHub URLs', () => {
      expect(parseRepositoryUrl('https://github.com/prisma/prisma')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });

      expect(parseRepositoryUrl('https://github.com/facebook/react')).toEqual({
        org: 'facebook',
        repo: 'react',
      });
    });

    it('should parse HTTPS URLs with .git suffix', () => {
      expect(
        parseRepositoryUrl('https://github.com/prisma/prisma.git')
      ).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });
    });

    it('should parse HTTP URLs (non-secure)', () => {
      expect(parseRepositoryUrl('http://github.com/prisma/prisma')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });
    });

    it('should parse URLs with trailing paths', () => {
      expect(
        parseRepositoryUrl('https://github.com/prisma/prisma/tree/main')
      ).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });

      expect(
        parseRepositoryUrl(
          'https://github.com/prisma/prisma/blob/main/README.md'
        )
      ).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });
    });

    it('should handle case variations', () => {
      expect(parseRepositoryUrl('https://GitHub.com/Prisma/Prisma')).toEqual({
        org: 'Prisma',
        repo: 'Prisma',
      });
    });
  });

  describe('SSH URLs', () => {
    it('should parse SSH GitHub URLs', () => {
      expect(parseRepositoryUrl('git@github.com:prisma/prisma.git')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });

      expect(parseRepositoryUrl('git@github.com:facebook/react.git')).toEqual({
        org: 'facebook',
        repo: 'react',
      });
    });

    it('should parse SSH URLs without .git suffix', () => {
      expect(parseRepositoryUrl('git@github.com:prisma/prisma')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });
    });
  });

  describe('Short format URLs', () => {
    it('should parse org/repo format', () => {
      expect(parseRepositoryUrl('prisma/prisma')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });

      expect(parseRepositoryUrl('facebook/react')).toEqual({
        org: 'facebook',
        repo: 'react',
      });
    });

    it('should handle repos with special characters', () => {
      expect(parseRepositoryUrl('my-org/my-repo')).toEqual({
        org: 'my-org',
        repo: 'my-repo',
      });

      expect(parseRepositoryUrl('org_name/repo.name')).toEqual({
        org: 'org_name',
        repo: 'repo.name',
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle URLs with whitespace', () => {
      expect(
        parseRepositoryUrl('  https://github.com/prisma/prisma  ')
      ).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });

      expect(parseRepositoryUrl('  prisma/prisma  ')).toEqual({
        org: 'prisma',
        repo: 'prisma',
      });
    });

    it('should throw error for invalid URLs', () => {
      expect(() => parseRepositoryUrl('invalid-url')).toThrow(
        'Invalid GitHub repository URL format'
      );
      expect(() =>
        parseRepositoryUrl('https://gitlab.com/prisma/prisma')
      ).toThrow('Invalid GitHub repository URL format');
      expect(() => parseRepositoryUrl('just-a-repo-name')).toThrow(
        'Invalid GitHub repository URL format'
      );
      expect(() => parseRepositoryUrl('org/')).toThrow(
        'Invalid GitHub repository URL format'
      );
      expect(() => parseRepositoryUrl('/repo')).toThrow(
        'Invalid GitHub repository URL format'
      );
    });

    it('should throw error for empty or invalid input', () => {
      expect(() => parseRepositoryUrl('')).toThrow('Invalid URL provided');
      expect(() => parseRepositoryUrl('   ')).toThrow(
        'Invalid GitHub repository URL format'
      );
      // @ts-expect-error Testing invalid input types
      expect(() => parseRepositoryUrl(null)).toThrow('Invalid URL provided');
      // @ts-expect-error Testing invalid input types
      expect(() => parseRepositoryUrl(undefined)).toThrow(
        'Invalid URL provided'
      );
      // @ts-expect-error Testing invalid input types
      expect(() => parseRepositoryUrl(123)).toThrow('Invalid URL provided');
    });

    it('should handle repos with numbers and special characters', () => {
      expect(parseRepositoryUrl('angular/angular2')).toEqual({
        org: 'angular',
        repo: 'angular2',
      });
    });
  });
});

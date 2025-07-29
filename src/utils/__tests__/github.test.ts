import { describe, it, expect } from 'vitest';
import { parseRepositoryUrl } from '../github';

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

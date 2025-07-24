import githubColors from '../data/colors.json';
import { z } from 'zod';

type GitHubLanguageColors = Record<
  string,
  { color: string | null; url: string }
>;

/**
 * Get GitHub language color by language name
 * @param languageName - The name of the programming language
 * @returns The hex color string (with #) or undefined if not found
 */
export function getLanguageColor(languageName: string): string | undefined {
  if (!languageName) return undefined;

  const colors = githubColors as unknown as GitHubLanguageColors;

  // First try exact match
  if (colors[languageName]) {
    return colors[languageName].color || undefined;
  }

  // Try case-insensitive match
  const languageKey = Object.keys(colors).find(
    key => key.toLowerCase() === languageName.toLowerCase()
  );

  if (languageKey) {
    return colors[languageKey].color || undefined;
  }

  // Try common variations and aliases
  const normalizedName = languageName.toLowerCase();
  const aliases: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    py: 'Python',
    python: 'Python',
    java: 'Java',
    'c++': 'C++',
    cpp: 'C++',
    csharp: 'C#',
    'c#': 'C#',
    cs: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    rb: 'Ruby',
    go: 'Go',
    golang: 'Go',
    rust: 'Rust',
    rs: 'Rust',
    swift: 'Swift',
    kotlin: 'Kotlin',
    kt: 'Kotlin',
    scala: 'Scala',
    dart: 'Dart',
    lua: 'Lua',
    perl: 'Perl',
    pl: 'Perl',
    r: 'R',
    matlab: 'MATLAB',
    shell: 'Shell',
    bash: 'Shell',
    sh: 'Shell',
    powershell: 'PowerShell',
    ps1: 'PowerShell',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    less: 'Less',
    xml: 'XML',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    toml: 'TOML',
    dockerfile: 'Dockerfile',
    makefile: 'Makefile',
    cmake: 'CMake',
    vim: 'Vim Script',
    vimscript: 'Vim Script',
    viml: 'Vim Script',
    emacs: 'Emacs Lisp',
    elisp: 'Emacs Lisp',
    vue: 'Vue',
    react: 'JavaScript', // React is JavaScript
    angular: 'TypeScript', // Angular is typically TypeScript
    svelte: 'Svelte',
    elixir: 'Elixir',
    ex: 'Elixir',
    erlang: 'Erlang',
    erl: 'Erlang',
    haskell: 'Haskell',
    hs: 'Haskell',
    clojure: 'Clojure',
    clj: 'Clojure',
    cljs: 'ClojureScript',
    fsharp: 'F#',
    'f#': 'F#',
    fs: 'F#',
    ocaml: 'OCaml',
    ml: 'OCaml',
    elm: 'Elm',
    crystal: 'Crystal',
    cr: 'Crystal',
    julia: 'Julia',
    jl: 'Julia',
    nim: 'Nim',
    zig: 'Zig',
    assembly: 'Assembly',
    asm: 'Assembly',
    c: 'C',
    'objective-c': 'Objective-C',
    objc: 'Objective-C',
    'objective-c++': 'Objective-C++',
    objcpp: 'Objective-C++',
    pascal: 'Pascal',
    pas: 'Pascal',
    fortran: 'Fortran',
    f90: 'Fortran',
    cobol: 'COBOL',
    ada: 'Ada',
  };

  if (aliases[normalizedName]) {
    const aliasedLanguage = aliases[normalizedName];
    return colors[aliasedLanguage]?.color || undefined;
  }

  return undefined;
}

export const parseRepositoryUrl = (
  url: string
): { org: string; repo: string } => {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided');
  }

  const trimmedUrl = url.trim();

  // Regex to match all three patterns:
  // 1. https://github.com/org/repo
  // 2. git@github.com:org/repo.git
  // 3. org/repo
  const match = trimmedUrl.match(
    /^(?:https?:\/\/github\.com\/|git@github\.com:|)([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/i
  );

  if (match) {
    return {
      org: match[1],
      repo: match[2],
    };
  }

  throw new Error(
    'Invalid GitHub repository URL format. Supported formats: https://github.com/org/repo, git@github.com:org/repo.git, or org/repo'
  );
};

const GitHubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  private: z.boolean(),
  htmlUrl: z.string(),
  description: z.string().optional(),
  language: z.string().optional(),
  owner: z.object({
    login: z.string(),
  }),
});

export type GitHubRepository = z.infer<typeof GitHubRepositorySchema>;

// TODO: Allow a user to see their private repos
export const getRepositoryDetails = async (
  url: string
): Promise<GitHubRepository> => {
  const { org, repo } = parseRepositoryUrl(url);
  const response = await fetch(`https://api.github.com/repos/${org}/${repo}`);
  const data = await response.json();
  const parsedData = GitHubRepositorySchema.parse(data);
  return parsedData;
};

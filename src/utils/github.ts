import { z } from 'zod';

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
  html_url: z.string(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
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

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Repository "${org}/${repo}" not found. Please check the repository name and make sure it exists and is public.`
      );
    }
    if (response.status === 403) {
      throw new Error(
        `Access to repository "${org}/${repo}" is forbidden. This may be a private repository.`
      );
    }
    throw new Error(
      `Failed to fetch repository "${org}/${repo}": ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = GitHubRepositorySchema.parse(data);
  return parsedData;
};

export const getRepositoryDetailsFromProviderId = async (
  providerId: string,
  _provider: string
): Promise<GitHubRepository> => {
  const response = await fetch(`https://api.github.com/repos/${providerId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository with ID "${providerId}" not found.`);
    }
    if (response.status === 403) {
      throw new Error(
        `Access to repository with ID "${providerId}" is forbidden.`
      );
    }
    throw new Error(
      `Failed to fetch repository with ID "${providerId}": ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const parsedData = GitHubRepositorySchema.parse(data);
  return parsedData;
};

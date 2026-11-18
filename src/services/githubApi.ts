import type { GitHubUser, ProfileData, Repository } from '../types/github';

const BASE_URL = 'https://api.github.com';
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };

export function normalizeUsername(input: string): string {
  const username = input.trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
    throw new Error('Enter a valid GitHub username (letters, numbers, and hyphens).');
  }
  return username;
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try { response = await fetch(`${BASE_URL}${path}`, { headers, signal }); }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('Could not reach GitHub. Check your connection and try again.');
  }
  if (!response.ok) {
    let message = `GitHub request failed (${response.status}).`;
    if (response.status === 404) message = 'That GitHub user could not be found.';
    if (response.status === 403 || response.status === 429) {
      const resetAt = Number(response.headers.get('X-RateLimit-Reset')) * 1000;
      const wait = resetAt > Date.now() ? ` Try again in ${Math.ceil((resetAt - Date.now()) / 60000)} min.` : ' Please try again later.';
      message = `GitHub API rate limit reached.${wait}`;
    }
    if (response.status >= 500) message = 'GitHub is having trouble right now. Try again in a moment.';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function fetchUser(username: string, signal?: AbortSignal): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${encodeURIComponent(normalizeUsername(username))}`, signal);
}

export async function fetchUserRepos(username: string, signal?: AbortSignal): Promise<Repository[]> {
  const safeUsername = normalizeUsername(username);
  return request<Repository[]>(`/users/${encodeURIComponent(safeUsername)}/repos?per_page=100&sort=updated&type=owner`, signal);
}

export async function fetchProfile(username: string, signal?: AbortSignal): Promise<ProfileData> {
  const [user, repos] = await Promise.all([fetchUser(username, signal), fetchUserRepos(username, signal)]);
  return { user, repos: repos.filter((repo) => !repo.fork) };
}

export async function fetchTrendingRepos(signal?: AbortSignal): Promise<Repository[]> {
  const data = await request<{ items: Repository[] }>('/search/repositories?q=stars:%3E1000&sort=stars&order=desc&per_page=6', signal);
  return data.items;
}

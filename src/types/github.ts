export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: { login: string; avatar_url: string };
  updated_at: string;
  created_at: string;
  fork: boolean;
  topics: string[];
}

export interface ProfileData {
  user: GitHubUser;
  repos: Repository[];
}

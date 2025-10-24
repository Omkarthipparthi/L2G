export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description?: string;
  owner: {
    login: string;
  };
}

export interface GitHubCommit {
  sha: string;
  message: string;
  url: string;
}

export interface GitHubAuth {
  accessToken: string;
  tokenType: string;
  scope: string;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}


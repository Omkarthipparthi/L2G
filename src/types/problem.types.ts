export interface Problem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  description: string;
  descriptionHtml?: string;
}

export interface Submission {
  id: string;
  problemId: number;
  problem: Problem;
  code: string;
  language: string;
  timestamp: number;
  runtime: string;
  memory: string;
  status: 'Accepted' | 'Failed';
}


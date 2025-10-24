import { Problem } from '../types/problem.types';

/**
 * Format problem title for use in folder/file names
 * Example: "Two Sum" -> "two-sum"
 */
export const formatProblemTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

/**
 * Get file extension based on programming language
 */
export const getFileExtension = (language: string): string => {
  const extensions: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    python3: 'py',
    java: 'java',
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    csharp: 'cs',
    'c#': 'cs',
    ruby: 'rb',
    go: 'go',
    golang: 'go',
    rust: 'rs',
    kotlin: 'kt',
    swift: 'swift',
    php: 'php',
    scala: 'scala',
    perl: 'pl',
    elixir: 'ex',
    dart: 'dart',
    racket: 'rkt',
    erlang: 'erl',
    mysql: 'sql',
    mssql: 'sql',
    oraclesql: 'sql',
  };

  const normalizedLang = language.toLowerCase().trim();
  return extensions[normalizedLang] || 'txt';
};

/**
 * Format commit message using template
 * Supported variables: {{problemId}}, {{title}}, {{difficulty}}, {{language}}
 */
export const formatCommitMessage = (
  problem: Problem,
  language: string,
  template?: string
): string => {
  const defaultTemplate = 'Add {{problemId}}. {{title}} ({{difficulty}})';
  const msg = template || defaultTemplate;

  return msg
    .replace(/\{\{problemId\}\}/g, problem.id.toString())
    .replace(/\{\{title\}\}/g, problem.title)
    .replace(/\{\{difficulty\}\}/g, problem.difficulty)
    .replace(/\{\{language\}\}/g, language);
};

/**
 * Format date for display
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format problem ID with leading zeros
 * Example: 1 -> "0001"
 */
export const formatProblemId = (id: number): string => {
  return String(id).padStart(4, '0');
};

/**
 * Get difficulty color for UI
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'hard':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};


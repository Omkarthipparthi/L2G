/**
 * Validate GitHub token format
 * GitHub tokens start with 'ghp_' (personal access token) or 'gho_' (OAuth token)
 */
export const isValidGitHubToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  // GitHub tokens are typically 40+ characters
  return token.length >= 20 && /^[a-zA-Z0-9_]+$/.test(token);
};

/**
 * Validate repository name format
 * GitHub repo names can contain alphanumeric, hyphens, underscores, and dots
 */
export const isValidRepoName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  // Must be 1-100 characters, alphanumeric, hyphens, underscores, dots
  return /^[a-zA-Z0-9._-]{1,100}$/.test(name);
};

/**
 * Validate full repository name (owner/repo format)
 */
export const isValidFullRepoName = (fullName: string): boolean => {
  if (!fullName || typeof fullName !== 'string') {
    return false;
  }
  const parts = fullName.split('/');
  return parts.length === 2 && parts.every((part) => part.length > 0);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate commit message template
 * Ensures template contains at least one variable
 */
export const isValidCommitTemplate = (template: string): boolean => {
  if (!template || typeof template !== 'string') {
    return false;
  }
  // Must contain at least one valid variable
  const validVariables = ['{{problemId}}', '{{title}}', '{{difficulty}}', '{{language}}'];
  return validVariables.some((variable) => template.includes(variable));
};

/**
 * Validate problem ID
 */
export const isValidProblemId = (id: number): boolean => {
  return Number.isInteger(id) && id > 0 && id < 10000;
};

/**
 * Sanitize string for use in file names
 */
export const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 255); // Limit length
};


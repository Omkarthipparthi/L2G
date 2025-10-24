export type MessageType =
  | 'SUBMISSION_DETECTED'
  | 'SYNC_TO_GITHUB'
  | 'AUTH_GITHUB'
  | 'GET_REPOS'
  | 'CREATE_REPO'
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'GET_SUBMISSIONS'
  | 'GET_SYNC_HISTORY'
  | 'MANUAL_SYNC'
  | 'TEST_CONNECTION';

export interface Message<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}


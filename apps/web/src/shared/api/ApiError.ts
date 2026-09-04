export class ApiError extends Error {
  readonly path: string;
  readonly code: number;
  readonly serverMessage: string;

  constructor(path: string, code: number, serverMessage: string) {
    super(`API error for ${path}: ${code} (${serverMessage})`);
    this.name = 'ApiError';
    this.path = path;
    this.code = code;
    this.serverMessage = serverMessage;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

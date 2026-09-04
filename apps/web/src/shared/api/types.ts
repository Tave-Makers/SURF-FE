export type CommonResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export interface PageMeta {
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  isLast: boolean;
}

export type ServerFetchOptions = Omit<globalThis.RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export type Guard<T> = (x: unknown) => x is T;

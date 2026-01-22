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
  authRedirect?: boolean;
};

export type Guard<T> = (x: unknown) => x is T;

export function commonResponseGuard<T>(dataGuard: Guard<T>): Guard<CommonResponse<T>> {
  return (x: unknown): x is CommonResponse<T> => {
    if (typeof x !== 'object' || x === null) return false;
    const obj = x as Record<string, unknown>;

    if (typeof obj.code !== 'number') return false;
    if (typeof obj.message !== 'string') return false;

    return dataGuard(obj.data);
  };
}

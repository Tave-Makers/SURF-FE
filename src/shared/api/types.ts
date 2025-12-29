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

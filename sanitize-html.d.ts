declare module 'sanitize-html' {
  export interface IOptions {
    allowedTags: string[];
  }

  // sanitize-html 구조에 맞춘 함수 타입
  function sanitizeHtml(raw: string, options?: IOptions): string;

  export = sanitizeHtml;
}

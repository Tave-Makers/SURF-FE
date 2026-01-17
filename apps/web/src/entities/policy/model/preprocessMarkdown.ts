/**
 * 정책 텍스트를 Markdown 형식으로 전처리합니다.
 *
 * @param src - 원본 정책 텍스트
 * @returns Markdown 형식으로 변환된 텍스트
 */

export function preprocessToMarkdown(src: string): string {
  let out = src;
  out = out.replace(/^제\s*(\d+)\s*조\s+(.+?)\s*$/gm, '### 제$1조 $2');

  return out;
}

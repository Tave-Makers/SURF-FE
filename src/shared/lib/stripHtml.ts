export const stripHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // 스크립트 태그 및 내용 제거
    .replace(/<style[^>]*>.*?<\/style>/gi, '') // 스타일 태그 제거
    .replace(/<[^>]+>/g, '') // HTML 태그 제거
    .trim();
};

export const stripHtml = (html: string) => {
  if (!html) return '';

  return (
    html
      // 문단 경계: </p><p> -> 공백 한 칸
      .replace(/<\/p>\s*<p>/gi, ' ')
      // 남은 p 태그 제거
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '')

      // script / style 제거
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

      // 기타 모든 HTML 태그 제거
      .replace(/<[^>]+>/g, '')

      // HTML 엔티티 처리
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/g, "'")

      // 공백 정리
      .replace(/\s+/g, ' ')
      .trim()
  );
};

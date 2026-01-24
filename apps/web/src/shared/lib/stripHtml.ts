import sanitizeHtml from 'sanitize-html';

export const stripHtml = (html: string) => {
  if (!html) return '';

  const normalized = html.replace(/<\/p>\s*<p>/gi, ' ');

  const text = sanitizeHtml(normalized, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return text.replace(/\s+/g, ' ').trim();
};

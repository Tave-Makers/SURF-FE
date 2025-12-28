export function kakaoImgNormalize(src?: string | null) {
  if (!src) return src;
  if (src.startsWith('http://')) {
    return src.replace('http://', 'https://');
  }
  return src;
}

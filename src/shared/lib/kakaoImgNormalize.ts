export function kakaoImgNormalize(src?: string) {
  if (!src) return src;
  if (src.startsWith('http://')) {
    return src.replace('http://', 'https://');
  }
  return src;
}

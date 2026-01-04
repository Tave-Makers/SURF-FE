export function kakaoImgNormalize(src: string | null | undefined): string | undefined {
  if (!src) return undefined;

  if (src.startsWith('http://')) {
    return src.replace('http://', 'https://');
  }

  return src;
}

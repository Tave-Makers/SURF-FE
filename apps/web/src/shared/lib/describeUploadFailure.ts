/** 토스트 뷰포트가 375px 로 묶여 있어, 긴 이름은 확장자만 남기고 줄인다 */
const MAX_TOAST_FILE_NAME = 20;

const MAX_EXTENSION_LENGTH = 10;

export const shortenFileName = (name: string) => {
  if (name.length <= MAX_TOAST_FILE_NAME) return name;

  const lastDot = name.lastIndexOf('.');
  // 확장자로 보기 어려울 만큼 길면 그냥 이름의 일부로 취급한다
  const hasExtension = lastDot > 0 && name.length - lastDot <= MAX_EXTENSION_LENGTH;
  const ext = hasExtension ? name.slice(lastDot) : '';
  const base = hasExtension ? name.slice(0, lastDot) : name;

  return `${base.slice(0, MAX_TOAST_FILE_NAME - ext.length - 1)}…${ext}`;
};

/**
 * 실패한 첨부가 여러 개면 첫 이름만 보여주고 나머지는 개수로 접는다.
 * 이름을 알 수 없으면 fallback ('파일' / '이미지') 으로 대체한다.
 */
export const describeFailedNames = (names: string[], fallback: string) => {
  const [first, ...rest] = names;
  if (!first) return fallback;

  const name = shortenFileName(first);
  return rest.length > 0 ? `${name} 외 ${rest.length}개` : name;
};

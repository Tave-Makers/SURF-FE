/**
 * 정책 텍스트를 Markdown 형식으로 전처리합니다.
 * 정책 ID에 따라 다른 변환 규칙을 적용합니다.
 *
 * @param src - 원본 정책 텍스트
 * @param policyId - 정책 식별자 (PersonalInfoPolicy | ServicePolicy | MarketingPolicy)
 * @returns Markdown 형식으로 변환된 텍스트
 */

export function preprocessToMarkdown(src: string, policyId?: string): string {
  let out = src;

  // PersonalInfoPolicy: 1항만 my-0, 2~9항은 mb-0
  if (policyId === 'PersonalInfoPolicy') {
    // 1. 수집하는 개인정보 항목 → ## 1. 수집하는 개인정보 항목 [my-0]
    out = out.replace(
      /^\s*>?\s*1\.\s*수집하는\s+개인정보\s+항목\s*$/gm,
      '## 1. 수집하는 개인정보 항목 [my-0]',
    );

    // 2~9항 → ## N. ... [mb-0]
    out = out.replace(/^\s*>?\s*([2-9])\.\s+(.+?)\s*$/gm, '## $1. $2 [mb-0]');
  }

  // ServicePolicy: 장/조 구조 변환
  if (policyId === 'ServicePolicy') {
    out = out
      .replace(/^제1장\s+총칙\s*$/gm, '## 제1장 총칙 [no-mt]')
      .replace(/^제\s*(\d+)장\s+(.+?)\s*$/gm, '## 제$1장 $2')
      .replace(/^제\s*(\d+)조\s*\((.+?)\)\s*$/gm, '### 제$1조 ($2)');
  }

  // MarketingPolicy: 번호 및 원형 번호 변환
  if (policyId === 'MarketingPolicy') {
    /* 기본 숫자 번호 조항 top, bottom margin 조정 */
    // 1. 수신 채널 및 범위 → ## 1. 수신 채널 및 범위 [my-0]
    out = out.replace(
      /^\s*>?\s*1\.\s*수신\s+채널\s+및\s+범위\s*$/gm,
      '## 1. 수신 채널 및 범위 [my-0]',
    );

    // 2~8항 → ## N. ... [mb-0]
    out = out.replace(/^\s*>?\s*([2-8])\.\s+(.+?)\s*$/gm, '## $1. $2 [mb-0]');

    /* 원형 번호 조항 top, bottom margin 조정 */
    // ① 채널별 수신 동의 → ## ① 채널별 수신 동의 [my-0]
    out = out.replace(/^\s*>?\s*①\.?\s*채널별\s+수신\s+동의\s*$/gm, '## ① 채널별 수신 동의 [my-0]');

    // ②, ③ → ## ② ... [mb-0], ## ③ ... [mb-0]
    out = out.replace(/^\s*>?\s*②\.?\s*(.+?)\s*$/gm, '## ② $1 [mb-0]');
    out = out.replace(/^\s*>?\s*③\.?\s*(.+?)\s*$/gm, '## ③ $1 [mb-0]');
  }

  return out;
}

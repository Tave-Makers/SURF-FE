'use client';

import { POLICY_ITEMS } from '../model/constants';
import { Markdown } from '@/entities/policy/ui/Markdown';

function preprocessToMarkdown(src: string, policyId?: string) {
  let out = src;

  if (policyId === 'PersonalInfoPolicy') {
    // 1항만 h2 + my-0
    out = out.replace(
      /^\s*>?\s*1\.\s*수집하는\s+개인정보\s+항목\s*$/gm,
      '## 1. 수집하는 개인정보 항목 [my-0]',
    );

    // 2~9항은 h2 + mb-0
    out = out.replace(/^\s*>?\s*([2-9])\.\s+(.+)\s*$/gm, '## $1. $2 [mb-0]');
  }

  if (policyId === 'ServicePolicy') {
    out = out
      .replace(/^제1장\s+총칙\s*$/gm, '## 제1장 총칙 [no-mt]')
      .replace(/^제\s*(\d+)장\s+(.+)\s*$/gm, '## 제$1장 $2')
      .replace(/^제\s*(\d+)조\s*\((.+)\)\s*$/gm, '### 제$1조 ($2)');
  }

  if (policyId === 'MarketingPolicy') {
    // 1항만 h2 + my-0
    out = out.replace(
      /^\s*>?\s*1\.\s*수신\s+채널\s+및\s+범위\s*$/gm,
      '## 1. 수신 채널 및 범위 [my-0]',
    );
    // 2~8항은 h2 + mb-0
    out = out.replace(/^\s*>?\s*([2-8])\.\s+(.+)\s*$/gm, '## $1. $2 [mb-0]');

    // ① 로 시작하는 것만 h2 + my-0
    out = out.replace(/^\s*>?\s*①\.\s*채널별\s+수신\s+동의\s*$/gm, '## ① 채널별 수신 동의 [my-0]');
    // ②, ③은 h2 + mb-0
    out = out.replace(/^\s*>?\s*②\.?\s*(.+)\s*$/gm, '## ② $1 [mb-0]');
    out = out.replace(/^\s*>?\s*③\.?\s*(.+)\s*$/gm, '## ③ $1 [mb-0]');
  }

  return out;
}

type PolicyDetailItemProps = {
  policyId?: string;
};

export const PolicyDetailItem = ({ policyId }: PolicyDetailItemProps) => {
  const policyItem = policyId ? POLICY_ITEMS.find((item) => item.id === policyId) : POLICY_ITEMS[0];
  if (!policyItem) return <div>약관을 찾을 수 없습니다.</div>;

  const md = preprocessToMarkdown(policyItem.text, policyId ?? policyItem.id);

  return (
    <div className="flex flex-col overflow-y-auto px-[1rem] py-[0.62rem]">
      <div className="text-body-12-400--2 text-[#000]">
        <Markdown>{md}</Markdown>
      </div>
    </div>
  );
};

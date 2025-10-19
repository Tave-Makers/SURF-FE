'use client';

import { POLICY_ITEMS } from '../model/constants';
import { Markdown } from '@/entities/policy/ui/Markdown';
import { preprocessToMarkdown } from '../model/preprocessMarkdown';

type PolicyDetailItemProps = {
  policyId?: string;
};

export const PolicyDetailItem = ({ policyId }: PolicyDetailItemProps) => {
  const policyItem = policyId ? POLICY_ITEMS.find((item) => item.id === policyId) : POLICY_ITEMS[0];
  if (!policyItem) return <div>약관을 찾을 수 없습니다.</div>;

  const md = preprocessToMarkdown(policyItem.text, policyId ?? policyItem.id);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-[1rem] py-[0.62rem] pb-[3.5rem]">
      <div className="text-body-12-400--2 text-[#000]">
        <Markdown>{md}</Markdown>
      </div>
    </div>
  );
};

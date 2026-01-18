'use client';

import { POLICY_ITEMS } from '../model/constants';
import { preprocessToMarkdown } from '../model/preprocessMarkdown';
import { Markdown } from '@/entities/policy/ui/Markdown';

type PolicyDetailItemProps = {
  policyId?: string;
};

export const PolicyDetailItem = ({ policyId }: PolicyDetailItemProps) => {
  const policyItem = policyId ? POLICY_ITEMS.find((item) => item.id === policyId) : POLICY_ITEMS[0];
  if (!policyItem) return <div>약관을 찾을 수 없습니다.</div>;

  const md = preprocessToMarkdown(policyItem.text);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-13 pt-11 pb-[3.5rem]">
      <div className="text-body-body7 text-foreground-normal">
        <Markdown>{md}</Markdown>
      </div>
    </div>
  );
};

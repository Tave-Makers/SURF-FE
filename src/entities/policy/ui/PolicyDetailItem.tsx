import { POLICY_ITEMS } from '../model/constants';

interface PolicyDetailItemProps {
  policyId?: string;
}

export const PolicyDetailItem = ({ policyId }: PolicyDetailItemProps) => {
  const policyItem = policyId ? POLICY_ITEMS.find((item) => item.id === policyId) : POLICY_ITEMS[0]; // 기본값으로 첫 번째 약관

  if (!policyItem) {
    return <div>약관을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-[0.62rem] overflow-y-auto px-[1rem] py-[0.62rem] text-[#000]">
      <div className="text-body-12-400--2 whitespace-pre-line">{policyItem.text}</div>
    </div>
  );
};

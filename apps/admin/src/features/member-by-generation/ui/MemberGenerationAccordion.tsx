import { Accordion } from '@surf/ui/accordion';
import { MemberBase } from '@/entities/member/model/types';

export const MemberGenerationAccordion = ({
  generation,
  renderItem,
}: {
  generation: number;
  renderItem: (member: MemberBase) => React.ReactNode;
}) => {
  const m: MemberBase = {
    id: 1,
    name: '테이비',
    role: 'MEMBER',
    status: 'approve',
    tracks: [
      {
        generation: 12,
        part: 'APP_FRONTEND',
      },
    ],
    university: '서울과기대',
    profileImageUrl: '',
    registeredAt: '',
  };

  //TODO: 배열 기반 렌더링으로 변경
  return (
    <Accordion title={`${generation}기`}>
      <div>
        <div key={m.id}>{renderItem(m)}</div>
      </div>
    </Accordion>
  );
};

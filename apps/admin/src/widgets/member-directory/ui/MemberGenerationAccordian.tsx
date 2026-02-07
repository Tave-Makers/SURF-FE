import { Accordion } from '@surf/ui/accordion';

export const MemberGenerationAccordian = ({ generation }: { generation: number }) => {
  return (
    <Accordion title={`${generation}기`}>
      <div>기수 별 멤버 목록</div>
    </Accordion>
  );
};

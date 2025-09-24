'use client';

import { AccordionGroup } from '@/shared/ui/accordion/AccordionGroup';
import { AccordionTextList } from '@/features/bylaws/ui/AccordionTextList';
import GroupActivityTable from '@/features/bylaws/ui/group-activity-table.svg';

export default function BylawsPage() {
  return (
    <div className="flex w-[375px] flex-col">
      <span className="p-[1rem]">
        1-4번은 회칙 전용 UI 컴포넌트입니다. 마지막은 공통 컴포넌트입니다.
      </span>
      <AccordionGroup
        accordions={[
          {
            title: '활동 점수 득점',
            children: (
              <AccordionTextList
                items={[
                  {
                    title: '얼리버드',
                    scoreChange: '+5',
                    descriptions: ['정규 세션 시작 20~10분 전 출석', '사적 후 5분까지 참작 가능'],
                  },
                  {
                    title: '뒤풀이',
                    scoreChange: '+5',
                  },
                  {
                    title: '번개',
                    scoreChange: '+5 / + 10',
                    descriptions: ['YB가 개설할 경우, 운영진 1인에게 사진 제출'],
                  },
                ]}
              />
            ),
          },
          {
            title: '조별 활동 관련',
            children: (
              <div className="flex items-center justify-center">
                <GroupActivityTable />
              </div>
            ),
          },
          {
            title: 'OB 전환',
            children: (
              <AccordionTextList
                items={[
                  {
                    title: 'OB 전환 기준',
                    descriptions: [
                      '활동 점수에 문제가 없는 경우 OB 전환 가능',
                      '컨퍼런스 출결 처리 이후의 최종 활동점수가 1점 이상일 경우',
                    ],
                  },
                ]}
              />
            ),
          },
          {
            title: 'Disabled 아코디언',
            isDisabled: true,
            children: (
              <AccordionTextList
                items={[
                  {
                    title: '비밀 규칙',
                    scoreChange: '-5 to -10',
                    descriptions: [
                      '10분당 감점처리 되며 최대 30분까지 지각처리',
                      '사적 후 5분까지 참작 가능',
                    ],
                  },
                ]}
              />
            ),
          },
          {
            title: '아코디언 공통 컴포넌트',
            renderTitle: (_, title) => <span>{title}</span>,
            children: <p>Custom 아코디언</p>,
          },
        ]}
      />
    </div>
  );
}

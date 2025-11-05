import { AccordionGroupProps } from '@/shared/ui/accordion/types';
import { AccordionTextList } from '@/features/bylaws/ui/AccordionTextList';
import GroupActivityTable from '@/features/bylaws/ui/group-activity-table.svg';

export const bylawsData: AccordionGroupProps['accordions'] = [
  {
    title: '출결 안내',
    children: (
      <>
        <AccordionTextList
          items={[
            {
              title: '기본점수',
              descriptions: [
                '첫 OT를 기점으로 YB회원은 기본 활동점수 100점을 부여받고 시작하는 것을 원칙으로 한다.',
                '최종 활동 점수가 0점인 경우 수료증 발급 불가하다.',
              ],
            },
            {
              title: '출결 안내',
              descriptions: [
                '회원들은 출석한 시점에 담당 운영진에게 출석 방법에 따라 출석 체크를 하도록 한다.',
                '담당 운영진에게 출석 체크를 안할 시 결석 처리가 된다.',
              ],
            },
            {
              title: '인정 기준',
              descriptions: [
                '기준 시간의 5분 이상 늦을 경우 지각으로 처리한다.',
                '병결의 경우 진료 진단서 제출시에만 인정하는 것으로 한다. (단 기수 당 1회 제한)',
                '기사 자격증, 코딩테스트 등 외부 시험의 경우 증빙서류 제출 시에만 출석으로 인정한다.',
                'CS 관련 자격증, 채용 면접만 가능하며 외부 해커톤의 경우 인정하지 않는다. (증빙서류는 스터디/프로젝트 담당 운영진 혹은 기술 처장에게 제출)',
                '경조사의 경우 당사자 제외 스터디/프로젝트에 허용한다. (해당 팀원 활동점수만 감점, 팀 점수에는 영향 없음)',
              ],
            },
          ]}
        />
        {/* 유의사항 박스 */}
        <div className="text-foreground-foreground-normal text-body-body10 flex flex-col gap-11 pt-16">
          <p>
            * &apos;인정기준&apos;은 &apos;기준 시간의 5분 이상 늦을 경우 지각으로 처리한다.&apos;
            제외 사전에 공지 시에만 인정
          </p>
          <p>
            * OT, 전반기 만남의 장, 후반기 만남의 장 불참 시 YB는 탈퇴처리, OB는 해당 기수의 OB 활동
            참여 불가
          </p>
          <p>* 정규 세션은 20분 전부터 입장 가능</p>
        </div>
      </>
    ),
  },
  {
    title: '활동 점수 득점',
    children: (
      <AccordionTextList
        items={[
          {
            title: '얼리버드',
            scoreChange: '+5',
            descriptions: ['정규 세션 시작 20~10분 전 출석'],
          },
          {
            title: '뒤풀이',
            scoreChange: '+5',
          },
          {
            title: '번개',
            scoreChange: '+5 / +10',
            descriptions: [
              'YB가 개설할 경우, 운영진 1인에게 사진 제출',
              '생성 시 +10 / 참여 시 +5',
            ],
          },
          {
            title: '아지트 정보 공유',
            scoreChange: '1회 +3',
            descriptions: ['1일 1회 제한'],
          },
          {
            title: '기획안 발표',
            scoreChange: '+10',
            descriptions: ['전, 후반기 만남의 장'],
          },
          {
            title: '팀장 역할 수행',
            scoreChange: '+10',
            descriptions: ['스터디 및 프로젝트'],
          },
          {
            title: '기술 세미나 참여',
            scoreChange: '+10',
          },
          {
            title: 'TAVE 활동 후기 업로드',
            scoreChange: '+20',
            descriptions: ['개인블로그 혹은 티스토리에 업로드'],
          },
          {
            title: '기술 블로그 (Week I Learn)',
            scoreChange: '+3',
            descriptions: [
              '개인블로그 혹은 티스토리에 업로드',
              `기술 블로그 제목에 'TAVE 스터디 n주차'와 같은 형식으로 기재`,
            ],
          },
          {
            title: '소모임 생성/활동 (운동, 여행 등)',
            scoreChange: '+15 / +5',
            descriptions: ['생성자는 3회 이상 활동 및 관리', '생성 시 +15 / 활동 시 +5'],
          },
          {
            title: '인스타 스토리 업로드',
            scoreChange: '+3',
            descriptions: [
              '행사, 팀 활동, 번개, 소모임 활동 당일 업로드',
              '태그 필수, 올린 사람만 해당 (집계: 홍보부)',
            ],
          },
        ]}
      />
    ),
  },
  {
    title: '활동 점수 감점',
    children: (
      <AccordionTextList
        items={[
          {
            title: '조별 활동 지각',
            scoreChange: '-5 to -15',
            descriptions: [
              '10분당 감점 처리되며 최대 30분까지 지각 처리',
              '시작 후 5분까지 참작 가능',
            ],
          },
          {
            title: '조별 활동 결석',
            scoreChange: '-30',
            descriptions: ['30분 이상 지각 또는 결석'],
          },
          {
            title: '정규 세션 지각',
            scoreChange: '-10 to -30',
            descriptions: ['10분당 감점 처리 (최대 30분)'],
          },
          {
            title: '정규 세션 결석',
            scoreChange: '-30 / -100',
            descriptions: [
              '필수 정규세션 결석 시 탈퇴 처리 (OT, 전반기 만남의 장, 후반기 만남의 장)',
              '사전 공유 시 -30 / 무단 결석 시 -100',
            ],
          },
          {
            title: '투표 미참여',
            scoreChange: '-15',
            descriptions: ['참석 여부 투표 등 (투표 종료 시부터 적용)'],
          },
          {
            title: '보증금 입금 지연',
            scoreChange: '-5',
            descriptions: ['초과 1일마다'],
          },
          {
            title: '뒤풀이 불참',
            scoreChange: '-10',
            descriptions: ['뒤풀이 신청 후 불참한 경우'],
          },
        ]}
      />
    ),
  },
  {
    title: '조별 활동 관련',
    children: (
      <div className="flex items-center justify-center">
        <GroupActivityTable role="img" aria-label="지각 시간별 차감 점수와 보증금 안내 테이블" />
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
    title: '탈퇴',
    children: (
      <AccordionTextList
        items={[
          {
            title: '탈퇴 처리 기준',
            descriptions: [
              '활동 점수가 0점 이하일 경우',
              '회원간 혹은 운영진과의 불미스러운 일이 발생할 경우',
              '처장단 회의 후 처분 결정 (증빙)',
            ],
          },
        ]}
      />
    ),
  },
];

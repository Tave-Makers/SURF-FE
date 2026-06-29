'use client';

import { Avatar } from '@surf/ui/avatar';
import { HeaderMode } from '@surf/ui/header';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useMemo, useState } from 'react';
import { useDeleteActivityRecordMutation } from '@/entities/activity-score/model/queries/useDeleteActivityRecordMutation';
import { useMemberActivityRecordsQuery } from '@/entities/activity-score/model/queries/useMemberActivityRecordsQuery';
import { useMemberScoreRankingQuery } from '@/entities/activity-score/model/queries/useMemberScoreRankingQuery';
import type { ScoreHistory, ScoreHistoryKind } from '@/entities/activity-score/model/types';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type ScoreMemberDetailPageProps = {
  memberId: number;
};

const tabLabels: Record<ScoreHistoryKind, string> = {
  positive: '상점',
  negative: '벌점',
};

const formatPoint = (point: number) => `${point > 0 ? '+' : ''}${point}점`;
const SCORE_DETAIL_PAGE_SIZE = 50;
const SCORE_MEMBER_PAGE_SIZE = 500;

const scoreTypeByTab: Record<ScoreHistoryKind, 'REWARD' | 'PENALTY'> = {
  positive: 'REWARD',
  negative: 'PENALTY',
};

export const ScoreMemberDetailPage = ({ memberId }: ScoreMemberDetailPageProps) => {
  const openAlert = useAlertStore((state) => state.open);
  const closeAlert = useAlertStore((state) => state.close);
  const showToast = useToastStore((state) => state.show);
  const { mutate: deleteActivityRecord } = useDeleteActivityRecordMutation();

  const [activeTab, setActiveTab] = useState<ScoreHistoryKind>('positive');
  const { data: members = [] } = useMemberScoreRankingQuery({
    pageNum: 0,
    pageSize: SCORE_MEMBER_PAGE_SIZE,
  });
  const member = useMemo(
    () =>
      members.find((item) => item.id === memberId) ?? {
        id: memberId,
        name: `회원 ${memberId}`,
        partCode: '',
        partName: '',
        generation: 0,
        groupName: '',
        profileImageUrl: '',
        positiveScore: 0,
        negativeScore: 0,
        totalScore: 0,
        tracksCount: 1,
      },
    [memberId, members],
  );
  const scoreType = scoreTypeByTab[activeTab];
  const {
    data: currentHistories = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useMemberActivityRecordsQuery({
    memberId,
    scoreType,
    pageNum: 0,
    pageSize: SCORE_DETAIL_PAGE_SIZE,
  });
  const memberInfo = member.generation > 0 ? `${member.generation}기 ${member.partName}` : member.partName;

  const handleDelete = (history: ScoreHistory) => {
    openAlert({
      state: 'default',
      title: '삭제하시겠습니까?',
      infoText: '삭제하기 버튼을 누를 시, 변경된 내용이 반영됩니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            closeAlert();
            deleteActivityRecord(history.id, {
              onSuccess: () => {
                showToast('점수 기록이 삭제되었습니다.');
              },
              onError: (error) => {
                showToast(error.message);
              },
            });
          },
        },
      ],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '개별 회원 점수 조회',
          hasLeftIcon: true,
        }}
      />

      <section className="border-border-normal border-b px-13 pt-15">
        <div className="flex items-start justify-between pb-18">
          <div className="flex flex-col gap-8 pt-17">
            <h2 className="text-body-body2 text-foreground-normal">{member.name}</h2>
            {memberInfo && <InfoBadge text={memberInfo} />}
          </div>
          <Avatar
            src={member.profileImageUrl}
            size="l"
            priority
            alt={`${member.name} 프로필 이미지`}
          />
        </div>

        <div className="flex items-end justify-center gap-5 pb-18">
          <span className="text-body-body1 text-foreground-normal">{member.totalScore}</span>
          <span className="text-body-body3 text-foreground-normal pb-8">점</span>
        </div>

        <div className="grid grid-cols-2">
          {(Object.keys(tabLabels) as ScoreHistoryKind[]).map((kind) => {
            const isActive = activeTab === kind;

            return (
              <button
                key={kind}
                type="button"
                className={`text-body-body8 h-[2.75rem] border-b ${
                  isActive
                    ? 'border-foreground-normal text-foreground-normal'
                    : 'border-border-normal text-foreground-tertiary'
                }`}
                onClick={() => setActiveTab(kind)}
              >
                {tabLabels[kind]}
              </button>
            );
          })}
        </div>
      </section>

      <ul className="scrollbar-hide flex-1 overflow-y-auto">
        {isHistoryLoading && (
          <li className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</li>
        )}
        {isHistoryError && (
          <li className="text-body-body9 text-foreground-tertiary px-13 py-12">
            점수 기록을 불러오지 못했습니다.
          </li>
        )}
        {!isHistoryLoading && !isHistoryError && currentHistories.length === 0 && (
          <li className="text-body-body9 text-foreground-tertiary px-13 py-12">
            점수 기록이 없습니다.
          </li>
        )}
        {currentHistories.map((history) => (
          <li
            key={history.id}
            className="grid min-h-[4.625rem] grid-cols-[2rem_4rem_1fr_4rem] items-start px-13 py-13"
          >
            <button
              type="button"
              aria-label={`${history.label} 점수 기록 삭제`}
              className="text-foreground-normal -ml-4 flex h-8 w-8 items-center justify-center"
              onClick={() => handleDelete(history)}
            >
              <SurfIcon name="X" size="m" />
            </button>
            <span className="text-body-body8 text-foreground-normal pt-1">{history.date}</span>
            <span className="text-body-body6 text-foreground-normal pt-1">{history.label}</span>
            <span className="flex flex-col items-end">
              <span className="text-body-body6 text-foreground-normal">
                {formatPoint(history.point)}
              </span>
              {history.balance != null && (
                <span className="text-body-body11 text-foreground-tertiary">{history.balance}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

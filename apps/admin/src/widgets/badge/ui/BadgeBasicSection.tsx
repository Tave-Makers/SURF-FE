import { FieldGroup } from '@surf/ui/field-group';
import { upgradeHttpToHttps } from '@surf/utils';
import Image from 'next/image';
import { Badge } from '@/entities/badge/model/types';

type BadgeManageMode = 'detail' | 'edit';

type BadgeBasicSectionProps = {
  mode: BadgeManageMode;
  badge: Badge;
};

/**
 * 배지 상세/수정 화면에서 공통으로 사용하는 기본 정보 섹션.
 *
 * 상세 모드에서는 배지 이미지와 이름을 읽기 전용으로 표시하고,
 * 수정 모드에서는 동일한 레이아웃을 유지한 채 입력/업로드 UI로 확장할 수 있다.
 */
export const BadgeBasicSection = ({ mode, badge }: BadgeBasicSectionProps) => {
  const isEdit = mode === 'edit';
  const imageUrl = upgradeHttpToHttps(badge.imageUrl);

  return (
    <>
      <FieldGroup title="뱃지 이미지 등록" className="px-13">
        <div className="rounded-3 border-border-quaternary bg-background-quaternary relative h-[5rem] w-full overflow-hidden border border-dashed">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${badge.name} 이미지`}
              className="object-cover"
              fill
              sizes="343px"
            />
          ) : null}
        </div>
      </FieldGroup>

      <FieldGroup title="뱃지 이름" className="px-13">
        <div
          className="bg-background-quaternary rounded-3 text-body-body9 text-foreground-normal flex min-h-[2.5rem] items-center px-10 py-10"
          aria-readonly={!isEdit}
        >
          {badge.name}
        </div>
      </FieldGroup>
    </>
  );
};

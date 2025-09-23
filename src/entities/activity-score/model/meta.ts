import InstagramIcon from '@/entities/activity-score/ui/icons/instastory.svg';
import SeminarIcon from '@/entities/activity-score/ui/icons/seminar.svg';
import BlogIcon from '@/entities/activity-score/ui/icons/blog.svg';
import EarlyBirdIcon from '@/entities/activity-score/ui/icons/earybird.svg';

export const activityMetaMap: Record<
  string,
  { label: string; Icon?: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  UPLOAD_INSTAGRAM_STORY: { label: '인스타 스토리', Icon: InstagramIcon },
  ENGAGE_TECH_SEMINAR: { label: '기술세미나 참석', Icon: SeminarIcon },
  EARLY_BIRD: { label: '얼리버드', Icon: EarlyBirdIcon },

  // 그룹 대표
  CONTENT_UPLOAD: { label: '콘텐츠 업로드', Icon: BlogIcon },

  // 그룹 하위 (아이콘 없음 → 툴팁에서만 사용)
  UPLOAD_TAVE_REVIEW: { label: '활동 후기 작성' },
  WRITE_WIL: { label: '기술블로그 작성' },
};

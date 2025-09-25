import InstagramIcon from '@/entities/activity-score/ui/icons/instastory.svg';
import SeminarIcon from '@/entities/activity-score/ui/icons/seminar.svg';
import BlogIcon from '@/entities/activity-score/ui/icons/blog.svg';
import EarlyBirdIcon from '@/entities/activity-score/ui/icons/earlybird.svg';
import LateIcon from '@/entities/activity-score/ui/icons/late.svg';
import AbsenceIcon from '@/entities/activity-score/ui/icons/absent.svg';

// 단일/하위 활동 메타 (툴팁 전용 label, 일부는 아이콘 포함)
export const activityMetaMap: Record<
  string,
  { label: string; Icon?: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  // 상점 단일
  UPLOAD_INSTAGRAM_STORY: { label: '인스타 스토리', Icon: InstagramIcon },
  ENGAGE_TECH_SEMINAR: { label: '기술세미나 참석', Icon: SeminarIcon },
  EARLY_BIRD: { label: '얼리버드', Icon: EarlyBirdIcon },

  // 상점 그룹 하위 (툴팁 전용)
  WRITE_WIL: { label: '기술블로그 작성' },
  UPLOAD_TAVE_REVIEW: { label: '활동 후기 작성' },

  // 벌점 그룹 하위 (툴팁 전용)
  SESSION_LATE: { label: '정규세션 지각' },
  TEAM_LATE: { label: '스터디/프로젝트 지각' },
  SESSION_ABSENCE: { label: '정규세션 결석' },
  TEAM_ABSENCE: { label: '스터디/프로젝트 결석' },
};

// 그룹 대표 (아이콘 O)
export const groupMetaMap: Record<
  string,
  { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }
> = {
  blogs: { label: '콘텐츠 업로드', Icon: BlogIcon },
  late: { label: '지각', Icon: LateIcon },
  absence: { label: '결석', Icon: AbsenceIcon },
};

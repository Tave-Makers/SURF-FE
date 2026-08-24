import { ReportForm } from '@/features/report';

interface MemberReportPageProps {
  memberId: number;
  username: string;
  selfIntroduction: string;
}

/** 회원 프로필(닉네임·프로필 사진·자기소개) 신고 화면. 헤더는 routes.tsx의 'member-report'가 그린다. */
export const MemberReportPage = ({
  memberId,
  username,
  selfIntroduction,
}: MemberReportPageProps) => (
  <ReportForm
    targetType="profile"
    targetId={memberId}
    writerLabel="회원"
    writer={username}
    contentLabel="소개"
    content={selfIntroduction.trim() || '등록된 자기소개가 없어요'}
  />
);

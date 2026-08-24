import { ReportForm } from '@/features/report';

interface MemberReportPageProps {
  memberId: number;
  username: string;
  university: string | null;
  graduateSchool: string | null;
}

/** 회원 프로필(닉네임·프로필 사진·학교) 신고 화면. 헤더는 routes.tsx의 'member-report'가 그린다. */
export const MemberReportPage = ({
  memberId,
  username,
  university,
  graduateSchool,
}: MemberReportPageProps) => {
  // 신고자가 프로필에서 본 그대로 보이도록 ProfileHeader와 같은 형식으로 묶는다
  const schoolText = [university?.trim(), graduateSchool?.trim()]
    .filter((value): value is string => !!value)
    .join(' · ');

  return (
    <ReportForm
      targetType="profile"
      targetId={memberId}
      writerLabel="회원"
      writer={username}
      contentLabel="학교"
      content={schoolText || '등록된 학교 정보가 없어요'}
    />
  );
};

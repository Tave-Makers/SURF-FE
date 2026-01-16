import { TextInput } from '@surf/ui/dist/components/text-input';
import { SignupRequestListWidget } from '@/widgets/signup-request/ui/SignupRequestListWidget';

export const SignupRequestPage = () => {
  return (
    <main className="w-full flex-1 flex-col overflow-y-auto">
      {/* 회원 이름 검색 인풋  */}
      <div className="px-16">
        <TextInput mode="search" placeholder="회원이름을 검색해주세요" iconName="Search" />
      </div>
      {/* 회원가입 요청 리스트 위젯, 승인/거절 액션 수행 */}
      <SignupRequestListWidget />
    </main>
  );
};

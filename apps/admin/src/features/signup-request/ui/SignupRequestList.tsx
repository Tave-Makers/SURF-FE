import { SignupRequestItem } from '@/entities/signup-request/ui/SignupRequestItem';

export const SignupRequestList = () => {
  return (
    <div className="flex w-full grow flex-col">
      <SignupRequestItem
        isChecked={true}
        name="테이비"
        status="waiting"
        infoTags={['15기 디자인']}
        timestamp="25.12.31 16:32"
      />
      <SignupRequestItem
        isChecked={false}
        name="테이비"
        status="waiting"
        infoTags={['15기 디자인']}
        timestamp="25.12.31 16:32"
      />
    </div>
  );
};

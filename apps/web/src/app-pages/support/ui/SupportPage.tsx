'use client';

import { HeaderMode } from '@surf/ui/header';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/shared/config/contact';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

const SupportPage = () => {
  return (
    <div className="bg-background-normal flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '문의하기',
          hasLeftIcon: true,
        }}
      />

      <main className="flex flex-1 flex-col gap-16 overflow-y-auto px-15 py-20">
        <section className="flex flex-col gap-8">
          <h1 className="text-title-title1 text-foreground-normal">SURF 지원</h1>
          <p className="text-body-body6 text-foreground-secondary leading-[1.55]">
            앱 이용, 계정, 신고 처리, 개인정보 관련 문의는 아래 이메일로 접수해 주세요. 운영팀은
            영업일 기준 3일 이내에 확인합니다.
          </p>
        </section>

        <section className="border-line-normal rounded-6 flex flex-col gap-8 border px-13 py-14">
          <span className="text-caption-caption4 text-foreground-tertiary">운영팀</span>
          <strong className="text-body-body3 text-foreground-normal">Tave Makers</strong>
        </section>

        <section className="border-line-normal rounded-6 flex flex-col gap-10 border px-13 py-14">
          <span className="text-caption-caption4 text-foreground-tertiary">이메일</span>
          <a
            href={SUPPORT_MAILTO}
            className="text-body-body3 text-foreground-normal underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </section>
      </main>
    </div>
  );
};

export default SupportPage;

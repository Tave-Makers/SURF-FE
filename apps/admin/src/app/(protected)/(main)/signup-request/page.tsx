import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { SignupRequestPage } from '@/app-pages/signup-request/ui/SignupRequestPage';
import { signupRequestQueryOptions } from '@/features/signup-request/model/queries/signupRequestQueryOptions';
import { getQueryClient } from '@/shared/lib/tanstack-query/queryClient';

/**
 * 가입 신청 목록 페이지
 *
 * Server Component에서 초기 데이터를 prefetch하여 Client Component에 hydrate
 */
const Page = async () => {
  const queryClient = getQueryClient();

  // Server-side prefetch: 첫 페이지 데이터 미리 로드
  await queryClient.prefetchInfiniteQuery(signupRequestQueryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SignupRequestPage />
    </HydrationBoundary>
  );
};

export default Page;

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { MemberManagementPage } from '@/app-pages/member-management/ui/MemberManagementPage';
import { getQueryClient } from '@/shared/lib/tanstack-query/queryClient';
import { getMemberGenerationInfoServer } from '@/widgets/member-directory/api/getMemberGenerationInfoServer';
import { memberGenerationListQueryOptions } from '@/widgets/member-directory/model/queries/memberGenerationListQueryOptions';

const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    memberGenerationListQueryOptions({ fetcher: getMemberGenerationInfoServer }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemberManagementPage />
    </HydrationBoundary>
  );
};
export default Page;

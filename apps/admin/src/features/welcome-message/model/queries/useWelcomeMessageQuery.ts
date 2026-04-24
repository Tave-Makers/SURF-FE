import { useQuery } from '@tanstack/react-query';

import { homeContentApi } from '@/features/welcome-message/api/homeContentApi';
import { welcomeMessageQueryKeys } from '@/features/welcome-message/model/queries/queryKeys';

export const useWelcomeMessageQuery = () =>
  useQuery({
    queryKey: welcomeMessageQueryKeys.detail(),
    queryFn: homeContentApi.getHomeContent,
  });

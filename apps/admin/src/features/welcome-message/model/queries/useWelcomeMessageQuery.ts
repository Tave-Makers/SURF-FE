import { useQuery } from '@tanstack/react-query';

import { homeContentApi } from '@/features/welcome-message/api/homeContentApi';
import { mapHomeContentResDtoToWelcomeMessage } from '@/features/welcome-message/model/mapper';
import { welcomeMessageQueryKeys } from '@/features/welcome-message/model/queries/queryKeys';

export const useWelcomeMessageQuery = () =>
  useQuery({
    queryKey: welcomeMessageQueryKeys.detail(),
    queryFn: async () => {
      const data = await homeContentApi.getHomeContent();
      return mapHomeContentResDtoToWelcomeMessage(data);
    },
  });

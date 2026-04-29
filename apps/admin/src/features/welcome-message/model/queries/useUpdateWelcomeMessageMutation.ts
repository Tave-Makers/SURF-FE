import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@surf/ui/store/toastStore';

import { homeContentApi } from '@/features/welcome-message/api/homeContentApi';
import { mapUpdateWelcomeMessageInputToRequest } from '@/features/welcome-message/model/mapper';
import { welcomeMessageQueryKeys } from '@/features/welcome-message/model/queries/queryKeys';
import { UpdateWelcomeMessageInput } from '@/features/welcome-message/model/types';

export const useUpdateWelcomeMessageMutation = () => {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: async (input: UpdateWelcomeMessageInput) =>
      await homeContentApi.updateHomeContent(mapUpdateWelcomeMessageInputToRequest(input)),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: welcomeMessageQueryKeys.all });
      showToast('웰컴 메시지가 수정되었습니다.');
    },
    onError: (err) => {
      console.error('[Welcome Message Update Error]', err.message);
      showToast('웰컴 메시지 수정에 실패했습니다.');
    },
  });
};

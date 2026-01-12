'use client';

import { useEffect } from 'react';
import { trackFeedbackEvent } from '@/features/feedback/lib/trackFeedbackEvent';
import { FEEDBACK_EVENTS } from '@/features/feedback/model/types';
import { FeedbackForm } from '@/features/feedback/ui/FeedbackForm';
import { usePageName } from '@/shared/analytics/lib/getPageName';

const FeedbackPage = () => {
  const pageName = usePageName();

  useEffect(() => {
    trackFeedbackEvent(FEEDBACK_EVENTS.VIEW_FEEDBACK_PAGE, { page_name: pageName });
  }, [pageName]);

  return (
    <>
      <FeedbackForm />
    </>
  );
};

export default FeedbackPage;

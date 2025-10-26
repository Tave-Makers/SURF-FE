'use client';

import { useEffect } from 'react';
import { FeedbackForm } from '@/features/feedback/ui/FeedbackForm';
import { FEEDBACK_EVENTS } from '@/features/feedback/model/types';
import { trackFeedbackEvent } from '@/features/feedback/lib/trackFeedbackEvent';
import { usePageName } from '@/shared/analytics/lib/getPagename';

export default function FeedbackPage() {
  const pageName = usePageName();

  useEffect(() => {
    trackFeedbackEvent(FEEDBACK_EVENTS.VIEW_FEEDBACK_PAGE, { page_name: pageName });
  }, [pageName]);

  return (
    <>
      <FeedbackForm />
    </>
  );
}

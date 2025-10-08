'use client';

import { useEffect } from 'react';
import { FeedbackForm } from '@/features/feedback/ui/FeedbackForm';
import { FEEDBACK_EVENTS } from '@/features/feedback/model/types';
import { trackFeedbackEvent } from '@/features/feedback/lib/trackFeedbackEvent';

export default function FeedbackPage() {
  useEffect(() => {
    trackFeedbackEvent(FEEDBACK_EVENTS.VIEW_FEEDBACK_PAGE, { page_name: window.location.href });
  }, []);

  return (
    <>
      <FeedbackForm />
    </>
  );
}

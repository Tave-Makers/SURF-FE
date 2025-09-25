'use client';

import { FeedbackForm } from '@/features/submit-feedback/ui/FeedbackForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function FeedbackPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>헤더 컴포넌트</div>
      <FeedbackForm />
    </QueryClientProvider>
  );
}

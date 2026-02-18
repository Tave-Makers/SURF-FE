'use client';

import { MemberSearchPage } from '@/app-pages/group-management/ui/MemberSearchPage';

type PageProps = {
  searchParams: Promise<{
    generation: string;
    formKey: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { formKey } = await searchParams;
  const { generation: raw } = await searchParams;
  const generation = Number(raw);
  return <MemberSearchPage generation={generation} formKey={formKey} />;
};

export default Page;

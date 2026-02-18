'use client';

import { MemberSearchPage } from '@/app-pages/group-management/ui/MemberSearchPage';

type PageProps = {
  searchParams: {
    generation: string;
    formKey: string;
  };
};

const Page = ({ searchParams }: PageProps) => {
  const formKey = searchParams.formKey;
  const raw = searchParams.generation;
  const generation = Number(raw);
  return <MemberSearchPage generation={generation} formKey={formKey} />;
};

export default Page;

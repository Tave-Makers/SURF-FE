import { notFound } from 'next/navigation';
import { MemberSearchPage } from '@/app-pages/group-management/ui/MemberSearchPage';

type PageProps = {
  searchParams: Promise<{
    generation?: string;
    formKey?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { formKey, generation: raw } = await searchParams;
  const generation = Number(raw);

  if (!formKey || !Number.isFinite(generation)) {
    return notFound();
  }
  return <MemberSearchPage generation={generation} formKey={formKey} />;
};

export default Page;

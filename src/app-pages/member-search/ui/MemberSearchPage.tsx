import { HeaderMode } from '@/shared/ui/header/Header';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export function MemberSearchPage() {
  return (
    <div>
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '회원',
          hasLeftIcon: true,
        }}
      />
    </div>
  );
}

import Link from 'next/link';
import { NAV_ITEMS } from '../model/config';

export const AppNavigation = () => {
  return (
    <main className="min-h-0 w-full flex-1 overflow-y-auto px-13 py-16">
      <div className="flex min-h-full flex-col justify-center gap-16">
        {NAV_ITEMS.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.path}
              className="border-border-quinary rounded-3 w-full border px-15 py-11 text-center"
            >
              <span className="text-title-title2 text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
};

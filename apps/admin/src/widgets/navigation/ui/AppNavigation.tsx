import Link from 'next/link';
import { NAV_ITEMS } from '../model/config';

export const AppNavigation = () => {
  return (
    <main className="flex h-full w-full flex-col justify-center gap-16 px-13">
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
    </main>
  );
};

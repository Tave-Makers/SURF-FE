import { usePathname } from 'next/navigation';

export function usePageName() {
  const pathname = usePathname();
  return pathname;
}

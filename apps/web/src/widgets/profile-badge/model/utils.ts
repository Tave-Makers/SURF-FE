import type { BadgeItemDTO } from '@/entities/user/api/types';

function awardedAtKey(v?: string) {
  if (!v) return '';
  // "25.09.30" 형태 가정 -> "2025-09-30"로 변환해 정렬 안정화
  const m = v.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!m) return v;
  const yy = Number(m[1]);
  const yyyy = 2000 + yy; // 00~99 -> 2000~2099 가정
  return `${yyyy}-${m[2]}-${m[3]}`;
}

export function dedupeAndSortBadges(items: BadgeItemDTO[]) {
  const seen = new Set<string>();
  const deduped: BadgeItemDTO[] = [];

  for (const b of items) {
    const sig = `${b.badgeId ?? ''}|${b.badgeName ?? ''}|${b.awardedAt ?? ''}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    deduped.push(b);
  }

  deduped.sort((a, b) => awardedAtKey(b.awardedAt).localeCompare(awardedAtKey(a.awardedAt)));
  return deduped;
}

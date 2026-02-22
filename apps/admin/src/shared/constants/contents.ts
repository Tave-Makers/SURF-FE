import type { ContentsType } from '@/shared/types/contents';

export const CONTENTS_TYPE_LABEL: Record<ContentsType, string> = {
  study: '스터디',
  project: '프로젝트',
};

export const CONTENTS_TYPE_OPTIONS: Array<{ value: ContentsType; label: string }> = [
  { value: 'study', label: CONTENTS_TYPE_LABEL.study },
  { value: 'project', label: CONTENTS_TYPE_LABEL.project },
];

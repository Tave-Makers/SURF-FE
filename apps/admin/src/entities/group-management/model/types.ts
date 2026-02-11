import { ContentsType } from '@/shared/ui/ContentItem';

export type Filter = 'all' | ContentsType;

export type Group = { id: number; name: string; type: ContentsType };

export type GenerationGroup = {
  generation: number;
  groupList: Group[];
};

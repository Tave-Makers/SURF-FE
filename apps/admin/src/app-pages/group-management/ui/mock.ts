import type { GenerationGroup } from '@/entities/group-management/model/types';

export const mockGenerationGroups: GenerationGroup[] = [
  {
    generation: 11,
    groupList: [
      { id: 1, name: 'React 심화 스터디', type: 'study' },
      { id: 2, name: 'Surf 프로젝트', type: 'project' },
    ],
  },
  {
    generation: 12,
    groupList: [
      { id: 3, name: 'Next.js 스터디', type: 'study' },
      { id: 4, name: '블록체인 프로젝트', type: 'project' },
      { id: 5, name: '알고리즘 스터디', type: 'study' },
    ],
  },
  {
    generation: 13,
    groupList: [{ id: 6, name: 'AI 프로젝트', type: 'project' }],
  },
];

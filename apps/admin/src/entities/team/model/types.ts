export type TeamKind = 'study' | 'project';

export type Team = {
  id: number;
  name: string;
  kind: TeamKind;
  generation: number;
};

export type TeamMemberTrack = {
  generation: number;
  part: string;
};

export type TeamMember = {
  id: number;
  name: string;
  profileImageUrl: string;
  tracks: TeamMemberTrack[];
};

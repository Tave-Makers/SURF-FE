import { UserProfile } from '@/entities/user/model/types';

export type MemberItemUser = Pick<
  UserProfile,
  'userId' | 'name' | 'bio' | 'level' | 'chips' | 'avatarUrl'
>;

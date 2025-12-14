import { UserProfile } from '@/entities/user/model/types';

export type MemberItemUser = Pick<UserProfile, 'name' | 'bio' | 'level' | 'chips' | 'avatarUrl'>;

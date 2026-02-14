import { Avatar } from '@surf/ui/avatar';
import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { MemberBase } from '@/entities/member/model/types';
import { MemberCardBase } from '@/entities/member/ui/MemberCardBase';
import { RemovableMemberCard } from '@/entities/member/ui/RemovableMemberCard/RemovableMemberCard';

export type GroupManagementMode = 'view' | 'edit' | 'create';

interface GroupMemberSectionProps {
  mode: GroupManagementMode;
  teamLeader?: MemberBase;
  teamMembers?: MemberBase[];
  /** 팀장 선택 (또는 변경) */
  onPickLeader?: () => void;
  /** 팀원 추가 */
  onAddMembers?: () => void;
  /** 팀원 제거 */
  onRemoveMember?: (memberId: number) => void;
}

export const GroupMemberSection = ({
  mode,
  teamLeader,
  teamMembers = [],
  onPickLeader,
  onAddMembers,
  onRemoveMember,
}: GroupMemberSectionProps) => {
  const isEditable = mode === 'edit' || mode === 'create';
  const isRemovalEnabled = mode === 'edit' || mode === 'create';

  const leaderEmpty = !teamLeader;
  const membersEmpty = teamMembers.length === 0;

  return (
    <div className="flex flex-col gap-14">
      {/* 팀장 */}
      <section className="flex flex-col gap-10">
        <FieldGroup title="팀장" isRequired>
          {leaderEmpty ? (
            isEditable ? (
              <SolidButton size="s" variant="secondary" onClick={() => onPickLeader?.()}>
                선택하기
              </SolidButton>
            ) : (
              <div>등록된 팀장이 없습니다.</div>
            )
          ) : (
            <div className="flex flex-col gap-8">
              <MemberCardBase
                name={teamLeader.name}
                tracks={teamLeader.tracks}
                leftSlot={
                  <Avatar
                    src={teamLeader.profileImageUrl}
                    size="m"
                    alt={`${teamLeader.name} 프로필 이미지`}
                  />
                }
                mainProps={{ onClick: () => onPickLeader?.(), className: 'cursor-pointer' }}
              />
            </div>
          )}
        </FieldGroup>
      </section>

      {/* 팀원 */}
      <section className="flex flex-col gap-10">
        <FieldGroup title="팀원" isRequired>
          {membersEmpty ? (
            isEditable ? (
              <SolidButton size="s" variant="secondary" onClick={() => onAddMembers?.()}>
                추가하기
              </SolidButton>
            ) : (
              <div>등록된 팀원이 없습니다.</div>
            )
          ) : (
            <div className="flex flex-col">
              {teamMembers.map((member) => (
                <RemovableMemberCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  profileImageUrl={member.profileImageUrl}
                  tracks={member.tracks}
                  isRemovalEnabled={isRemovalEnabled}
                  onRemoveMember={(memberId) => onRemoveMember?.(memberId)}
                />
              ))}
            </div>
          )}

          {/* edit/create에서만 하단 “추가하기” 버튼 노출 (멤버가 있어도 추가 가능) */}
          {isEditable && !membersEmpty && (
            <div className="mt-10">
              <SolidButton size="s" variant="secondary" onClick={() => onAddMembers?.()}>
                추가하기
              </SolidButton>
            </div>
          )}
        </FieldGroup>
      </section>
    </div>
  );
};

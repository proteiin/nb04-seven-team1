import bcrypt from 'bcrypt';

export class UserService {
  constructor(userRepository, prisma) {
    this.userRepository = userRepository;
    this.prisma = prisma;
  }
  addParticipantToGroup = async (nickname, password, groupId) => {
    try {
      const hashedPassword = await this.hashingPassword(password);

      const updatedGroup = await this.prisma.$transaction(async (tx) => {
        await this.userRepository.joinGroup(
          {
            group_id: groupId,
            nickname,
            password: hashedPassword,
            auth_code: 'PARTICIPANTS',
          },
          tx,
        );
        const result = await this.userRepository.incrementGroupUser(
          groupId,
          tx,
        );
        return result;
      });
      const resultGroup = await this.updateParticipantBadge(updatedGroup);
      return this.userSeparate(resultGroup);
    } catch (error) {
      throw error;
    }
  };

  userSeparate = async (groupData) => {
    const { user, ...groupInfo } = groupData;
    const userToSeparate = [...user];

    const ownerArray = userToSeparate.filter((u) => u.auth_code === 'OWNER');
    const participants = userToSeparate.filter(
      (u) => u.auth_code === 'PARTICIPANTS',
    );

    const owner = ownerArray[0]; // OWNER는 객체로 반환
    return {
      id: groupInfo.id,
      name: groupInfo.group_name,
      description: groupInfo.description,
      photoUrl: groupInfo.image, // image 모델 관련 로직 추가 필요
      goalRep: groupInfo.goal_rep,
      discordWebhookUrl: groupInfo.discord_webhook_url,
      discordInviteUrl: groupInfo.discord_invite_url,
      likeCount: groupInfo.like_count,

      photoUrl: groupInfo.photo_url, // image 모델 관련 로직 추가 필요
      tags: groupInfo.tags.map((tag) => tag.name),
      owner: owner
        ? {
            id: owner.id,
            nickname: owner.nickname,
            createdAt: owner.created_at.getTime(),
            updatedAt: owner.updated_at.getTime(),
          }
        : null,
      participants: participants.map((p) => ({
        id: p.id,
        nickname: p.nickname,
        createdAt: p.created_at.getTime(),
        updatedAt: p.updated_at.getTime(),
      })),

      // --- DateTime -> Timestamp 매핑 ---
      createdAt: groupInfo.created_at.getTime(),
      updatedAt: groupInfo.updated_at.getTime(),
      badges: groupInfo.badges,
    };
  };

  userSeparateForAllGroups = async (groupArray) => {
    return groupArray.map((groupData) => {
      const { user, ...groupInfo } = groupData;

      const userToSeparate = [...user];

      const ownerArray = userToSeparate.filter((u) => u.auth_code === 'OWNER');
      const participants = userToSeparate.filter(
        (u) => u.auth_code === 'PARTICIPANTS',
      );

      const owner = ownerArray[0]; // OWNER는 객체로 반환

      return {
        id: groupInfo.id,
        name: groupInfo.group_name,
        description: groupInfo.description,
        goalRep: groupInfo.goal_rep,
        discordWebhookUrl: groupInfo.discord_webhook_url,
        discordInviteUrl: groupInfo.discord_invite_url,
        likeCount: groupInfo.like_count,
        recordCount: groupInfo._count.record,

        photoUrl: groupInfo.photo_url, // image 모델 관련 로직 추가 필요
        tags: groupInfo.tags.map((tag) => tag.name),

        owner: owner
          ? {
              id: owner.id,
              nickname: owner.nickname,
              createdAt: owner.created_at.getTime(),
              updatedAt: owner.updated_at.getTime(),
            }
          : null,
        participants: participants.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          createdAt: p.created_at.getTime(),
          updatedAt: p.updated_at.getTime(),
        })),

        // --- DateTime -> Timestamp 매핑 ---
        createdAt: groupInfo.created_at.getTime(),
        updatedAt: groupInfo.updated_at.getTime(),
        badges: groupInfo.badges,
      };
    });
  };

  leaveParticipantFromGroup = async (nickname, password, groupId) => {
    try {
      const user = await this.userRepository.findUser({
        group_id: groupId,
        nickname,
      });
      if (!user) {
        const error = new Error('nickname not found');
        error.statusCode = 404;
        error.path = 'nickname';
        throw error;
      }
      const checkPassword = await this.compareHashingPassword(
        password,
        user.password,
      );
      if (!checkPassword) {
        const error = new Error('password is wrong');
        error.statusCode = 401;
        error.path = 'password';
        throw error;
      }
      const leaveGroup = await this.prisma.$transaction(async (tx) => {
        await this.userRepository.deleteRecords({ user_id: user.id }, tx);
        await this.userRepository.leaveGroup({ id: user.id }, tx);
        return await this.userRepository.decrementGroupUser(groupId, tx);
      });

      const participantsBadgeGroup =
        await this.updateParticipantBadge(leaveGroup);
      await this.updateRecordBadge(participantsBadgeGroup);
    } catch (error) {
      throw error;
    }
  };

  hashingPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10; // 암호화 복잡도
    return await bcrypt.hash(password, saltRounds);
  };

  compareHashingPassword = async (password, hashingPassword) => {
    const isMatch = await bcrypt.compare(password, hashingPassword);
    return isMatch;
  };

  updateParticipantBadge = async (groupData) => {
    const groupId = groupData.id;
    const PARTICIPANT_BADGE = 'PARTICIPATION_10';

    let updatedBadges = [...groupData.badges];

    // 현재 상태를 기준으로 배지를 가져야 하는지, 가지고 있는지 확인
    const shouldHaveBadge = groupData.user_count >= 10;
    const hasBadge = updatedBadges.includes(PARTICIPANT_BADGE);

    // 조건에 따라 배지를 추가하거나 제거
    // Case 1: 배지를 가져야 하는데, 가지고 있지 않다면 -> 추가
    if (shouldHaveBadge && !hasBadge) {
      await this.userRepository.addBadgeToGroup(groupId, PARTICIPANT_BADGE);
      updatedBadges.push(PARTICIPANT_BADGE);
    }
    // Case 2: 배지를 가지면 안 되는데, 가지고 있다면 -> 제거
    else if (!shouldHaveBadge && hasBadge) {
      updatedBadges = updatedBadges.filter(
        (badge) => badge !== PARTICIPANT_BADGE,
      );
      await this.userRepository.setGroupBadges(groupId, updatedBadges);
    }

    return { ...groupData, badges: updatedBadges };
  };

  updateRecordBadge = async (groupData) => {
    const groupId = groupData.id;
    const RECORD_BADGE = 'RECORD_100';

    const recordCount = await this.userRepository.getTotalRecords({
      where: { group_id: groupId },
    });

    let updatedBadges = [...groupData.badges];
    const hasBadge = updatedBadges.includes(RECORD_BADGE);
    const shouldHaveBadge = recordCount >= 100;

    if (shouldHaveBadge && !hasBadge) {
      updatedBadges.push(RECORD_BADGE);
    } else if (!shouldHaveBadge && hasBadge) {
      updatedBadges = updatedBadges.filter((badge) => badge !== RECORD_BADGE);
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: { badges: { set: updatedBadges } },
    });

    return { ...groupData, badges: updatedBadges };
  };
}

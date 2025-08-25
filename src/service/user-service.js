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
      return this.userSeparate(updatedGroup);
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
      ...groupInfo,
      owner,
      participants,
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
        ...groupInfo,
        owner,
        participants,
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
      await this.prisma.$transaction(async (tx) => {
        await this.userRepository.deleteRecords({ user_id: user.id }, tx);
        await this.userRepository.leaveGroup({ id: user.id }, tx);
        await this.userRepository.decrementGroupUser(groupId, tx);
      });
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
}

import bycript from 'bcrypt';
import { UserRepository } from '../repository/user-repository.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  addParticipantToGroup = async (nickname, password, groupId) => {
    const updatedGroup = await prisma.$transaction(async (tx) => {
      await this.userRepository.joinGroup(
        { group_id: groupId, nickname, password },
        tx,
      );
      const result = await this.userRepository.incrementGroupUser(groupId, tx);
      return result;
    });
    return updatedGroup;
  };

  leaveParticipantFromGroup = async (nickname, password, groupId) => {
    try {
      await prisma.$transaction(async (tx) => {
        await this.userRepository.leaveGroup(
          { group_id: groupId, nickname, password },
          tx,
        );
        await this.userRepository.decrementGroupUser(groupId, tx);
      });
    } catch (error) {
      next(error);
    }
  };

  hashingPassword = async (password) => {
    const saltRounds = 10; // 암호화 복잡도
    return await bcrypt.hash(password, saltRounds);
  };

  compareHashingPassword = async (password, hashingPassword) => {
    const isMatch = await bcrypt.compare(reqPassword, hashingPassword);
    return isMatch;
  };
}

export default UserService;

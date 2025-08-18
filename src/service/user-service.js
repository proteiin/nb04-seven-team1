import bycript from 'bcrypt';
import { UserRepository } from '../repository/user-repository.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  addParticipantToGroup = async (nickname, password, groupId) => {
    try {
      const hashedPassword = await this.hashingPassword(password);

      const updatedGroup = await prisma.$transaction(async (tx) => {
        await this.userRepository.joinGroup(
          { group_id: groupId, nickname, password: hashedPassword },
          tx,
        );
        const result = await this.userRepository.incrementGroupUser(
          groupId,
          tx,
        );
        return result;
      });
      return updatedGroup;
    } catch (error) {
      throw error;
    }
  };

  leaveParticipantFromGroup = async (nickname, password, groupId) => {
    try {
      const user = await this.userRepository.findUser({
        groupId,
        nickname,
      });
      if (!user) {
        const error = new Error('user not found in this group');
        error.statusCode = 404;
        throw error;
      }
      const checkPassword = await this.compareHashingPassword(
        password,
        user.password,
      );
      if (!checkPassword) {
        const error = new Error('password is wrong');
        error.statusCode = 401;
        throw error;
      }
      await prisma.$transaction(async (tx) => {
        await this.userRepository.leaveGroup({ id: user.id }, tx);
        await this.userRepository.decrementGroupUser(groupId, tx);
      });
    } catch (error) {
      throw error;
    }
  };

  hashingPassword = async (password) => {
    const saltRounds = 10; // 암호화 복잡도
    return await bcrypt.hash(password, saltRounds);
  };

  compareHashingPassword = async (password, hashingPassword) => {
    const isMatch = await bcrypt.compare(password, hashingPassword);
    return isMatch;
  };
}

export default UserService;

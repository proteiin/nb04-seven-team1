import bcrypt from 'bcrypt';
import prisma from '../utils/prisma/index.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
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
      await prisma.$transaction(async (tx) => {
        await this.userRepository.deleteRecords({ user_id: user.id }, tx);
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

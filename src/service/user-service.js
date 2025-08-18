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
}

export default UserService;

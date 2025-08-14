import { UserRepository } from '../repository/user-repository.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  addParticipantToGroup = async (nickname, password, groupId) => {};

  leaveParticipantFromGroup = async (nickname, password, groupId) => {};
}

export default UserService;

import { UserService } from './user-service.js';
import { userRepository } from '../repository/user-index.js';

export const userService = new UserService(userRepository);

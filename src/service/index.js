import { UserService } from './user-service.js';
import { userRepository } from '../repository/index.js';

export const userService = new UserService(userRepository);

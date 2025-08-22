import { UserController } from './user-controller.js';
import { userService } from '../service/user-index.js';

export const userController = new UserController(userService);

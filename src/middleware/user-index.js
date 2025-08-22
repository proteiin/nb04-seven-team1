import { UserValidator } from './user-validation-middleware.js';
import { userRepository } from '../repository/index.js';

export const userValidator = new UserValidator(userRepository);

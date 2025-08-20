import { UserValidator } from './user-validation-middleware.js';
import { userRepository } from '../repository/user-index.js';

export const userValidator = new UserValidator(userRepository);

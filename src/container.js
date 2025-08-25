import { PrismaClient } from '@prisma/client';

// 각 계층의 파일들 임포트, 다른 기능은 중괄호 안 또는 임포트문 따로 작성
import { UserRepository, TagRepository } from './repository/index.js';
import { UserService, TagService } from './service/index.js';
import { UserController, TagController } from './controller/index.js';
import { UserValidator } from './middleware/index.js';

// prisma 인스턴스 생성
const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립
// Repositories
const userRepository = new UserRepository(prisma);
const tagRepository = new TagRepository(prisma);

// Services
const userService = new UserService(userRepository, prisma); // user-service에서 트랜잭션을 위함
const tagService = new TagService(tagRepository);

// controllers
const userController = new UserController(userService);
const tagController = new TagController(tagService);

// Middlewares
const userValidator = new UserValidator(userRepository);

// 조립된 인스턴스를 하나의 객체로 모아서 내보내기
export default {
  userController,
  userValidator,
  tagController,
  // 다른 기능도 추가하시면 될 것 같습니다.
};

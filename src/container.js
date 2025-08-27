import { PrismaClient } from '@prisma/client';

// 각 계층의 파일들 임포트, 다른 기능은 중괄호 안 또는 임포트문 따로 작성
import { 
  UserRepository, 
  TagRepository, 
  ImageRepository, 
  LikeRepository,
  GroupRepository,
  RankingRepository,
  RecordsRepository,
  GroupTagRepository,
} from './repository/index.js';

import { 
  UserService, 
  TagService, 
  ImageService, 
  LikeService,
  GroupService,
  RankingService,
  RecordsService,
} from './service/index.js';

import { 
  UserController, 
  TagController, 
  ImageController, 
  LikeController,
  GroupController,
  RankingController,
  RecordsController,
} from './controller/index.js';

import { 
  UserValidator, 
  GroupMiddleware,
} from './middleware/index.js';

// prisma 인스턴스 생성
const prisma = new PrismaClient();

// 계층별 인스턴스 생성 및 조립
// Repositories
const userRepository = new UserRepository(prisma);
const tagRepository = new TagRepository(prisma);
const imageRepository = new ImageRepository(prisma);
const likeRepository = new LikeRepository(prisma);
const groupRepository = new GroupRepository(prisma);
const groupTagRepository = new GroupTagRepository(prisma);
const rankingRepository = new RankingRepository(prisma);
const recordsRepository = new RecordsRepository(prisma);

// Services
const userService = new UserService(userRepository, prisma); // user-service에서 트랜잭션을 위함
const tagService = new TagService(tagRepository);
const imageService = new ImageService(imageRepository);
const likeService = new LikeService(likeRepository, prisma);
const groupService = new GroupService(groupRepository, groupTagRepository, userService);
const rankingService = new RankingService(rankingRepository);
const recordsService = new RecordsService(recordsRepository, userService);

// controllers
const userController = new UserController(userService);
const tagController = new TagController(tagService);
const imageController = new ImageController(imageService);
const likeController = new LikeController(likeService);
const groupController = new GroupController(groupRepository, groupService);
const rankingController = new RankingController(rankingService);
const recordsController = new RecordsController(recordsService);

// Middlewares
const userValidator = new UserValidator(userRepository);
const groupMiddleware = new GroupMiddleware();

// 조립된 인스턴스를 하나의 객체로 모아서 내보내기
export default {
  userController,
  userValidator,
  tagController,
  imageController,
  likeController,
  groupController,
  rankingController,
  recordsController,
  groupMiddleware,
  // 다른 기능도 추가하시면 될 것 같습니다.
};

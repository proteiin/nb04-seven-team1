// 데이터 베이스 작업이 필요할 때 마다 새로운 인스턴스 생성은 비효율적
// 레포지토리에 직접 생성하는 것은 테스트 마다 직접 데이터베이스에 여결해서 작업하는 것은 비효율적

import { PrismaClient } from '@prisma/client';

export default new PrismaClient();

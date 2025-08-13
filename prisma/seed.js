import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 그룹 생성
  const group1 = await prisma.group.create({
    data: {
      group_name: '런닝크루 A',
      nickname: 'A크루',
      description: '함께 달리는 러닝 그룹',
      password: 'groupApass',
      aimed_time: 500,
      discord_webhook_url: 'https://discord.com/api/webhooks/groupA',
      discord_server_url: 'https://discord.gg/groupA',
      badge: 'PARTICIPANT',
      user_count: 0,
      likecount: 10,
      imageId: 1,
    },
  });

  const group2 = await prisma.group.create({
    data: {
      group_name: '사이클러 B',
      nickname: 'B크루',
      description: '자전거 타는 사람들 모임',
      password: 'groupBpass',
      aimed_time: 800,
      discord_webhook_url: 'https://discord.com/api/webhooks/groupB',
      discord_server_url: 'https://discord.gg/groupB',
      badge: 'LIKECOUNT',
      user_count: 0,
      likecount: 5,
      imageId: 2,
    },
  });

  // 유저 생성 (그룹1 소속)
  const user1 = await prisma.user.create({
    data: {
      nickname: '홍길동',
      password: 'user1pass',
      group_id: group1.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nickname: '김철수',
      password: 'user2pass',
      group_id: group1.id,
    },
  });

  // 유저 생성 (그룹2 소속)
  const user3 = await prisma.user.create({
    data: {
      nickname: '이영희',
      password: 'user3pass',
      group_id: group2.id,
    },
  });

  // Record 생성 (그룹1-홍길동)
  await prisma.record.createMany({
    data: [
      {
        nickname: '홍길동',
        exercise_type: 'RUNNING',
        description: '아침 러닝',
        time: 60, // 분
        distance: 10,
        createdAt: new Date(),
        password: 'rec1pass',
        user_id: user1.id,
        group_id: group1.id,
      },
      {
        nickname: '홍길동',
        exercise_type: 'CYCLE',
        description: '자전거 출퇴근',
        time: 40,
        distance: 15,
        createdAt: new Date(),
        password: 'rec2pass',
        user_id: user1.id,
        group_id: group1.id,
      },
    ],
  });

  // Record 생성 (그룹1-김철수)
  await prisma.record.create({
    data: {
      nickname: '김철수',
      exercise_type: 'SWIMMING',
      description: '수영 연습',
      time: 30,
      distance: 1,
      createdAt: new Date(),
      password: 'rec3pass',
      user_id: user2.id,
      group_id: group1.id,
    },
  });

  // Record 생성 (그룹2-이영희)
  await prisma.record.create({
    data: {
      nickname: '이영희',
      exercise_type: 'RUNNING',
      description: '저녁 러닝',
      time: 50,
      distance: 8,
      createdAt: new Date(),
      password: 'rec4pass',
      user_id: user3.id,
      group_id: group2.id,
    },
  });

  console.log('✅ Seeding 완료!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

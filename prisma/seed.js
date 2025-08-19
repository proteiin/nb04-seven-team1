import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 시드 실행 시 기존 데이터 제거
  await prisma.record.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.group.deleteMany({});

  // 그룹 생성
  const group1 = await prisma.group.create({
    data: {
      group_name: '런닝크루 A',
      description: '함께 달리는 러닝 그룹',
      goal_rep: 500,
      discord_webhook_url: 'https://discord.com/api/webhooks/groupA',
      discord_invite_url: 'https://discord.gg/groupA',
    },
  });

  //  오너를 생성하고 그룹에 연결
  const owner = await prisma.user.create({
    data: {
      nickname: '그룹장_김리더',
      password: await bcrypt.hash('owner_password', 10),
      group_id: group1.id,
      auth_code: 'Owner', // 역할을 'Owner'로 지정
    },
  });

  // 참가자를 생성하고 그룹에 연결
  const participant1 = await prisma.user.create({
    data: {
      nickname: '홍길동',
      password: await bcrypt.hash('user1pass', 10),
      group_id: group1.id,
      auth_code: 'participants', // 역할을 'participants'로 지정
    },
  });

  const participant2 = await prisma.user.create({
    data: {
      nickname: '김철수',
      password: await bcrypt.hash('user2pass', 10),
      group_id: group1.id,
      auth_code: 'participants',
    },
  });

  // user_count를 업데이트
  await prisma.group.update({
    where: { id: group1.id },
    data: { user_count: 3 },
  });

  // 운동 기록 데이터를 생성
  const recordsData = [];
  const usersInGroup1 = [owner, participant1, participant2];
  const exerciseTypes = ['RUNNING', 'CYCLE', 'SWIMMING'];

  for (let i = 0; i < 100; i++) {
    const user = usersInGroup1[i % usersInGroup1.length]; // 유저를 번갈아가며 선택
    const type =
      exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];

    recordsData.push({
      nickname: user.nickname,
      exercise_type: type,
      description: `랜덤 생성된 ${type} 운동 기록 #${i + 1}`,
      time: Math.floor(Math.random() * 120) + 20,
      distance: parseFloat((Math.random() * 20).toFixed(2)),
      password: await bcrypt.hash(`rec${i}pass`, 10),
      user_id: user.id,
      group_id: user.group_id,
    });
  }

  await prisma.record.createMany({
    data: recordsData,
  });

  console.log(
    `✅ Seeding finished: Group, Users, and ${recordsData.length} records created.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import axios from 'axios';

export class RecordsService {
  constructor(recordsRepository, userService, prisma) {
    this.recordsRepository = recordsRepository;
    this.userService = userService;
    this.prisma = prisma;
  }

  // 디스코드 알림 전송 메서드
  sendDiscordNotification = async (group, record) => {
    if (!group.discord_webhook_url) {
      console.log('Discord webhook URL이 설정되지 않았습니다.');
      return;
    }

    const message = {
      content: `새로운 운동 기록이 등록되었습니다!`,
      embeds: [
        {
          title: `${record.author.nickname}님의 운동 기록`,
          fields: [
            { name: '운동 종류', value: record.exerciseType, inline: true },
            { name: '운동 시간', value: `${record.time}분`, inline: true },
            {
              name: '거리',
              value: record.distance ? `${record.distance}km` : '기록 없음',
              inline: true,
            },
            { name: '내용', value: record.description || '내용 없음' },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      await axios.post(group.discord_webhook_url, message);
      console.log('Discord에 알림을 성공적으로 보냈습니다.');
    } catch (error) {
      console.error('Discord 알림 전송에 실패했습니다:', error); // throw로 에러를 던지면 운동 기록 생성이 안되기 때문에 로그만 출력
    }
  };

  createRecord = async (recordData) => {
    const {
      groupId,
      nickname,
      password,
      exerciseType,
      description,
      time,
      distance,
      photos,
    } = recordData;
    const user = await this.recordsRepository.findUserByNickname(
      groupId,
      nickname,
    );
    if (!user) {
      const error = new Error();
      error.status = 404;
      error.message = 'check nickname again';
      throw error;
    }
    const userPassword = String(user.password);

    const isMatch = this.userService.compareHashingPassword(
      userPassword,
      password,
    );

    if (!isMatch) {
      const error = new Error('check password');
      error.status = 401;
      throw error;
    }

    const userId = user.id;

    //레코드 생성
    const dataToCreate = {
      user_id: userId,
      group_id: groupId,
      nickname,
      exercise_type: exerciseType,
      description,
      time,
      distance,
      password,
      images: photos,
    };
    const newRecord = await this.recordsRepository.createRecord(dataToCreate);

    const recordCount = await this.recordsRepository.getTotalRecords(groupId);

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (group) {
      await this.sendDiscordNotification(group, newRecord);
    }

    if (recordCount >= 100) {
      if (!group.badges.includes('RECORD_100')) {
        await this.prisma.group.update({
          where: { id: groupId },
          data: {
            badges: [...group.badges, 'RECORD_100'],
          },
        });
      }
    }

    return newRecord;
  };

  findAllRecords = async (data) => {
    let { groupId, orderBy, order, search, page, limit } = data;
    groupId = Number(groupId);
    let orderByCondition = { created_at: 'desc' };
    page = Number(page);
    limit = Number(limit);

    if (orderBy && order) {
      if (orderBy == 'createdAt' && order == 'asc') {
        orderBy = { created_at: 'asc' };
      } else if (orderBy == 'createdAt' && order == 'desc') {
        orderBy = { created_at: 'desc' };
      } else if (orderBy == 'time' && order == 'asc') {
        orderBy = { time: 'asc' };
      } else if (orderBy == 'time' && order == 'desc') {
        orderBy = { time: 'desc' };
      }
    } else {
      orderBy = { created_at: 'desc' };
    }

    const skip = (page - 1) * limit;
    const take = limit;

    try {
      const records = await this.recordsRepository.findAllRecords({
        groupId,
        orderBy,
        skip,
        take,
        search,
      });
      const totalRecords =
        await this.recordsRepository.getTotalRecords(groupId);
      let formatRecords = [];

      for (const r of records) {
        let formatRecord = {};
        ((formatRecord.id = r.id),
          (formatRecord.exerciseType = r.exercise_type),
          (formatRecord.description = r.description),
          (formatRecord.time = r.time),
          (formatRecord.distance = r.distance),
          (formatRecord.photos = r.images),
          (formatRecord.author = {
            id: r.user_id,
            nickname: r.nickname,
          }));
        formatRecords.push(formatRecord);
      }

      return { data: formatRecords, total: totalRecords };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  findRecordsRanking = async (groupId, period) => {
    const ranking = await this.recordsRepository.findRecordsRanking(
      groupId,
      period,
    );
    return ranking;
  };

  findRecordById = async (groupId, recordId) => {
    const record = await this.recordsRepository.findRecordById(recordId);
    if (!record) {
      throw new Error('없는 기록입니다.');
    }

    if (record.group_id !== groupId) {
      throw new Error('해당 그룹이 아닙니다.');
    }

    return record;
  };
}

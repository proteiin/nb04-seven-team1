export class RecordsService {
  constructor(recordsRepository, userService) {
    this.recordsRepository = recordsRepository;
    this.userService = userService;
  }

  /**
   * 운동 기록 생성
   * @param {object} recordData - 생성할 기록 데이터
   * @param {Promise<object>} - 생성된 기록 객체
   */

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
    return newRecord;
  };

  /**
   * 그룹 내 운동 기록 조회
   * @param {object} - 조회 조건 데이터
   * @param {Promis<object>} - 조회된 기록 목록과 개수
   */

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

  /**
     * 운동 기록 랭킹 조회
     * @param {number} groupId - 그룹ID 
     * @param {string} period - 랭킹 기간('Weekly' or 'monthly') 
      
     * @return {Promise<object>} - 랭킹 데이터
     */

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

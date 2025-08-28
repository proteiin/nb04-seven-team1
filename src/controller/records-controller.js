export class RecordsController {
  constructor(recordsService) {
    this.recordsService = recordsService;
  }
  /**
   * 운동 기록 생성
   * @param {object} req - Express 요청 객체
   * @param {object} res - Express 응답 객체
   * @param {function} next - Express 다음 미들웨어 함수
   */

  createRecord = async (req, res, next) => {
    try {
      let { groupId } = req.params;
      groupId = Number(groupId);
      let {
        authorNickname: nickname,
        authorPassword: password,
        exerciseType,
        description,
        time,
        distance,
        photos,
      } = req.body;
      //에러 확인용 코드

      if (exerciseType == 'run') {
        exerciseType = 'RUNNING';
      } else if (exerciseType == 'bike') {
        exerciseType = 'CYCLE';
      } else if (exerciseType == 'swim') {
        exerciseType = 'SWIMMING';
      }

      const recordData = {
        groupId: groupId,
        nickname,
        exerciseType,
        description,
        time,
        distance,
        password,
        photos: photos,
      };

      const newRecord = await this.recordsService.createRecord(recordData);

      return res.status(201).json(newRecord);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 그룹 내 운동 기록 조회
   * @param {object} req - Express 요청 객체
   * @param {object} res - Express 응답 객체
   * @param {function} next - Express 다음 미들웨어 함수
   */

  findAllRecords = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      let {
        limit = 6,
        orderBy = 'createdAt',
        order = 'desc',
        search = '',
        page = 1,
      } = req.query;
      const records = await this.recordsService.findAllRecords({
        groupId,
        orderBy,
        order,
        search,
        page,
        limit,
      });
      return res.status(200).json(records);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 운동 기록 랭킹 조회
   * @param {object} req - Express 요청 객체
   * @param {object} res - Express 응답 객체
   * @param {function} next - Express 다음 미들웨어 함수
   */

  findRecordsRanking = async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { period } = req.query;
      const ranking = await this.recordsService.findRecordsRanking(
        +groupId,
        period,
      );
      return res.status(200).json({ data: ranking });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 특정 운동 기록 상세 조회
   * @param {object} req - Express 요청 객체
   * @param {object} res - Express 응답 객체
   * @param {function} next - Express 다음 미들웨어 함수
   */

  findRecordById = async (req, res, next) => {
    try {
      const { groupId, recordId } = req.params;
      const record = await this.recordsService.findRecordById(
        +groupId,
        +recordId,
      );
      return res.status(200).json({ data: record });
    } catch (error) {
      next(error);
    }
  };
}

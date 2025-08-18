import { RecordsRepository } from '../repository/records.repository.js';

export class RecordsService {
    constructor(recordsRepository) {
        this.recordsRepository = recordsRepository;
    };

    
    createRecord = async (groupId, nickname, exerciseType, description, time, distance, password) => {

        const user = await this.recordsRepository.findUserByNickname(groupId, nickname);
        if (!user || user.password !== password) {
            const error = new Error('닉네임 또는 비밀번호를 확인해주세요.');
            error.status = 401;
            throw error;
        }
            if (time <= 0) {
                const error = new Error('운동 시간은 0보다 커야합니다.');
                error.status = 400;
                throw error;
            }
        
        const newRecord = await this.recordsRepository.createRecord(
            user.id,
            groupId,
            nickname,
            exerciseType,
            description,
            time,
            distance,
            password,
        );

        return newRecord;
    }

    findAllRecords = async (groupId, sort, search, page) => {
        const records = await this.recordsRepository.findAllRecords(groupId, sort, search, page);
        return records;
    }

    findRecordsRanking = async (groupId, period) => {
        const ranking = await this.recordsRepository.findRecordsRanking(groupId, period);
        return ranking;
    }

    findRecordById = async (groupId, recordId) => {
        const record = await this.recordsRepository.findRecordById(recordId);
        if(!record) {
            throw new Error('없는 기록입니다.');
        }

        if(record.group_id !== groupId) {
            throw new Error('해당 그룹이 아닙니다.');
        }

        return record;
    };
}
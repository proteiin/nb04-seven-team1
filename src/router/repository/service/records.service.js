import { RecordsRepository } from '../repository/records.repository.js';

export class RecordsService {
    constructor(recordsRepository) {
        this.recordsRepository = recordsRepository;
    };

    
    createRecord = async (groupId, nickname, exerciseType, description, time, distance, password) => {
        console.log('Received password in service:', password);
        const user = { id: 1, password: 'password'};
        if(!user || user.password !== password) {
            throw new Error('닉네임과 비밀번호를 확인해주세요.');
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
import { RecordsRepository } from '../repository/records.repository.js';
import axios from 'axios';

export class RecordsService {
    constructor(recordsRepository) {
        this.recordsRepository = recordsRepository;
    };

    
    createRecord = async (recordData) => {
        const { groupId, nickname, password, exerciseType, description, time, distance, photos } = recordData;
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
        
        const newRecord = await this.recordsRepository.createRecord({
            userId: user.id,
            ...recordData,   
    });

        try {
            const group = await this.recordsRepository.prisma.group.findUnique({
                where: { id: groupId },
                select: { discord_webhook_url: true, nickname: true }
            });

            if (group && group.discord_webhook_url) {
                const webhookUrl = group.discord_webhook_url;
                const groupName = group.nickname;
                
                const message = {
                    content: `${groupName}그룹에 새로운 기록이 등록되었습니다.`
                             `닉네임: ${nickname}\n` +
                             `운동 종류: ${exerciseType}\n` +
                             `운동 시간: ${time}분\n` +
                             `운동 거리: ${distance}km\n` +
                             (photos && photos.length > 0 ? `사진: ${photos.join(', ')}\n` : '') +
                             `확인해보세요.`,
                };

                await axios.post(webhookUrl, message);
                console.log('Discord 웹훅 알림 성공');
            }
        }   catch (webhookError) {
            console.log('Discord 웹훅 알림 실패', webhookError.message);
        }         
         
        return newRecord;
    }



    findAllRecords = async (groupId, orderBy, order, search, page) => {
        const records = await this.recordsRepository.findAllRecords(groupId, orderBy, order, search, page);
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
import { auth_code } from '@prisma/client';
import { RecordsRepository } from '../repository/records-repository.js';
import groupRepository from '../repository/group-repository.js';
import axios from 'axios';
import { UserService } from './user-service.js';

export class RecordsService {
    constructor(recordsRepository) {
        this.recordsRepository = new RecordsRepository;
        this.userService = new UserService;
    };

    
    createRecord = async (recordData) => {
        const { groupId, nickname, password, exerciseType, description, time, distance, photos } = recordData;
        const user = await this.recordsRepository.findUserByNickname(groupId, nickname);
        const userPassword = String(user.password);

        const isMatch = this.userService.compareHashingPassword(userPassword,password);
        
        if (!user || !isMatch) {
            const error = new Error('닉네임 또는 비밀번호를 확인해주세요.');
            error.status = 401;
            throw error;
        }
                             
        // const imagesToCreate = photos.map(photoPath => ({
        //     name: photoPath.substring(photoPath.lastIndexOf('/') + 1),
        //     path: photoPath,
        // }));
        
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
            images:photos
        };
        const newRecord = await this.recordsRepository.createRecord(dataToCreate);

        // 기능 확인을 위해 디스코드 웹훅 알림 잠시 주석처리

        // try {
        //     const group = await this.recordsRepository.prisma.group.findUnique({
        //         where: { id: groupId },
        //         select: { discord_webhook_url: true}
        //     });
        //     select에서 user 삭제 (모델 변경으로 nickname을 불러오기 어려워짐 )

            
            // if (group && group.discord_webhook_url) {
            //     const webhookUrl = group.discord_webhook_url;
            //     const groupName = group.nickname;
                
            //     const message = {
            //         content: 
            //                  `닉네임: ${nickname}\n` +
            //                  `운동 종류: ${exerciseType}\n` +
            //                  `운동 시간: ${time}분\n` +
            //                  `운동 거리: ${distance}km\n` +
            //                  (photos && photos.length > 0 ? `사진: ${photos.join(', ')}\n` : '') +
            //                  `확인해보세요.`,
            //     };

            //     await axios.post(webhookUrl, message);
            //     console.log('Discord 웹훅 알림 성공');
            // }
        // }   catch (webhookError) {
        //     //에러 확인을 위한 error 추가
        //     console.error(webhookError)
            //
            // console.log('Discord 웹훅 알림 실패', webhookError.message);
        // }         
         
        return newRecord;
    }



    findAllRecords = async (data) => {
        let {groupId, orderBy, order, search, page, limit} = data
        groupId = Number(groupId);
        let orderByCondition = { created_at: 'desc' };
        page = Number(page);
        limit = Number(limit);
        
        if (orderBy && order) {
            if (orderBy == 'createdAt' && order == 'asc'){
                orderBy = {'created_at':'asc'};
            }else if (orderBy == 'createdAt' && order == 'desc'){
                orderBy = {'created_at':'desc'};
            }else if (orderBy == 'time' && order == 'asc'){
                orderBy = {'time':'asc'};
            }else if (orderBy == 'time' && order == 'desc'){
                orderBy = {'time': 'desc'};
            }
        }else{
            orderBy = {'created_at':'desc'};
        }
        
        const skip = (page-1)*limit;
        const take = limit;
        try{
            const records = await this.recordsRepository.findAllRecords({groupId, orderBy, skip, take, search});
            const totalRecords = await this.recordsRepository.getTotalRecords(groupId);
            let formatRecords= [];
            let formatRecord= {}
            records.map( (r) => {
                formatRecord.id = r.id,
                formatRecord.exerciseType = r.exercise_type,
                formatRecord.description= r.description,
                formatRecord.time = r.time,
                formatRecord.distance = r.distance,
                formatRecord.photos = r.images,
                formatRecord.author = {
                    'id': r.user_id,
                    'nickname': r.nickname
                }
                formatRecords.push(formatRecord)
            })
            return {data:formatRecords, total: totalRecords};
        }catch(error){
            console.error(error)
            throw error;
        }
        
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
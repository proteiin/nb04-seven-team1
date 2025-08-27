export class RecordsService {
    constructor(recordsRepository, userService) {
        this.recordsRepository = recordsRepository;
        this.userService = userService;
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
            

            for (const r of records){
                let formatRecord= {}
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
            }
            
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
export class RecordsController {
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    
    createRecord = async (req, res, next) => {
        try {
            let { groupId } = req.params;
            groupId = Number(groupId)
            let { authorNickname: nickname, authorPassword: password, exerciseType, description, time, distance, photos} = req.body;
            //에러 확인용 코드
            
            if (exerciseType == 'run'){
                exerciseType = 'RUNNING';
            }else if (exerciseType =='bike'){
                exerciseType = 'CYCLE';
            }else if (exerciseType =='swim'){
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
            }               
            

            const newRecord = await this.recordsService.createRecord(recordData);

            return res.status(201).json(newRecord);
        }catch(error) {
            next(error);
        }
    };

    findAllRecords = async (req, res, next) => {
        try {
            const { groupId } = req.params;
            let { limit=6,orderBy='createdAt', order='desc', search="", page=1} = req.query;
            const records = await this.recordsService.findAllRecords({groupId, orderBy, order, search, page, limit});
            return res.status(200).json(records);
        }   catch(error) {
            next(error);
        }
    }

    findRecordsRanking = async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { period } = req.query;
            const ranking = await this.recordsService.findRecordsRanking(+groupId, period);
            return res.status(200).json({ data: ranking });
        } catch(error) {
            next(error);
        }
    }
    
    findRecordById = async (req, res, next) => {
        try {
            const { groupId, recordId } = req.params;
            const record = await this.recordsService.findRecordById(+groupId, +recordId);
            return res.status(200).json({ data: record });
        } catch(error) {
            next(error);
        }
    };
}
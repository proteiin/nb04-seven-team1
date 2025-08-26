import { RecordsService } from '../service/records-service.js'; // 서비스 경로

export class RecordsController {
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    createRecord = async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { authorNickname: nickname, authorPassword: password, exerciseType, description, time, distance, photos} = req.body;
                                  
            const recordData = {
                groupId: +groupId,
                nickname,
                exerciseType,
                description,
                time,
                distance,
                password,
                photos: photos,
            }               
            

            const newRecord = await this.recordsService.createRecord(recordData);
            

            return res.status(201).json({ data: newRecord });
        }   catch(error) {
            next(error);
        }
    };

    findAllRecords = async (req, res, next) => {
        try {
            const { groupId } = req.params;
            const { orderBy, order, search, page } = req.query;
            const records = await this.recordsService.findAllRecords(+groupId, orderBy, order, search, page);

            return res.status(200).json({ data: records });
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
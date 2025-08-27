import express from 'express';
/** export default (recordsController) => {
    const router = express.Router();

    router.post('/groups/:groupId/records', recordsController.createRecord);
    router.get('/groups/:groupId/records', recordsController.findAllRecords);
    router.get('/groups/:groupId/records/ranking', recordsController.findRecordsRanking);
    router.get('/groups/:groupId/records/:recordId', recordsController.findRecordById);

    return router;
};
*/
import { validateGroupId, validateRecordBody } from '../middleware/records-middleware.js';
//import { RecordsController } from '../controller/records-controller.js';

export default (recordsController) => {
    const router = express.Router();

    router.post(
        '/groups/:groupId/records',
        validateGroupId,
        validateRecordBody,
        recordsController.createRecord
    );

    router.get(
        '/groups/:groupId/records',
        validateGroupId,
        recordsController.findAllRecords
    );

    router.get(
        '/groups/:groupId/records/ranking',
        validateGroupId,
        recordsController.findRecordsRanking
    );

    router.get(
        '/groups/:groupId/records/:recordId',
        validateGroupId,
        recordsController.findRecordById
    );

    return router;
};

import express from 'express';
export default (recordsController) => {
    const router = express.Router();

    router.post('/groups/:groupId/records', recordsController.createRecord);
    router.get('/groups/:groupId/records', recordsController.findAllRecords);
    router.get('/groups/:groupId/records/ranking', recordsController.findRecordsRanking);
    router.get('/groups/:groupId/records/:recordId', recordsController.findRecordById);

    return router;
};


import express from 'express';
import { validateGroupId, validateRecordBody } from '../middleware/records-middleware.js';

const router = express.Router({ mergeParams: true });

export default (recordsController) => {
    router.route('/groups/:groupId/records')
        .post(
            validateGroupId,
            validateRecordBody,
            recordsController.createRecord
        )
        .get(
            validateGroupId,
            recordsController.findAllRecords
        );

    router.route('/groups/:groupId/records/ranking')
        .get(
            validateGroupId,
            recordsController.findRecordsRanking
        );

    router.route('/groups/:groupId/records/:recordId')
        .get(
            validateGroupId,
            recordsController.findRecordById
        );

    return router;
};
import express from 'express';

const router = express.Router();

export default (groupController, groupMiddleware) => {
  router.route('/')
    .post(groupMiddleware.validateGroupForm,  groupController.createGroup)
    .get(groupMiddleware.validateGetGroupQuery, groupController.getAllGroups);

  router.route('/:groupId')
    .get(groupMiddleware.validateGroupId, groupController.getGroupById)
    .patch(groupMiddleware.validateGroupId, groupMiddleware.validateGroupForm, groupController.modifyGroup)
    .delete(groupMiddleware.validateGroupId, groupController.deleteGroup);

  return router;
};
import { Router } from 'express';
import GroupController from '../controller/group-controller.js';
// import groupMiddleware from '../middelware/group-middleware.js';
import groupMiddleware from '../middleware/group-middleware.js';

const GroupRouter = Router();

//라우팅

GroupRouter.post('/' ,  groupMiddleware.validateGroupForm,  GroupController.createGroup)

GroupRouter.get('/', groupMiddleware.validateGetGroupQuery, GroupController.getAllGroups)

GroupRouter.get('/:groupId', groupMiddleware.validateGroupId, GroupController.getGroupById)

GroupRouter.patch('/:groupId', groupMiddleware.validateGroupId, groupMiddleware.validateGroupForm, GroupController.modifyGroup)

GroupRouter.delete('/:groupId', groupMiddleware.validateGroupId, GroupController.deleteGroup)

export default GroupRouter
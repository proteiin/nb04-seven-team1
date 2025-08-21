import { Router } from 'express';
import GroupController from '../controller/group-controller.js';
import groupMiddleware from '../middelware/group-middleware.js';

const GroupRouter = Router();

//라우팅

GroupRouter.post('/' , groupMiddleware.validateGroupForm, (req,res,next) => GroupController.createGroup(req,res,next))

GroupRouter.get('/', (req,res,next) => GroupController.getAllGroups(req,res,next))

GroupRouter.get('/:groupId', groupMiddleware.validateGroupId, (req,res,next) => GroupController.getGroupById(req,res,next))

GroupRouter.patch('/:groupId', groupMiddleware.validateGroupId, groupMiddleware.validateGroupForm, (req,res,next) => GroupController.modifyGroup(req,res,next))

GroupRouter.delete('/:groupId', groupMiddleware.validateGroupId, (req,res,next) => GroupController.deleteGroup(req,res,next))

export default GroupRouter
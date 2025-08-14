import { Router } from 'express';
import GroupController from '../controller/group-controller.js';

const GroupRouter = Router();


GroupRouter.post('/' , (req,res) => GroupController.createGroup(req,res))

GroupRouter.get('/', (req,res,next) => GroupController.getAllGroups(req,res,next))

GroupRouter.get('/:groupId', (req,res) => GroupController.getGroupById(req,res))

GroupRouter.patch('/:groupId', (req,res) => GroupController.modifyGroup(req,res))

GroupRouter.delete('/:groupId', (req,res) => GroupController.deleteGroup(req,res))

export default GroupRouter
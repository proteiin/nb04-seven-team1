
import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/tag-repository.js";
import groupService from "../service/group-service.js";

const prisma = new PrismaClient();

class GroupController {
    createGroup = async (req,res,next) => {
        const {name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags} = req.body;
        
        const data = {
            name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags}
        
        try{
            const newGroup = await groupService.createGroup(data);
            return res.status(201).send(newGroup);
        }catch(error){
            res.send(error);
            console.error(error);
        }
        
    }

    getAllGroups = async (req,res,next) => {

        let {page=1, limit=100, order='asc',
            orderBy='createdAt', search} = req.query;
        
        try{
            const AllGroups = await groupService.getAllGroups({page, limit, order,
            orderBy, search});
            return res.status(200).send(AllGroups);
        }catch(error){
            res.send(error);
            console.error(error);
        }
        
        
        
    } 

    getGroupById = async(req,res,next) => {
        const Id = Number(req.params.groupId);
        const group = await groupService.getGroupById(Id);

        return res.status(200).send(group);
    }

    modifyGroup = async(req,res,next) => {
        const groupId = Number(req.params.groupId);

        const {name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = req.body

        const data = {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl}
        try{
            const modifiedGroupAndTag = await groupService.modifyGroup(data);
            console.log('컨트롤러에서 보내는값',modifiedGroupAndTag)
            return res.status(200).send(modifiedGroupAndTag);
        }catch(error){
            res.send(error);
            console.error(error);
        }
        
    }
    

    deleteGroup = async (req,res,next) => {
        let {inputPassword}  = req.body;
        let groupId = req.params.groupId;
        groupId = Number(groupId);

        const message = await groupService.deleteGroup(groupId)
        return res.status(200).send("deleting success");
    }

}


export default new GroupController();
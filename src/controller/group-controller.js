
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

        const newGroup = groupService.createGroup({
            name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags});

        return res.status(201).send(newGroup);
    }

    getAllGroups = async (req,res,next) => {

        let {page=1, limit=10, order='asc',
            orderBy=createdAt, search} = req.query;
        
        const AllGroups = groupService.getAllGroups({page, limit, order,
            orderBy, search});

        return res.status(200).send(AllGroups);
    } 

    getGroupById = async(req,res,next) => {
        const Id = Number(req.params.groupId);
        const group = groupService.getGroupById(Id);

        return res.status(200).send(group);
    }

    modifyGroup(req,res,next){
        const {groupId} = Number(req.params.groupId);
        
        const {name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = req.body

        const modifiedGroup = groupService.modifyGroup({name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl});
        return res.status(200).send(modifiedGroup);
    }
    

    deleteGroup = async (req,res,next) => {
        let {inputPassword}  = req.body;
        let groupId = req.params.groupId;
        groupId = Number(groupId);

        const message = groupService.deleteGroup(groupId)
        return res.status(200).send("deleting success");
    }

}


export default new GroupController();
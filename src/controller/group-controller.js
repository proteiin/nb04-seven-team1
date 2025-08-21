
import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/group-tag-repository.js";
import groupService from "../service/group-service.js";

const prisma = new PrismaClient();

//유효성 검증, req값 불러오기, res 보내는 코드

class GroupController {
    //CREATE METHOD 처리
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
    //GET groups 처리
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
    //GET groups/:groupid 처리
    getGroupById = async(req,res,next) => {
        const Id = Number(req.params.groupId);
        const group = await groupService.getGroupById(Id);

        return res.status(200).send(group);
    }
    //PATCH METHOD 처리
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
            
            return res.status(200).send(modifiedGroupAndTag);
        }catch(error){
            res.send(error);
            console.error(error);
        }
        
    }
    
    //DELETE METHOD 처리
    deleteGroup = async (req,res,next) => {
        let inputPassword  = req.body;
        let groupId = req.params.groupId;
        groupId = Number(groupId);
        try{
            const message = await groupService.deleteGroup(groupId, inputPassword)
            console.log("삭제 완료")
            return res.status(200).send(message);
            
        }catch(error){
            console.error(error);
            return res.send("error occured");
        }
        
    }

}


export default new GroupController();
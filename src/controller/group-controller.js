
import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/tag-repository.js";


const prisma = new PrismaClient();

class GroupController {
    createGroup = async (req,res,next) => {
        
        const {name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags} = req.body
         
        const data = {
            group_name: name, 
            description, 
            nickname: ownerNickname,
            password: ownerPassword,
            goal_rep: goalRep, 
            discord_server_url: discordInviteUrl,
            discord_webhook_url: discordWebhookUrl,
            owner: {
                create:{
                    nickname: ownerNickname,
                    password: ownerPassword
                }
            },
        };
        try{
            const newGroup = await groupRepository.createGroup(data);
            console.log(data);
            const groupId = Number(newGroup.id);
            console.log(groupId);
            const newTags = await tagRepository.createTag(tags,groupId)
            return res.status(201).send(newGroup);
        }catch(error){
            console.error(error);
            res.send(error);
            
        }
        
    }

    getAllGroups = async (req,res,next) => {
        let {skip=0, take=10, orderby, groupname} = req.query
        skip = Number(skip);
        take = Number(take);
        let orderBy;
        switch (orderby) {
            case 'oldest':
                orderBy = {created_at: 'asc'}
                break;

            case 'latest':
                orderBy = {created_at: 'desc'}
                break;

            case 'recommendAsc':
                orderBy = {likecount: 'asc'}
                break;

            case 'recommendDesc':
                orderBy = {likecount: 'desc'}
                break;

            case 'userAsc':
                orderBy = {user_count: 'asc'}
                break;

            case 'userDesc':
                orderBy = {user_count: 'desc'}
                break;

            default:
                orderBy = {created_at: 'asc'}
        };

        const AllGroups= groupRepository.GetAllGroup(skip,take,orderBy,groupname);

        return res.status(200).send(AllGroups);
    } 

    getGroupById = async(req,res,next) => {

        const Id = Number(req.params.groupId);

        const group = groupRepository.GetGroupById(Id)

        return res.status(200).send(group);
    }

    modifyGroup(req,res,next){
        const {groupId} = Number(req.params.groupId);

        const {name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordServerUrl} = req.body


        const group = groupRepository.GetGroupByIdAll(groupId);
        const groupPassword = group.password
        const groupNickname = group.nickname
        
        const data = {
                    group_name: name,
                    description,
                    goal_rep: goalRep,
                    discord_webhook_url: discordWebhookUrl,
                    discord_server_url : discordServerUrl
                }
                

        //이미지 구현 필요
        if (groupPassword == ownerPassword &&
            groupNickname == ownerNickname)
        {
            const modifiedGroup = groupRepository.PatchGroup(data);

            if (tag){
                tagRepository.patchTag(tag, groupId);
            }

            return res.status(200).send(modifiedGroup);
        }
    }

    deleteGroup = async (req,res,next) => {
        let {inputPassword}  = req.body;
        let groupId = req.params.groupId;

        // console.log(groupId, inputPassword)

        groupId = Number(groupId);
        

        const group = groupRepository.GetGroupByIdAll(groupId);

        let groupPassword;

        if (group){
           groupPassword = group.password;
        //에러처리하기


        if (groupPassword == inputPassword){
            groupRepository.DeleteGroup(groupId);
            return res.status(200).send("deleting success");
        }else{
            console.log('wrong password');
            return res.send("failed");
        }
        
    }

    }
}

export default new GroupController();
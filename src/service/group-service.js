import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/tag-repository.js";


const prisma = new PrismaClient();

class GroupService {
    createGroup = async (req,res,next) => {
        
        const {name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags} = req.body
         
        const data = {
            group_name: name, 
            description, 
            goal_rep: goalRep, 
            discord_invite_url: discordInviteUrl,
            discord_webhook_url: discordWebhookUrl,
            user: {
                create:{
                    nickname:ownerNickname,
                    password:ownerPassword,
                    auth_code:'owner'
                }
            }
        };

        const newGroup = await groupRepository.createGroup(data);
        const groupId = Number(newGroup.id);
        const newTags = await tagRepository.createTag(tags,groupId)
        return newGroup
    }

    getAllGroups = async (req,res,next) => {
        let {page=1, limit=10, order='asc',
            orderBy=createdAt, search} = req.query
        skip = Number(skip);
        take = Number(take);

        switch (orderBy) {
            case 'likecount':
                if (order='asc'){
                    orderBy = {likecount: 'asc'}
                }else if (order='desc'){
                    orderBy = {likecount: 'desc'}
                }
                
                break;

            case 'participantCount':
                if (order='asc'){
                    orderBy = {user_count: 'asc'}
                }else if (order='desc'){
                    orderBy = {user_count: 'desc'}
                }
                
                break;

            case 'createdAt':
                if (order='asc'){
                    orderBy = {created_at: 'asc'}
                }else if (order='desc'){
                    orderBy = {created_at: 'desc'}
                }

                break;

            default:
                orderBy = {created_at: 'desc'}
        };

        let skip = (page-1)* take ;
        let take = limit ;
        let groupname = search;

        const allGroups= groupRepository.GetAllGroup(skip,take,orderBy,groupname);
        return allGroups;
    } 

    getGroupById = async(req,res,next) => {

        const Id = Number(req.params.groupId);
        const group = groupRepository.GetGroupById(Id)
        return group;
    }

    modifyGroup(req,res,next){
        const {groupId} = Number(req.params.groupId);

        const {name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = req.body


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

export default new GroupService();
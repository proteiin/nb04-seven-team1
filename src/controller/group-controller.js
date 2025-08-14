
import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";

const prisma = new PrismaClient();

class GroupController {
    createGroup = async (req,res,next) => {
        const {groupName, description,
                 nickname, password, 
                image, tags, aimedTime, 
                discordWebhookUrl, discordServerUrl} = req.body
        
        const data = {
                group_name: groupName,
                description,
                nickname,
                password,
                image,
                tags,
                aimed_time: aimedTime,
                discord_webhook_url: discordWebhookUrl,
                discord_server_url : discordServerUrl
            }

        const newGroup = groupRepository.createGroup(data);

        return res.status(201).send(newGroup);
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
        //어떻게 현재 페이지의 그룹이 데이터로 받아와지는지, 비밀번호가 
        //받아와지는 지 
        const {groupId} = Number(req.params.groupId);

        const {inputPassword}  = req.body;

        const {groupName, description,
                 nickname, password, 
                image, tags, aimedTime, 
                discordWebhookUrl, discordServerUrl} = req.body

        const group = groupRepository.GetGroupByIdAll(groupId);

        const groupPassword = group.password
        
        const data = {
                    group_name: groupName,
                    description,
                    nickname,
                    password,
                    image,
                    tags,
                    aimed_time: aimedTime,
                    discord_webhook_url: discordWebhookUrl,
                    discord_server_url : discordServerUrl
                }

        if (groupPassword == inputPassword){
            const modifiedGroup = groupRepository.PatchGroup(data);

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
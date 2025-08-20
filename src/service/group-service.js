import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/tag-repository.js";


const prisma = new PrismaClient();

class GroupService {
    createGroup = async ({name, description, photoUrl,
        ownerNickname, ownerPassword, 
        goalRep, discordInviteUrl,
        discordWebhookUrl, tags}) => {
        
        
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
                    auth_code:'OWNER'
                }
            }
        };

        const newGroup = await groupRepository.createGroup(data);
        
        const groupId = Number(newGroup.id);
        const newTags = await tagRepository.createTag(tags,groupId)
        
        return newGroup
    }

    getAllGroups = async ({page, limit, orderBy, 
        order, search}) => {
        
        page = Number(page);
        limit = Number(limit);

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

        let skip = (page-1)* limit ;
        let take = limit ;
        let groupname = search;

        const allGroups= groupRepository.GetAllGroup(skip,take,orderBy,groupname);
        return allGroups;
    } 

    getGroupById = async(Id) => {

        
        const group = groupRepository.GetGroupById(Id)
        return group;
    }

    modifyGroup = async (data) => {
        const {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = data

                    //전달받은 데이터
        // const data = {groupId,name, description,
        //         ownerNickname, ownerPassword, 
        //         photoUrl, tags, goalRep, 
        //         discordWebhookUrl, discordInviteUrl}
           
        const groupPassword = await groupRepository.GetPassword(groupId);
        const groupNickname = await groupRepository.GetNickname(groupId);
        
        const prismaData = {
                    group_id: groupId,
                    group_name: name,
                    description,
                    goal_rep: goalRep,
                    discord_webhook_url: discordWebhookUrl,
                    discord_server_url : discordInviteUrl
                }
                
        console.log('group 패스워드:' , groupPassword, 'input패스워드 ',ownerPassword)
        console.log('그룹서비스에서 if문 전')
        //이미지 구현 필요
        if (groupPassword == ownerPassword &&
            groupNickname == ownerNickname){

                const modifiedGroup = groupRepository.PatchGroup(prismaData);

                
                if (tags){
                    tagRepository.patchTag(tags, groupId);
                }
                const result = [modifiedGroup,tags]
                console.log('그룹서비스에서',result)
                return result
        }else{
            console.log('if문 못들어감')
            return null
        }
    }

    deleteGroup = async (groupId) => {

        // console.log(groupId, inputPassword)

        
        const group = groupRepository.GetGroupByIdAll(groupId);

        const groupPassword = groupRepository.GetPassword(groupId);

        if (group){
           groupPassword = group.password;
        //에러처리하기


        if (groupPassword == inputPassword){
            groupRepository.DeleteGroup(groupId);
            return 'success'
        }else{
            return 'failed'
        }   
    }
    }
}

export default new GroupService();
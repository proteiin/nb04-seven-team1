import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/tag-repository.js";

const prisma = new PrismaClient();

//핵심 로직을 작성하는 코드 

class GroupService {
    //태그 생성, 그룹생성, 유저생성 (트랜잭션 구현 필요)
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

    //pagination과 그룹들 불러오기, 검색기능
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

    //특정 그룹 가져오기
    getGroupById = async(Id) => {
        const group = groupRepository.GetGroupById(Id)
        return group;
    }

    // 닉네임과 비밀번호 검증, tag와 group, user 수정(트랜잭션 구현 필요)
    modifyGroup = async (data) => {
        const {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = data

           
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
        console.log('group 닉네임', )
        console.log('그룹서비스에서 if문 전')

        //이미지 구현과 연동 필요

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

    // 비밀번호 검증, 그룹, 유저 삭제
    deleteGroup = async (groupId, inputPassword) => {

        // console.log(groupId, inputPassword)

        
        const group = await groupRepository.GetGroupByIdAll(groupId);

        const groupPassword = await groupRepository.GetPassword(groupId);
        let reqPassword = inputPassword.ownerPassword;
        //에러처리하기

        console.log(groupPassword, reqPassword)
        if (groupPassword == reqPassword){
            await groupRepository.DeleteGroup(groupId);
            console.log("비밀번호 인증 성공")
            return 'success'
        }else{
            return 'failed'
        }   
    }
}


export default new GroupService();
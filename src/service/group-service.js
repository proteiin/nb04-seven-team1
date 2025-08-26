import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'
import groupRepository from "../repository/group-repository.js";
import tagRepository from "../repository/group-tag-repository.js";

import { UserService } from "./user-service.js";

const prisma = new PrismaClient();
const userService = new UserService;
//핵심 로직을 작성하는 코드 

class GroupService {
    //태그 생성, 그룹생성, 유저생성 (트랜잭션 구현 필요)
    createGroup = async ({name, description, photoUrl,
        ownerNickname, ownerPassword, 
        goalRep, discordInviteUrl,
        discordWebhookUrl, tags}) => {
        
        
        const newdata = {
            like_count: 0,
            group_name: name, 
            description, 
            goal_rep: goalRep, 
            discord_invite_url: discordInviteUrl,
            discord_webhook_url: discordWebhookUrl,
            photo_url: photoUrl
        };

        const ownerData = {
            nickname:ownerNickname,
            password:ownerPassword
        }

        const newGroup = await groupRepository.createGroup(newdata);
        const groupId = Number(newGroup.id);
        const newTags = await tagRepository.createTagsbyTagNames(tags,groupId)
        const newOnwer = await groupRepository.createOwnerbyGroupId(ownerData,groupId)
        
        let findGroup = await groupRepository.GetGroupById(groupId);
        findGroup = await userService.userSeparate(findGroup)
        console.log(findGroup)

        return findGroup
    }

    //pagination과 그룹들 불러오기, 검색기능
    // getAllGroups = async ({page, limit, orderBy, 
    //     order, search}) => {
        
    //     page = Number(page);
    //     limit = Number(limit);

    //     switch (orderBy) {
    //         case 'likecount':
    //             if (order==='asc'){
    //                 orderBy = {likecount: 'asc'}
    //             }else if (order==='desc'){
    //                 orderBy = {likecount: 'desc'}
    //             }
                
    //             break;

    //         case 'participantCount':
    //             if (order==='asc'){
    //                 orderBy = {user_count: 'asc'}
    //             }else if (order==='desc'){
    //                 orderBy = {user_count: 'desc'}
    //             }
                
    //             break;

    //         case 'createdAt':
    //             if (order==='asc'){
    //                 orderBy = {created_at: 'asc'}
    //             }else if (order==='desc'){
    //                 orderBy = {created_at: 'desc'}
    //             }

    //             break;

    //         default:
    //             orderBy = {created_at: 'desc'}
    //     };

    //     let skip = (page-1)* limit ;
    //     let take = limit ;
    //     let groupname = search;


    //     let allGroups= await groupRepository.GetAllGroup(skip,take,orderBy,groupname);
    //     let newGroups = [];
    //     // for (let group of allGroups){
    //     //     group = await userService.userSeparate(group);
    //     //     newGroups.push(group)
    //     // }

    //     // allGroups = 
    //     allGroups = await userService.userSeparateForAllGroups(allGroups);
        
    //     let result = {'data': allGroups, 'total': take}
    //     return result

    // } 
// 그룹 목록 조회
      getAllGroups = async ({ page, limit, orderBy, order, search }) => {
    const orderByMap = {
      likecount: 'like_count',
      participantCount: 'user_count',
      createdAt: 'created_at',
    };

    const dbColumn = orderByMap[orderBy] || 'created_at';
    const prismaOrderBy = { [dbColumn]: order };

    const skip = (page - 1) * limit;
    const take = limit;

    const allGroups = await groupRepository.GetAllGroup({
      skip,
      take,
      orderBy: prismaOrderBy,
      search,
    });

    const newGroups = userService.userSeparateForAllGroups(allGroups);
    return newGroups;
  };
// 그룹 카운트
  countAllGroups = async (search) => {
    return await groupRepository.countAllGroups({ search });
  };

    //특정 그룹 가져오기
    getGroupById = async(Id) => {

        let group = await groupRepository.GetGroupById(Id);
        console.log(group)
        try{
            group = await userService.userSeparate(group);
            return group;
        }catch(e){
            console.error(e);
            next(e)
        }
        

    }

    // 닉네임과 비밀번호 검증, tag와 group, user 수정(트랜잭션 구현 필요)
    modifyGroup = async (data) => {
        const {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = data

           
                // const data = {groupId,name, description,
                // ownerNickname, ownerPassword, 
                // photoUrl, tags, goalRep, 
                // discordWebhookUrl, discordInviteUrl}

        const groupPassword = await groupRepository.GetPassword(groupId);
        const groupNickname = await groupRepository.GetNickname(groupId);
        
        const prismaData = {
                    group_name: name,
                    description,
                    goal_rep: goalRep,
                    discord_webhook_url: discordWebhookUrl,
                    discord_invite_url : discordInviteUrl
                }
                

        //이미지 구현과 연동 필요
        if (groupNickname != ownerNickname) {
            let error = new Error;
            error.statusCode = 401;
            error.message = "wrong nickname"
            error.path = 'nickname'
            throw error;
        }else{
            if (groupPassword === ownerPassword ){
                let modifiedGroup = await groupRepository.PatchGroup(prismaData, groupId);

                let newTags;
                if (tags){   
                    const deleteTagIds = await tagRepository.deleteTagsbyGroupId(groupId);

                    newTags = await tagRepository.createTagsbyTagNames(tags,groupId);
                }
                let findGroup = await groupRepository.GetGroupById(groupId)
                findGroup = userService.userSeparate(findGroup);
                return findGroup
            }
        }
        
    }

    // 비밀번호 검증, 그룹, 유저 삭제
    deleteGroup = async (groupId, inputPassword) => {
        //삭제할 그룹 찾기 
        const group = await groupRepository.GetGroupByIdAll(groupId);

        const groupPassword = await groupRepository.GetPassword(groupId);
        const reqPassword = inputPassword.ownerPassword;
        //에러처리하기

        if (groupPassword == reqPassword){
            await groupRepository.DeleteGroup(groupId);
            console.log("비밀번호 인증 성공")
            return groupPassword
        }else{
            let error = new Error;
            error.statusCode = 401;
            error.message = "wrong password"
            error.path = 'password'
            throw error;
        }   
    }
}


export default new GroupService();
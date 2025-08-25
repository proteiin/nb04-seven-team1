import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



//prisma 데이터 베이스 관련 코드

class GroupRepository{
    // 그룹 생성
    createGroup = async (data)=>{
        return await prisma.Group.create({data});
    } 

    //모든 그룹 조회
    GetAllGroup = async (skip,take,orderBy,groupname)=>{
        let allGroups = await prisma.Group.findMany({
            skip,
            take,
            orderBy,
            where:{group_name: {contains: groupname}},
            select:{
                id:true,
                description:true,
                group_name:true,
                image:true,
                goal_rep:true,
                discord_invite_url:true,
                discord_webhook_url:true,
                updated_at,
                created_at,
                tags:true,
                user:{
                    select:{
                        id:true,
                        nickname:true,
                        updated_at:true,
                        created_at:true,
                        auth_code:true
                    }
                }
            }
        });

        allGroups = allGroups.map( g => ({
            name: g.group_name,
            id: g.id,
            tags: g.tags,
            description: g.description,
            user:g.user,
            photoUrl: g.image,
            discordWebhookUrl: g.discord_webhook_url,
            discordInviteUrl: g.discord_invite_url,
            likeCount: g.like_count,
            createdAt: g.created_at,
        }))
        return allGroups
    }

    //그룹을 이용하여 그룹을 참조하는 모델을 불러올 때 사용합니다
    GetGroupByIdAll = async(id)=>{
        const group = await prisma.Group.findUnique({
            where:{id},
        })
        return group
    }
    //특정 그룹 조회
    GetGroupById = async(groupId)=>{
        let group = await prisma.Group.findUnique({
            where:{
                id:groupId
            },
            select:{
                id:true,
                description:true,
                group_name:true,
                image:true,
                tags:true,
                goal_rep:true,
                like_count:true,
                user_count:true,
                user:{
                    select:{
                        id:true,
                        group_id:true,
                        nickname:true,
                        auth_code:true
                    }
                },
                discord_webhook_url,
                discord_invite_url:true,
                created_at:true,
                updated_at:true
            }
        })

        group = {
            name: group.group_name,
            id:group.id,
            tags: group.tags,
            description: group.description,
            user:group.user,
            photoUrl: group.image,
            discordWebhookUrl: group.discord_webhook_url,
            discordInviteUrl: group.discord_invite_url,
            likeCount: group.like_count,
            createdAt: group.created_at,
        };

        return group
    }
    //그룹 수정
    PatchGroup = async(inputData, groupId) => { 
        const modifiedGroup = prisma.Group.update({
            where:{
                id:groupId
            },
            data:inputData
        });
        return modifiedGroup;

    }

    DeleteGroup = async(groupId) => {
        try{
            await prisma.Group.delete({
            where:{
                id : groupId
            }
        });
        }catch(error){
            throw error
        }
        

    }
    //그룹 아이디를 바탕으로 만든사람 비밀번호를 가져옵니다
    GetPassword = async(group_id) =>{
        const owner = await prisma.user.findFirst({
            where: {
                group_id: group_id,
                auth_code: 'OWNER'
            }
        })

        return owner.password;

        
        // const group = await prisma.group.findUnique({
        //     where:{id: group_id},
        //     include:{user:true,}
        // });

        // const users = group.user;
        // let checkOwner = false;
        // for (const user of users){
        //     if (user.auth_code == 'OWNER'){
        //         checkOwner = true;
        //         return  user.password;
        //     }
        // }
        // if (!checkOwner){
        //     const error = new Error;
        //     error.status = 400;
        //     error.message = "Owner user doesn't exist"
        //     throw error
        // }

        
    }

    // 그룹 아이디를 바탕으로 만든사람 닉네임을 가져옵니다
    GetNickname = async(group_id) =>{
        const owner = await prisma.user.findFirst({
            where: {
                group_id: group_id,
                auth_code: 'OWNER'
            }
        })

        return owner.nickname;


    //    const group = await prisma.group.findUnique({
    //         where:{id: group_id},
    //         include:{user:true}
    //     });
    //     let nickname;

    //     let checkOwner = false;
    //     const users = group.user;
    //     for (const user of users){
    //         if (user.auth_code == 'OWNER'){
    //             checkOwner = true;
    //             nickname = user.nickname;

    //         }
    //         }
        

    //     if (!checkOwner){
    //         const error = new Error;
    //         error.status = 400;
    //         error.message = "Owner user doesn't exist"
    //         throw error
    //     }
                

    //     return nickname;
    }

    createGroupAndTag = async() =>{
        // const newGroup = await prisma.Group.create({data});

        // createTagsbyTagNames = async(tagNameArray, groupId) =>{
        // let tags = [];
        // for (let tagName of tagNameArray){
        //     const tag = await prisma.tag.create({
        //         data:{name:tagName,
        //             group: {connect:{id:groupId}}
        //         }
        //     })
        //     tags.push(tag);
        // }
        // return tags;
    }
}



export default new GroupRepository;
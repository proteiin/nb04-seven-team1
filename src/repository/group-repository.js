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
        const allGroups = await prisma.Group.findMany({
            skip,
            take,
            orderBy,
            where:{group_name: {contains: groupname}},
            include : {
                _count:{
                    select:{
                        id:true,
                        group_name:true,
                        image:true,
                        goal_rep:true,
                        discord_invite_url:true,
                        discord_webhook_url:true,
                        tags:true,
                        user:true
            }
                }
            }
            ,
        });
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
        const group = await prisma.Group.findUnique({
            where:{
                id:groupId
            },
            select:{
                group_name:true,
                image:true,
                tags:true,
                goal_rep:true,
                like_count:true,
                user_count:true
            }
        })
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
        const group = await prisma.group.findUnique({
            where:{id: group_id},
            include:{user:true,}
        });

        const users = group.user;
        for (const user of users){
            if (user.auth_code == 'OWNER'){
                return  user.password;
            }else{
                const error = new Error;
                error.status = 400;
                error.message = "Owner user doesn't exist"
                throw error
            }
        }
    }

    // 그룹 아이디를 바탕으로 만든사람 닉네임을 가져옵니다
    GetNickname = async(group_id) =>{
       const group = await prisma.group.findUnique({
            where:{id: group_id},
            include:{user:true}
        });
        let nickname;
        const users = group.user;
        for (const user of users){
            if (user.auth_code == 'OWNER'){
                nickname = user.nickname;
            }else{
                const error = new Error;
                error.status = 400;
                error.message = "Owner user doesn't exist"
                throw error
            }
        }

        return nickname;
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
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



//prisma 데이터 베이스 관련 코드

class GroupRepository{
    // 그룹 생성
    createGroup = async (data)=>{
        
        const newGroup = await prisma.Group.create({data});
        return newGroup
    } 

    //모든 그룹 조회
    GetAllGroup = async (skip,take,orderBy,groupname)=>{
        const allGroups = await prisma.Group.findMany({
            skip,
            take,
            orderBy,
            where:{group_name: {contains: groupname}},
            select:{
                id:true,
                group_name:true,
                image:true,
                goal_rep:true,
                discord_invite_url:true,
                discord_webhook_url:true,
                tags:true,
                user:true
            },
        });
        return allGroups
    }

    //그룹을 이용하여 그룹을 참조하는 모델을 불러올 때 사용합니다
    GetGroupByIdAll = async(Id)=>{
        const group = await prisma.Group.findUnique({
            where:{
                id:Id
            },
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
    PatchGroup = async(data) => {
        const {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = data
                
        const modifiedGroup = prisma.Group.update({
            where:{
                id:groupId
            },
            data
        });

    }

    DeleteGroup = async(groupId) => {
        await prisma.Group.delete({
            where:{
                id : groupId
            },
        });
    }
    //그룹 아이디를 바탕으로 만든사람 비밀번호를 가져옵니다
    GetPassword = async(group_id) =>{
        const group = await prisma.group.findUnique({
            where:{id: group_id},
            include:{user:true,}
        });
        let password;
        const users = group.user;
        for (let user of users){
            if (user.auth_code == 'OWNER'){
                console.log(user)
                password = user.password;
            }
        }
        
        return password
    }

    // 그룹 아이디를 바탕으로 만든사람 닉네임을 가져옵니다
    GetNickname = async(group_id) =>{
       const group = await prisma.group.findUnique({
            where:{id: group_id},
            include:{user:true}
        });
        let nickname;
        const users = group.user;
        for (let user of users){
            if (user.auth_code == 'OWNER'){
                console.log(user)
                nickname = user.nickname;
            }
        }

        return nickname;
    }
}



export default new GroupRepository;
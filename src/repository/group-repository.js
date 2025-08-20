import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//create group  



class GroupRepository{

    createGroup = async (data)=>{
        
        const newGroup = await prisma.Group.create({data});
        return newGroup
    } 

    GetAllGroup = async (skip,take,orderBy,groupname)=>{
        const allGroups = await prisma.Group.findMany({
            skip,
            take,
            orderBy,
            where:{group_name: {contains: groupname}},
            select:{
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

    GetGroupByIdAll = async(Id)=>{
        const group = await prisma.Group.findUnique({
            where:{
                id:Id
            },
        })
        return group
    }

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
            }
        });
    }

    GetPassword = async(group_id) =>{
        const group = await prisma.group.findUnique({
            where:{
                id: group_id,
            },
            include:{
                user:true,
            }
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

    GetNickname = async(group_id) =>{
       const group = await prisma.group.findUnique({
            where:{
                id: group_id,
            },
            include:{
                user:true,
            }
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



export default new GroupRepository
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
                nickname:true,
                image:true,
                tags:true,
                goal_rep:true,
                discord_server_url:true,
                discord_webhook_url:true,
                owner:true,
                participants:true
            }
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
                nickname:true,
                image:true,
                tags:true,
                goalRep:true,
                likecount:true,
                user_count:true
            }
        })
        return group
    }
    
    PatchGroup = async(data,groupId) => {
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
        const user = await prisma.user.findUnique({
            where:{
                group_id,
                auth_code: owner
            }
        });
        const password = user.password
        return password
    }

    GetNickname = async(group_id) =>{
        const user = await prisma.user.findUnique({
            where:{
                group_id,
                auth_code: owner
            }
        });
        const nickname = user.nickname;
        return nickname
    }
}



export default new GroupRepository
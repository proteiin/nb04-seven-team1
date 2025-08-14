import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//create group  



class GroupDatabase{

    createGroup = async ()=>{
        const newGroup = await prisma.Group.create({
        data:{
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
    })
    return newGroup
    } 

    GetAllGroup = async ()=>{
        const allGroups = await prisma.Group.findMany({
            skip,
            take,
            orderBy,
            where:{
                group_name: {
                    contains: groupname
                }
            },
            select:{
                group_name:true,
                nickname:true,
                image:true,
                tags:true,
                aimed_time:true,
                discord_server_url:true,
                discord_webhook_url:true
            }
        });
        return allGroups
    }

    GetGroupById = async()=>{
        const group = await prisma.Group.findUnique({
            where:{
                id:Id
            },
            select:{
                group_name:true,
                nickname:true,
                image:true,
                tags:true,
                aimed_time:true,
                likecount:true,
                user_count:true
            }
        })
        return group
    }
    
    PatchGroup = async() => {
        const modifiedGroup = prisma.Group.update({
            data:{
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
        });
        return modifiedGroup
    }

    DeleteGroup = async(groupId) => {
        await prisma.Group.delete({
            where:{
                id : groupId
            }
        });
    }

}




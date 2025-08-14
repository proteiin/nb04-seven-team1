
import { PrismaClient } from "@prisma/client";
// import prisma from 'prisma'

const prisma = new PrismaClient();

class GroupController {
    createGroup = async (req,res,next) => {
        const {groupName, description,
                 nickname, password, 
                image, tags, aimedTime, 
                discordWebhookUrl, discordServerUrl} = req.body
        
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
        }


        try{
            const AllGroups = await prisma.Group.findMany({
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

            return res.status(200).send(AllGroups);
        }catch(error){
            next(error);
        }
    }

    getGroupById = async(req,res,next) => {
        try{
            const Id = Number(req.params.groupId);
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
            console.log('good')
            return res.status(200).send(group);

            
        }catch(error){
            console.log('bad');
            console.error(error);
            res.send(error);
        }
        
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

        const group = prisma.Group.findUnique({
            group_id : groupID
        })

        if (group){
            const group = prisma.group.findUnique({
                select:{
                    password:true
                }
           });
        }else{
            let error;
            error.status = 403;
            error.message = 'group not found';
            next(error);
        }

        if (groupPassword == inputPassword){
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
            return res.status(200).send(modifiedGroup);
        }else{
            let error;
            error.status = 403;
            error.message = 'password is wrong';
            next(error);
        }
        
    }

    deleteGroup = async (req,res,next) => {
        let {inputPassword}  = req.body;
        let groupId = req.params.groupId;

        console.log(groupId, inputPassword)

        groupId = Number(groupId)
        

        const group = await prisma.Group.findUnique({
            where:{
                id: groupId
            }
        })

        let groupPassword;

        if (group){
           groupPassword = group.password;
           
        }else{
            let error;
            error.status = 403;
            error.message = 'group not found';
            next(error);
        }

        if (groupPassword == inputPassword){
            await prisma.Group.delete({
                where:{
                    id : groupId
                }
            })
            return res.status(200).send("deleting success")
        }else{
            console.log('wrong password')
            return res.send("failed")
        }
        
    }

}


export default new GroupController();
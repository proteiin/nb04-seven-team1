
import groupRepository from "../repository/group-repository.js";
import groupService from "../service/group-service.js";


//유효성 검증, req값 불러오기, res 보내는 코드

class GroupController {
    //CREATE METHOD 처리
    createGroup = async (req,res,next) => {
        const data = req.body
        
        try{
            const newGroup = await groupService.createGroup(data);
            return res.status(201).send(newGroup);
        }catch(error){
            error.statusCode = 500;
            error.message = "server Error(Database)"
            error.path = "database"
            next(error)
        }
        
    }
    //GET groups 처리
    getAllGroups = async (req,res,next) => {

        let {page=1, limit=100, order='asc',
            orderBy='createdAt', search} = req.query;
        try{
            const AllGroups = await groupService.getAllGroups({page, limit, order,
            orderBy, search});
            
            return res.status(200).send(AllGroups);
        }catch(error){
            error.statusCode = 500;
            error.message = "server Error(Database)"
            error.path = "database"
            next(error)
        }
    } 

    //GET groups/:groupid 처리
    getGroupById = async(req,res,next) => {
        const groupId = Number(req.params.groupId);
        try{
            const group = await groupService.getGroupById(groupId);
            if (!group){
                let error = new Error;
                error.statusCode = 404;
                error.message = "group not found"
                next(error);
            }
            return res.status(200).send(group);

        }catch(error){
            error.statusCode = 500;
            error.message = "server Error(Database)"
            error.path = "database"
            next(error);
        }
    }

    //PATCH METHOD 처리
    modifyGroup = async(req,res,next) => {
        const groupId = Number(req.params.groupId);

        const {name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = req.body

        const data = {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl}

        const group = await groupService.getGroupById(groupId);

        if (!group){
            let error = new Error;
            error.statusCode = 404;
            error.message = "group not found"
            next(error);
        }

        try{
            const modifiedGroupAndTag = await groupService.modifyGroup(data);
            
            return res.status(200).send(modifiedGroupAndTag);
        }catch(error){
            next(error);
        }
    }
    
    //DELETE METHOD 처리
    deleteGroup = async (req,res,next) => {
        let { ownerPassword : inputPassword } = req.body;
        let groupId = req.params.groupId;
        groupId = Number(groupId);

        const group = await groupRepository.GetGroupByIdAll(groupId);
        if (!group){
            let error = new Error;
            error.statusCode = 404;
            error.message = "Group not found"
            next(error) ;
        }

        try{
            const groupPassword = await groupRepository.GetPassword(groupId);
        }catch(error){
            next(error);
        }

        if (groupPassword == inputPassword){
            await groupRepository.DeleteGroup(groupId);
            console.log("비밀번호 인증 성공")
            return res.status(200).send(groupPassword);
        }else{
            let error = new Error;
            error.statusCode = 401;
            error.message = "wrong password"
            error.path = 'password'
            next(error) ;
        }
    }
}


export default new GroupController();
//유효성 검증, req값 불러오기, res 보내는 코드

export class GroupController {
    constructor(groupRepository, groupService) {
        this.groupRepository = groupRepository;
        this.groupService = groupService;
    }

    //CREATE METHOD 처리
    createGroup = async (req,res,next) => {
        const data = req.body
        
        try{
            const newGroup = await this.groupService.createGroup(data);
            return res.status(201).send(newGroup);
        }catch(error){
            next(error)
        }
        
    }
    //GET groups 처리
  getAllGroups = async (req, res, next) => {
    try {
      const queryOption = req.validateQuery;
      const allGroups = await this.groupService.getAllGroups(queryOption);
      const countAllGroups = await this.groupService.countAllGroups(
        queryOption.search,
      );
      const responseData = {
        data: allGroups,
        total: countAllGroups,
      };

      return res.status(200).send(responseData);
    } catch (error) {
      next(error);
    }
  };

    //GET groups/:groupid 처리
    getGroupById = async(req,res,next) => {
        const groupId = Number(req.params.groupId);
        try{
            const group = await this.groupService.getGroupById(groupId);
            if (!group){
                let error = new Error;
                error.statusCode = 404;
                error.message = "group not found"
                next(error);
            }
            return res.status(200).send(group);

        }catch(error){
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

        const group = await this.groupService.getGroupById(groupId);

        if (!group){
            let error = new Error;
            error.statusCode = 404;
            error.message = "group not found"
            next(error);
        }

        try{
            const modifiedGroupAndTag = await this.groupService.modifyGroup(data);
            
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

        const group = await this.groupRepository.GetGroupByIdAll(groupId);
        if (!group){
            let error = new Error;
            error.statusCode = 404;
            error.message = "Group not found"
            next(error) ;
        }

        const groupPassword = await this.groupRepository.GetPassword(groupId);

        if (groupPassword == inputPassword){
            await this.groupRepository.DeleteGroup(groupId);
            console.log("비밀번호 인증 성공")
            const result = {"ownerPassword": groupPassword}
            return res.status(200).send(result);
        }else{
            let error = new Error;
            error.statusCode = 401;
            error.message = "wrong password"
            error.path = 'password'
            next(error) ;
        }
    }
}
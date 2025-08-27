export class GroupService {
    constructor(groupRepository, tagRepository, userService) {
        this.groupRepository = groupRepository;
        this.tagRepository = tagRepository;
        this.userService = userService;
    }

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
            photo_url: photoUrl,
        };
     
        if (!tags){
            const error = new Error('invalid tag format');
            error.status = 400;
            error.path = 'tag';
            throw error;
        }

        const ownerData = {
            nickname:ownerNickname,
            password:ownerPassword
        }

        

        const newGroup = await this.groupRepository.createGroup(newdata);
        const groupId = Number(newGroup.id);
        const newTags = await this.tagRepository.createTagsbyTagNames(tags,groupId)
        const newOnwer = await this.groupRepository.createOwnerbyGroupId(ownerData,groupId)
        
        let findGroup = await this.groupRepository.GetGroupById(groupId);
        findGroup = await this.userService.userSeparate(findGroup)

        return findGroup
    }

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

    const allGroups = await this.groupRepository.GetAllGroup({
      skip,
      take,
      orderBy: prismaOrderBy,
      search,
    });

    const newGroups = this.userService.userSeparateForAllGroups(allGroups);
        return newGroups;
    };
    // 그룹 카운트
    countAllGroups = async (search) => {
        return await this.groupRepository.countAllGroups({ search });
    };

    //특정 그룹 가져오기
    getGroupById = async(Id) => {

        let group = await this.groupRepository.GetGroupById(Id);
        if(!group){
            const error =new Error(`Already there isn't group`);
            error.status = 404;
            error.path = 'group';
            throw error;
        }

        try{
            group = await this.userService.userSeparate(group);
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

        let group = await this.groupRepository.GetGroupById(groupId);
        if(!group){
            const error =new Error(`Already there isn't group`);
            error.status = 404;
            error.path = 'group';
            throw error;
        }
                
        const groupPassword = await this.groupRepository.GetPassword(groupId);
        const groupNickname = await this.groupRepository.GetNickname(groupId);
        
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

                let modifiedGroup = await this.groupRepository.PatchGroup(prismaData, groupId);

                let newTags;
                if (tags){   
                    const deleteTagIds = await this.tagRepository.deleteTagsbyGroupId(groupId);

                    newTags = await this.tagRepository.createTagsbyTagNames(tags,groupId);
                }
                let findGroup = await this.groupRepository.GetGroupById(groupId)
                findGroup = this.userService.userSeparate(findGroup);
                return findGroup
            }
        }
        
    }

    // 비밀번호 검증, 그룹, 유저 삭제
    deleteGroup = async (groupId, inputPassword) => {
        //삭제할 그룹 찾기 
        const group = await this.groupRepository.GetGroupByIdAll(groupId);
        if (!group){
            const error =new Error(`Already there isn't group`);
            error.status = 404;
            error.path = 'group';
            throw error;
        }
        const groupPassword = await this.groupRepository.GetPassword(groupId);
        const reqPassword = inputPassword.ownerPassword;
        //에러처리하기

        if (groupPassword == reqPassword){
            await this.groupRepository.DeleteGroup(groupId);
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
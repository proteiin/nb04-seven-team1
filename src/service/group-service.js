export class GroupService {
    constructor(groupRepository, tagRepository) {
        this.groupRepository = groupRepository;
        this.tagRepository = tagRepository;
    }

    //태그 생성, 그룹생성, 유저생성 (트랜잭션 구현 필요)
    createGroup = async ({name, description, photoUrl,
        ownerNickname, ownerPassword, 
        goalRep, discordInviteUrl,
        discordWebhookUrl, tags}) => {
        
        
        const data = {
            group_name: name, 
            description, 
            goal_rep: goalRep, 
            discord_invite_url: discordInviteUrl,
            discord_webhook_url: discordWebhookUrl,
            user: {
                create:{
                    nickname:ownerNickname,
                    password:ownerPassword,
                    auth_code:'OWNER'
                }
            }
        };
        
        const newGroup = await this.groupRepository.createGroup(data);
        
        const groupId = Number(newGroup.id);
        const newTags = await this.tagRepository.createTag(tags,groupId)
        
        return newGroup
    }

    //pagination과 그룹들 불러오기, 검색기능
    getAllGroups = async ({page, limit, orderBy, 
        order, search}) => {
        
        page = Number(page);
        limit = Number(limit);

        switch (orderBy) {
            case 'likecount':
                if (order==='asc'){
                    orderBy = {likecount: 'asc'}
                }else if (order==='desc'){
                    orderBy = {likecount: 'desc'}
                }
                
                break;

            case 'participantCount':
                if (order==='asc'){
                    orderBy = {user_count: 'asc'}
                }else if (order==='desc'){
                    orderBy = {user_count: 'desc'}
                }
                
                break;

            case 'createdAt':
                if (order==='asc'){
                    orderBy = {created_at: 'asc'}
                }else if (order==='desc'){
                    orderBy = {created_at: 'desc'}
                }

                break;

            default:
                orderBy = {created_at: 'desc'}
        };

        let skip = (page-1)* limit ;
        let take = limit ;
        let groupname = search;

        const allGroups= this.groupRepository.GetAllGroup(skip,take,orderBy,groupname);
        return allGroups;
    } 

    //특정 그룹 가져오기
    getGroupById = async(Id) => {
        const group = this.groupRepository.GetGroupById(Id)
        return group;
    }

    // 닉네임과 비밀번호 검증, tag와 group, user 수정(트랜잭션 구현 필요)
    modifyGroup = async (data) => {
        const {groupId,name, description,
                ownerNickname, ownerPassword, 
                photoUrl, tags, goalRep, 
                discordWebhookUrl, discordInviteUrl} = data

           
                // const data = {groupId,name, description,
                // ownerNickname, ownerPassword, 
                // photoUrl, tags, goalRep, 
                // discordWebhookUrl, discordInviteUrl}

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
            const modifiedGroup = await this.groupRepository.PatchGroup(prismaData, groupId);

            let newTags;
            if (tags){   
                const deleteTagIds = await this.tagRepository.deleteTagsbyGroupId(groupId);

                newTags = await this.tagRepository.createTagsbyTagNames(tags,groupId);
            
                const result = [modifiedGroup,newTags];
                return result;

            }
            }else{
                let error = new Error;
                error.statusCode = 401;
                error.message = "wrong password"
                error.path = 'password'
                throw(error);
        }
        }
        
    }

    // 비밀번호 검증, 그룹, 유저 삭제
    deleteGroup = async (groupId, inputPassword) => {
        //삭제할 그룹 찾기 
        const group = await this.groupRepository.GetGroupByIdAll(groupId);

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
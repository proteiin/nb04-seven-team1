export class GroupRepository{
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 그룹 생성
    createGroup = async (data)=>{
        return await this.prisma.Group.create({data});
    } 

    //그룹의 수 조회
    countAllGroups = async (data) => {
        const { search } = data;
        const where = search ? { group_name: { contains: search } } : {};
        return await this.prisma.Group.count({ where });
    };

    //모든 그룹 조회
    GetAllGroup = async (data) => {
        const { skip, take, orderBy, search } = data;
        const where =
        typeof search === 'string' && search.length > 0
            ? { group_name: { contains: search } }
            : {};
        return await this.prisma.Group.findMany({
        skip,
        take,
        orderBy,
        where,
        include: {
            // photo_url: true,
            tags: true,
            // badge: true,
            user: {
            select: {
                id: true,
                nickname: true,
                created_at: true,
                updated_at: true,
                auth_code: true,
            },
            },
        },
        });
    };

    //그룹을 이용하여 그룹을 참조하는 모델을 불러올 때 사용합니다
    GetGroupByIdAll = async(id)=>{
        const group = await this.prisma.Group.findUnique({
            where:{id},
        })
        return group
    }
    //특정 그룹 조회
    GetGroupById = async (groupId) => {
        const group = await this.prisma.group.findUnique({
        where: { id: groupId },
        include: {
            tags: true,
            user: {
            select: {
                id: true,
                nickname: true,
                created_at: true,
                updated_at: true,   
                auth_code: true,
            },
            },
        },
        });

        group.badges = group.badges || []

        return group;
    };

    //그룹 수정
    PatchGroup = async(inputData, groupId) => { 
        const modifiedGroup = this.prisma.Group.update({
            where:{
                id:groupId
            },
            data:inputData
        });
        return modifiedGroup;
    }

    DeleteGroup = async(groupId) => {
        try{
            await this.prisma.Group.delete({
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
        const owner = await this.prisma.user.findFirst({
            where: {
                group_id: group_id,
                auth_code: 'OWNER'
            }
        })

        return owner.password;
    }

    // 그룹 아이디를 바탕으로 만든사람 닉네임을 가져옵니다
    GetNickname = async(group_id) =>{
        const owner = await this.prisma.user.findFirst({
            where: {
                group_id: group_id,
                auth_code: 'OWNER'
            }
        })

        return owner.nickname;
    }

    createOwnerbyGroupId = async(data, groupId) => {
        const {nickname, password} = data

        const newOwner= await this.prisma.user.create({
            data:{
                nickname,
                password,
                group:{
                    connect:{id:groupId}
                },
                auth_code: 'OWNER'
            }
            
        });
        return newOwner;
    }
}
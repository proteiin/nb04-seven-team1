export class GroupTagRepository{
    constructor(prisma) {
        this.prisma = prisma;
    }

    //태그 네임 배열로 태그들 생성
    createTagsbyTagNames = async(tagNameArray, groupId) =>{
        const data = tagNameArray.map( (name) => ({
            name: name,
            group_id: groupId
        }));

        await this.prisma.tag.createMany({
            data:data
        })



        // let tags = [];
        // for (const tagName of tagNameArray){
        //     const tag = await this.prisma.tag.create({
        //         data:{name:tagName,
        //             group: {connect:{id:groupId}}
        //         }
        //     })
        //     tags.push(tag);
        // }
        // return tags;
    }

    //그룹 아이디로 연관된 태그들 가져오기
    getTagsByGroupId = async(groupId) => {
        const group = await this.prisma.group.findUnique({
            where:{id:groupId}
        })

        const tags = await this.prisma.tag.findMany({
            where:{group_id:groupId}
        })

        return tags;
    }

    //.그룹 아이디로 연관된 태그 아이디들 가져오기
    getTagIdsByGroupId = async(groupId) => {
        let tagIdarray = [];
        const tags =  await this.prisma.group.findMany({
            where:{group_id:groupId}
        })
        for (tag of tags){
            tagarray.push(tag.id)
        }
        return tagIdarray;
    }

    //태그 수정
    patchTag = async(tagId,data) =>{
        const tag = await this.prisma.tag.update({
            where:{id:tagId},
            data
        })
    }

    // 태그 id로 들어온 태그를 삭제
    deleteTag = async(tagId) => {
        await this.prisma.tag.delete({
            where:{id:tagId}
        });
    
    }
    
    //tag id 배열에 있는 태그들을 삭제
    deleteTags = async(tagIdArray) => {
        for (const tagId of tagIdArray){
            await this.prisma.tag.delete({
                id:tagId
            })
        }
    }
    //group Id로 태그들 삭제
    deleteTagsbyGroupId = async(groupId) => {
        await this.prisma.tag.deleteMany({
            where:{group_id:groupId}
        });
    }
}

import express from 'express'
import { PrismaClient }  from '@prisma/client'

const prisma = new PrismaClient();
class TagRepository{

    //태그 네임 배열로 태그들 생성
    createTagsbyTagNames = async(tagNameArray, groupId) =>{
        let tags = [];
        for (let tagName of tagNameArray){
            const tag = await prisma.tag.create({
                data:{name:tagName,
                    group: {connect:{id:groupId}}
                }
            })
            tags.push(tag);
        }
        return tags;
    }

    //그룹 아이디로 연관된 태그들 가져오기
    getTagsByGroupId = async(groupId) => {
        const group = await prisma.group.findUnique({
            where:{id:groupId}
        })

        const tags = await prisma.group.findMany({
            where:{group_id:groupId}
        })

        return tags;
    }

    //.그룹 아이디로 연관된 태그 아이디들 가져오기
    getTagIdsByGroupId = async(groupId) => {
        let tagIdarray = [];
        const tags =  await prisma.group.findMany({
            where:{group_id:groupId}
        })
        for (tag of tags){
            tagarray.push(tag.id)
        }
        return tagIdarray;
    }

    //태그 수정
    patchTag = async(tagId,data) =>{
        const tag = await prisma.tag.update({
            where:{id:tagId},
            data
        })
    }

    // 태그 id로 들어온 태그를 삭제
    deleteTag = async(tagId) => {
        await prisma.tag.delete({
            where:{id:tagId}
        });
    
    }
    
    //tag id 배열에 있는 태그들을 삭제
    deleteTags = async(tagIdArray) => {
        for (let tagId of tagIdArray){
            await prisma.tag.delete({
                id:tagId
            })
        }
    }
    //group Id로 태그들 삭제
    deleteTagsbyGroupId = async(groupId) => {
        let tagIdarray = [];
        const tags =  await prisma.tag.findMany({
            where:{group_id:groupId}
        })

        for (let tag of tags){
            tagIdarray.push(tag.id);
        }

        for (let tagId of tagIdarray){
            await prisma.tag.delete({
                where:{id:tagId}
            })
        }
        
    }
}

export default new TagRepository()
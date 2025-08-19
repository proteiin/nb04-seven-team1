
import express from 'express'
import { PrismaClient }  from '@prisma/client'

const prisma = new PrismaClient();
class TagRepository{
    createTag = async(tags,groupId) =>{
        const newTags = []

        for (let tag of tags){
            const newTag = await prisma.tag.create({
                data:{
                    name: tag,
                    group: {
                        connect:{id:groupId}
                    }
                }
            });
            newTags.push(newTag)
        }
        console.log('newTags: ', newTags)
        return newTags;
    }

    patchTag = async(tags,groupId) =>{
        const patchTag = tags.map( async() => {
            await prisma.tag.patch({
                name: tag,
                group:{
                    connect:[{id:groupId}]
                }
            })
        });
        return patchTag;
    }           
}

export default new TagRepository()

import express from 'express'
import prisma from '@prisma/client'

class TagRepository{
    createTag = async(tags,groupId) =>{
        await prisma.tags.create({
                name: tag,
                group: {
                    connect:[{id:groupId}]
                }
            });
    }

    patchTag = async(tags,groupId) =>{
        tags.map( async() => {
            await prisma.tags.patch({
                name: tag,
                group:{
                    connect:[{id:groupId}]
                }
            })
        } )
    }           
}

export default new TagRepository()
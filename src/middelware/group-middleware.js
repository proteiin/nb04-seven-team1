class groupMiddleware{
    validateGroupForm = (req,res,next) => {
        let {name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags} = req.body;

        const inputData = {name, description, photoUrl,
            ownerNickname, ownerPassword, 
            goalRep, discordInviteUrl,
            discordWebhookUrl, tags}    

        for (data of inputData){
            if (!data){
                let error = new Error()
                error.statusCode = 400;
                error.message = `%{data} is missing`
                error.path = data;
                next(error);
            }
        }
        
        goalRep = Number(goalRep)
        if (isNaN(goalRep)){
            let error = new Error;
            error.statusCode = 400;
            error.message = 'goalRep must be integer'
            error.path = 'goalRep'
            next(error);
        }

    }

    validateGetGroupQuery = (req,res,next) => {
        let {page=1, limit=100, order='asc',
            orderBy='createdAt', search} = req.query;

        page = Number(page)
        limit = Number(limit)

        if (isNaN(page)){
            let error = new Error;
            error.statusCode = 400;
            error.message = 'page must be integer'
            error.path = 'page'
            next(error);
        }

        if (isNaN(limit)){
            let error = new Error;
            error.statusCode = 400;
            error.message = 'limit must be integer'
            error.path = 'limit'
            next(error);
        }

        if (order != 'asc' && order != 'desc'){
            let error = new Error;
            error.statusCode = 400;
            error.message = "The order parameter must be one of the following values: ['asc', 'dsc']"
            error.path = 'order'
            next(error);
        }

        if (orderBy != 'createdAt' && orderBy != 'likeCount' &&
            orderBy != 'participantCount'
        ){
            let error = new Error;
            error.statusCode = 400;
            error.message = "The orderBy parameter must be one of the following values: ['likeCount', 'participantCount', 'createdAt']"
            error.path = 'orderBy'
            next(error);
        }



    }

    validateGroupId = (req,res,next) => {
        const groupId = Number(req.params.groupId);
        if (isNaN(groupId)){
            let error = new Error;
            error.statusCode = 400;
            error.message = "groupId must be integer"
            error.path = 'groupId'
            next(error);
        }
    }




}

export default new groupMiddleware;
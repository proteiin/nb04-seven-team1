class groupMiddleware{
    validateGroupForm = (req,res,next) => {
        const inputData = req.body;

        for (const [key,value] of Object.entries(inputData)){
            if (!value){
                let error = new Error()
                error.statusCode = 400;
                error.message = `${key} is missing`
                error.path = key;
                next(error);
            }
            
        }
        
        const goalRep = Number(goalRep)
        if (isNaN(goalRep)){
            let error = new Error;
            error.statusCode = 400;
            error.message = 'goalRep must be integer'
            error.path = 'goalRep'
            next(error);
        }
        next();

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
            next(error) ;
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

        next();
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
        next();
    }
}

export default new groupMiddleware;
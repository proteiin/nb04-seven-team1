export class GroupMiddleware{
    validateGroupForm = (req,res,next) => {
        const inputData = req.body;
        for (const key in inputData){
            if (!inputData[key]){ 
                let error = new Error()
                error.statusCode = 400;
                error.message = `${key} is missing`
                error.path = key;
                return next(error);
            }
            
        }

        const goalRep = Number(inputData.goalRep);

        if (isNaN(goalRep)){
            let error = new Error;
            error.statusCode = 400;
            error.message = 'goalRep must be integer'
            error.path = 'goalRep'
            return next(error);
        }
        next();

    }

      validateGetGroupQuery = (req, res, next) => {
    try {
      const { search } = req.query || {};

      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');

      if (!Number.isInteger(page) || page < 1) {
        const error = new Error('Page must be a positive integer');
        error.statusCode = 400;
        error.path = 'page';
        return next(error);
      }

      if (!Number.isInteger(limit) || limit < 1) {
        const error = new Error('limit must be a positive integer');
        error.statusCode = 400;
        error.path = 'limit';
        return next(error);
      }

      const order =
        req.query.order && req.query.order.toLowerCase() === 'desc'
          ? 'desc'
          : 'asc';
      const allowedOrderByFields = [
        'createdAt',
        'likeCount',
        'participantCount',
      ];
      let orderBy = req.query.orderBy || 'createdAt';
      if (!allowedOrderByFields.includes(orderBy)) {
        orderBy = 'createdAt';
      }
      
      // 검증이 끝난 쿼리 
      req.validateQuery = {
        page,
        limit,
        order,
        orderBy,
        search,
      }
      next();
    } catch (error) {
      next(error);
    }
  };

    validateGroupId = (req,res,next) => {
        const groupId = Number(req.params.groupId);
        if (isNaN(groupId)){
            let error = new Error;
            error.statusCode = 400;
            error.message = "groupId must be integer"
            error.path = 'groupId'
            return next(error);
        }
        next();
    }

}
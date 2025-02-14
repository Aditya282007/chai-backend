const asyncHandler = (requestHandler) => {
       return (req, res, next) => {
              Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
       }
}


export default asyncHandler;

// const asyncHandler = (fn) => async (res,req,next) => {
//        try{
//               await fn(res, req, next)
//        }
//        catch(error){
//               res.status(error.code || 500).json({
//                      success: false,
//                      message: error.message
//               })
//        }
// }
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};


    
   
 
    

         






export {asyncHandler}

// const asynchandler = () => {}
// const asynchandler = (func) => () => {}
// const asynchandler = (func) => async () => {}




// const asynchandler = (fn) => (req, res, next) => {
//     try{

//     }catch(error){
//         res.status(err.code || 500).json({
//             success:false,
//             message:error.message
//         })

//     }


// }
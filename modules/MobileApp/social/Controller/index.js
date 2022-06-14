// MARKET CONTROLLER

const { method, get } = require("lodash");



const methods = {};




methods.getAllFriendsPost = async (req,res)=>{

    try{
        // initialize body        
        
        
        let getAllFriendsPost = await SocialPostSchema.find({user_id : {$in:['629c76daba51ae90e4fa2728']}});
        console.warn(getAllFriendsPost);
        if(getAllFriendsPost.length != 0 ){

                         
        
                return res.send({
                    status:true,
                    message:'Successfully got all post.',
                    data:getAllFriendsPost
                }) 
            
        }else{
            return res.send({
                status:false,
                message:'Failed to get all post.',                
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



module.exports = methods;
// MARKET CONTROLLER


const { method, get } = require("lodash");



const methods = {};

methods.getNotifications = async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;

        console.warn(userId);
        let tempNotif = await NotificationSchema.find({receiver_user_id:userId}).lean();                  
        
        if(tempNotif.length > 0){    
            Promise.all(tempNotif.map(async (user,index)=>{
                let checkUser = await UsersSchema.findOne({_id:user.receiver_user_id });
                user.receiverInfo  = checkUser;
                    
                return {
                    name:`${checkUser.first_name} ${checkUser.last_name}`,
                    message:user.message,
                    date: user.date_created,
                    profile:checkUser.profile_image
                };
           })).then((response)=>{
                return res.send({
                    status:true,
                    message:'Successfully got all notif.',
                    data:response
                }) 
           })
        
            
        }else{
            return res.send({
                status:false,
                message:'Notification.',
                data:[]                
            }) 
        }
     
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




module.exports = methods;
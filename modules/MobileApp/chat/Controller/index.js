// MARKET CONTROLLER


const { method, get } = require("lodash");



const methods = {};





methods.sendMessage = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
        let friendUserId = req.body.friendUserId;
        let room = req.body.room;
        let message = req.body.message[0].text;

        let checkRoom = await ChatRoomSchema.findOne({room_name:room});

        if(checkRoom)
        {   
            console.warn(checkRoom);
             checkRoom.messages.push({user_id:userId,friend_user_id:friendUserId,text:message,giftedChatInfo:req.body.message});
           
            
            let updatePayload = {
                $set:{
                    messages:checkRoom.messages
                }
            };

            ChatRoomSchema.findOneAndUpdate({room_name:room},updatePayload, {new:true},function (updateError,updateResult) {
                if(updateError){
                    console.warn(updateError)
                    // error on update
                    return res.send({
                        status:false,        
                    })
        
                }else{        
                 
                    return  res.send({
                        status:true,   
                        data:updateResult
                    })                    
                }
            
            });

        }else{

            let createPayload = {
                room_name:room,
                messages:[{user_id:userId,friend_user_id:friendUserId,text:message,giftedChatInfo:req.body.message}]
            };

            ChatRoomSchema.create(createPayload, (chatRoomInsertError, insertChatRoomResult) => {                    
                if(chatRoomInsertError){
                    // error create
                    return  res.send({
                        status:false,
                        message:'Something went wrong.',    
                        error:userError         
                    })
                }else if(insertChatRoomResult){
                    return  res.send({
                        status:true,   
                        data:insertChatRoomResult
                    })        
                }
            });

        }




     
    
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.checkRoom = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
        let friendUserId = req.body.friendUserId;
        let room = req.body.room;
   
        
        let checkRoom = await ChatRoomSchema.findOne({ $or:[{"messages.user_id" :userId, "messages.friend_user_id": friendUserId },{"messages.friend_user_id": userId,"messages.user_id" :friendUserId}]})


        if(checkRoom ){
            return res.send({status:true,data:checkRoom})
        }else{
            return res.send({status:false,data:{room:room}})
        }


               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}

module.exports = methods;
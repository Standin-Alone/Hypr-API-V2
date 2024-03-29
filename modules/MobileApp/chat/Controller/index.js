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
        console.warn(`BODY`,req.body);
        let checkRoom = await ChatRoomSchema.findOne({room_name:room});

        if(checkRoom)
        {   
          
             checkRoom.messages.push({user_id:userId,friend_user_id:friendUserId,text:message,giftedChatInfo:req.body.message});
           
            
            let updatePayload = {
                $set:{
                    messages:checkRoom.messages
                }
            };

            ChatRoomSchema.findOneAndUpdate({room_name:room},updatePayload, {new:true},function (updateError,updateResult) {
                if(updateError){
                 
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
        
        console.log('CHECK ROOMS',{"messages.user_id" :userId, "messages.friend_user_id": friendUserId });
        if(checkRoom ){
            return res.send({status:true,data:checkRoom})
        }else{
            return res.send({status:false,data:{room_name:room}})
        }


               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.getFriendsMessages = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
 
   
        
        let getAllFriendsMessages = await ChatRoomSchema.find({ $or:[{"messages.user_id" :userId},{"messages.friend_user_id": userId}]})

    

    let getCleanMessages = [];


    Promise.all(getAllFriendsMessages.map(async (friendMessages,index)=>{
            let getLastMessageCount = friendMessages.messages.length-1;

            let lastMessage = friendMessages.messages[getLastMessageCount];
      
            if(lastMessage.user_id == userId){


                let getReceiverInfo = await UsersSchema.findOne({_id:lastMessage.friend_user_id });

                getCleanMessages.push({
                    userId:lastMessage.friend_user_id,
                    name: `${getReceiverInfo.first_name} ${getReceiverInfo.middle_name ? getReceiverInfo.middle_name : ''} ${getReceiverInfo.last_name}`,
                    profileImage: getReceiverInfo.profile_image,
                    lastMessage:lastMessage.text,
                    room:friendMessages.room_name
                });
            

            }else{

                let getReceiverInfo = await UsersSchema.findOne({_id:lastMessage.user_id });
            
                getCleanMessages.push({
                    userId:lastMessage.user_id,
                    name: `${getReceiverInfo.first_name} ${getReceiverInfo.middle_name ? getReceiverInfo.middle_name : '' } ${getReceiverInfo.last_name}`,
                    profileImage: getReceiverInfo.profile_image,
                    lastMessage:lastMessage.text,
                    room:friendMessages.room_name
                });

            }

            return friendMessages;
        })).then(()=>{
      

            if(getAllFriendsMessages ){
    
                return res.send({status:true,data:getCleanMessages})
            }else{
                return res.send({status:false})
            }
        })
      
     


               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}





methods.searchFriend = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
        let searchValue = req.body.searchValue;

     
        let tempGetAllMyFriends = await FriendSchema.find({user_id:userId});
        
        let cleanAllFriendRequests = tempGetAllMyFriends.map((item)=>item.friend_user_id);
        
        let getAllMyFriends = await UsersSchema.find({_id:{ $in: cleanAllFriendRequests } });

        
        if(getAllMyFriends.length != 0 ){
            
            
            getAllMyFriends.map((friend,index)=>{
                friend.picture =friend.profile_image ? friend.profile_image : 'default-profile.png'; 
           })

           let searchedFriends = getAllMyFriends.filter((itemFiltered)=>{
                let fullName = `${itemFiltered.first_name} ${itemFiltered.last_name}`;
             
                return fullName.toLowerCase().includes(searchValue.toLowerCase());

           })
           

            return res.send({
                status:true,
                message:'Successfully got all friends.',
                data:searchedFriends
            }) 
            
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


module.exports = methods;
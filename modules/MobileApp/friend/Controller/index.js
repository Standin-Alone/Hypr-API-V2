// MARKET CONTROLLER

const { method, get } = require("lodash");



const methods = {};




methods.getAllFriendsSuggestion = async (req,res)=>{

    try{
        // initialize body        
        
        let sender_user_id = req.body.userId;

     
        let getAllFriendRequestSent = await FriendRequestSchema.find({
            $and: [
                { $or: [{sender_user_id:sender_user_id}] },
                { $or: [{sender_user_id:sender_user_id,date_declined:null}]  }
            ]
            });
        
        let cleanAllFriendRequestSent = getAllFriendRequestSent.map((item)=>item.receiver_user_id);
    
        let getAllFriendsSuggestion = await UsersSchema.find({_id:{ $nin: cleanAllFriendRequestSent } });

        
        if(getAllFriendsSuggestion.length != 0 ){
            getAllFriendsSuggestion.map((friend,index)=>{
               
                friend.picture = friend.profile_image ? friend.profile_image : 'default-profile.png'; 
           })
           console.warn(getAllFriendsSuggestion);
            return res.send({
                status:true,
                message:'Successfully got all friends suggestion.',
                data:getAllFriendsSuggestion
            }) 
            
        }else{
            return res.send({
                status:false,
                message:'Failed to get all friends suggestion.',                
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.getAllFriendRequests = async (req,res)=>{

    try{
        // initialize body        
        
        let receiver_user_id = req.body.userId;

     
        let getAllFriendRequestsSent = await FriendRequestSchema.find({receiver_user_id:receiver_user_id, date_accepted:null, date_declined:null  });
        
        let cleanAllFriendRequests = getAllFriendRequestsSent.map((item)=>item.sender_user_id);
        
        let getAllFriendRequests = await UsersSchema.find({_id:{ $in: cleanAllFriendRequests } });

        
        if(getAllFriendRequests.length != 0 ){
            
            getAllFriendRequests.map((friend,index)=>{
                friend.picture =friend.profile_image ? friend.profile_image : 'default-profile.png'; 
           })
           
            return res.send({
                status:true,
                message:'Successfully got all friends requests.',
                data:getAllFriendRequests
            }) 
            
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.sendFriendRequest = async (req,res)=>{

    try{
        // initialize body        
        
        let sender_user_id = req.body.userId;
        let receiver_user_id = req.body.receiver_user_id;

        

        let payload = {
            sender_user_id:sender_user_id,
            receiver_user_id:receiver_user_id,
        }
  
        let checkFriendRequest = await FriendRequestSchema.find({sender_user_id:sender_user_id,receiver_user_id:receiver_user_id});

        if(checkFriendRequest.length == 0 ){        
            FriendRequestSchema.create(payload, (friendRequestError, insertFriendRequestResult) => {                    
                if(friendRequestError){
                    // error on insert
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:friendRequestError
                    })

                }else{
                    return  res.send({
                        status:true,
                        message:'Successfully sent friend request.',                                                    
                    })
                }
            });
        }else{
            checkFriendRequest.map((item)=>{
                if(item.date_declined){

                    let updatePayload = {
                        $set:{
                            date_declined:null
                        }
                    }
                    FriendRequestSchema.findByIdAndUpdate(item._id,updatePayload ,(friendRequestError, insertFriendRequestResult) => {                    
                        if(friendRequestError){
                            // error on insert
                            return res.send({
                                status:false,
                                message:'Something went wrong',
                                error:friendRequestError
                            })
        
                        }else{
                            return  res.send({
                                status:true,
                                message:'Successfully sent friend request.',                                                    
                            })
                        }
                    });
                }else{
                    return  res.send({
                        status:false,
                        message:'Already sent friend request.',                                                    
                    })
                }

            })
           
        }        
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.acceptFriendRequest = async (req,res)=>{

    try{
        // initialize body        
        
        let receiver_user_id = req.body.receiver_user_id;
        let sender_user_id = req.body.sender_user_id;

        

   
        let checkFriendRequest = await FriendRequestSchema.find({sender_user_id:sender_user_id,receiver_user_id:receiver_user_id});

        if(checkFriendRequest.length > 0 ){        

            let updateCondition = {
                $set:{
                    date_accepted: new Date()
                }
            };


            FriendRequestSchema.findOneAndUpdate({sender_user_id:sender_user_id,receiver_user_id:receiver_user_id},updateCondition ,{new:true},(acceptFriendRequestError, acceptFriendRequestResult) => {                                                    
                if(acceptFriendRequestError){
                    // error on insert
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:acceptFriendRequestError
                    })

                }else{
                    return  res.send({
                        status:true,
                        message:'Successfully accepted friend request.',   
                                     
                    })
                }
            });




            let senderPayload = {
                user_id:receiver_user_id,
                friend_user_id:sender_user_id,
            }

            let receiverPayload = {
                user_id:sender_user_id,
                friend_user_id:receiver_user_id,
            }
      
            // add friend user id to friend table
            FriendSchema.create(senderPayload, (friendRequestError, insertFriendRequestResult) => {                    
                if(friendRequestError){
                    // error on insert
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:friendRequestError
                    })

                }else{
                    FriendSchema.create(receiverPayload, (friendRequestError, insertFriendRequestResult) => {                    
                        if(friendRequestError){
                            // error on insert
                            return res.send({
                                status:false,
                                message:'Something went wrong',
                                error:friendRequestError
                            })
        
                        }else{
                           
                        }
                    });
                }
            });
        }else{
            return  res.send({
                status:true,
                message:'Already sent friend request.',                                                    
            })
        }        
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.declineFriendRequest = async (req,res)=>{

    try{
        // initialize body        
        
        let receiver_user_id = req.body.receiver_user_id;
        let sender_user_id = req.body.sender_user_id;

        

   
        let checkFriendRequest = await FriendRequestSchema.find({sender_user_id:sender_user_id,receiver_user_id:receiver_user_id});

        if(checkFriendRequest.length > 0 ){        

            let updateCondition = {
                $set:{
                    date_declined: new Date()
                }
            };

            // decline friend request
            FriendRequestSchema.findOneAndUpdate({sender_user_id:sender_user_id,receiver_user_id:receiver_user_id},updateCondition ,(declineFriendRequestError, declineFriendRequestResult) => {                                                    
                if(declineFriendRequestError){
                    // error on insert
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:acceptFriendRequestError
                    })

                }else{
                    return  res.send({
                        status:true,
                        message:'Successfully declined friend request.',                                                    
                    })
                }
            });




         
        }else{
            return  res.send({
                status:false,
                message:'Already sent friend request.',                                                    
            })
        }        
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}

module.exports = methods;
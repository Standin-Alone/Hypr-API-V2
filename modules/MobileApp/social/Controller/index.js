// MARKET CONTROLLER

const { post } = require("@forkjs/group-router");
const { method, get } = require("lodash");



const methods = {};




methods.getAllFriendsPost = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;

        let getAllFriends = await FriendSchema.find({user_id:userId});
        let cleanGetAllFriends = getAllFriends.map((item)=>item.friend_user_id);
  


        cleanGetAllFriends.push(userId);
        
        let getAllFriendsPost = await SocialPostSchema.find({user_id : {$in:cleanGetAllFriends}}).sort({date_created: -1});
   
        if(getAllFriendsPost.length > 0 ){

            // GET ALL FRIENDS POST
            let getPost = getAllFriendsPost.map( async (posts,index)=>{
          
                 posts.user_picture = posts.user_picture ? posts.user_picture : 'default-profile.png'; 
                 posts.filenames = posts.post_images;
                 let commentPromise = Promise.all( posts.post_comment.map(async (item)=>{
                    let getUserInfo =   await UsersSchema.findById(item.user_id).exec();
                    
                    if(getUserInfo){
                
                        item.profile_image = getUserInfo.profile_image;
                    }
                    return item;
                 }))        

              
                 posts.post_comment = await commentPromise;


                 return posts;
            })

          
            
            return res.send({
                status:true,
                message:'Successfully got all post.',
                data:await Promise.all(getPost)
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



methods.getReferral = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.params.id;
        
        let checkUserId = await UsersSchema.findById(userId);



        return res.render('./templates/referral.ejs',{userId:userId});        
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.useReferral = async (req,res)=>{

    try{
        // initialize body        
        
              
             
        


        // INITIALIZE BODY
       
        let first_name           = req.body.first_name;
        let last_name            = req.body.last_name;
        let email                = req.body.email;
        let phone                = req.body.contact_number.replace(/ /g,'');
        let birthday             = req.body.birthday;
        let age                  = req.body.age;
        let country              = req.body.country;
        let country_name         = req.body.country_name;
        let address              = req.body.address;                        
        let username             = req.body.username;
        let password             = req.body.password;        
        let encrypt_password     = await bcrypt.hash(password,8);
        // let referral_code        = req.body.referral_code;
        let referral_user_id     = req.body.referral_user_id;
        let referred_by_name     = '';
        let user_refferal_code   = '';




        // PAYLOAD 
        let payload = {
            first_name:first_name,
            last_name:last_name,
            email:email,
            phone:phone,
            birthday:birthday,
            age:age,
            country:country,
            country_name:country_name,
            address:address,
            username:username,
            password:encrypt_password,
            referral_user_id:referral_user_id,
            referred_by_name:referred_by_name,
            user_refferal_code:user_refferal_code,
            profile_image:'default-profile.png',
            cover_pic:'default-profile.png'

        }

        let checkUserIfExists = await UsersSchema.findOne({ email: email });
        // let checkIfRefferalCodeExists = await UsersSchema.findOne({ referral_code: referral_code });
        


        if(checkUserIfExists){

            return res.send({
                status:false,
                message:'Your Email already exists.',                
            })

        }else{             
            
            await UsersSchema.create(payload, (userError, insertUserResult) => {                    
                if(userError){
                    // error create
                    return  res.send({
                        status:false,
                        message:'Something went wrong.',    
                        error:userError         
                    })
                }else if(insertUserResult){

                    // success create
                    // success create
                    let referralLink   = `${process.env.DEV_URL}/hypr-mobile/social/referral/${insertUserResult._id}`;
                    let getReferralUser = UsersSchema.findById();
                    let setReferralLink = {
                        $set:{referral_link : referralLink}
                    }

                    UsersSchema.findByIdAndUpdate(insertUserResult._id,setReferralLink, {new:true},function (updateError,updateResult) {
                        if(updateError){
                            console.warn(updateError)
                            // error on update
                            return res.send({
                                status:false,
                                message:'Something went wrong',
                                error:updateError
                            })
                
                        }else{                        
        
                            // return  res.send({
                            //     status:true,
                            //     message:'Sucessfully created your account. Please check your email to  verify your account.',                            
                            //     link:`${process.env.DEV_URL}/hypr-mobile/social/successful/created-account`,
                            //     data:updateResult
                            // })
                            let verficationLink = `${process.env.DEV_URL}/hypr-mobile/user/verifyAccount/${insertUserResult._id}`;
                            let fullName =  `${first_name} ${last_name}`;            
        
                            // email payload
                            let emailPayload = {
                                                name:fullName,
                                                toemail:email,                                        
                                                url:verficationLink
                                             };
        
                            // SEND VERIFICATION EMAIL
                            ejs.renderFile('./views/templates/accountVerificationEmail.ejs',emailPayload,function(err,data){                                                   
                                // co
                                // ready for email otp
                                var mailOptions = {
                                    from: "Hypr", // sender address
                                    to: email,                                        
                                    subject: 'Hypr Verification  Email',
                                    html:      data,
                                    attachments: [{
                                        filename: 'otp.jpeg',
                                        path: `${process.env.DEV_URL}/images/otp.jpeg`,
                                        cid: 'otp' //same cid value as in the html img src
                                    },{
                                        filename: 'hypr-logo.png',
                                        path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                                        cid: 'logo' //same cid value as in the html img src
                                    }]
                                }
                                transporter.sendMail(mailOptions, function (mailError, info) {
                                    if (mailError) {
                                        console.log('Error: ' + mailError);
                                        console.warn('Email not sent');
                                        return  res.json({
                                            status: false,
                                            msg: 'Email not sent',
                                            code: 'E110'
                                        });
                                    } else {
                                       // success create
                                       return  res.send({
                                            status:true,                                            
                                            message:'Sucessfully created your account. Please check your email to  verify your account.',                            
                                            link:`${process.env.DEV_URL}/hypr-mobile/social/successful/created-account`,
                                            data:updateResult
                                        })
                                    }
                                });
                             });       
                            
                        }
                    
                    });
    

                   
                    
                              
                        }
                    });          
                }
    }catch(error){
        // CATCH ERROR 
        console.warn(error)
        return  res.send({
            status:false,
            message:'Something went wrong',
            error:JSON.stringify(error)
        })
    }


  

}

methods.successfullCreatedAccount = (req,res)=>{
    return  res.render('./templates/createdAccount.ejs');
}



methods.createPost = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.body.userId;
        let  file  = req.body.file ;
        let  caption  = req.body.caption ;
  
        let countErrorUploads = 0 ;
        console.warn(file);

        // upload image
        file.map((fileResponse)=>{
            let fileBuffer =  Buffer.from(fileResponse.fileBase64, 'base64');
            console.warn(fileResponse)
            fs.writeFile(`./uploads/posts/${fileResponse.fileName}`, fileBuffer , function (err) {  
                if(err){
                    countErrorUploads++
                }                
            });    
        })
      
        

   


        if(countErrorUploads == 0 ){


        
            let checkUserId = await UsersSchema.findById(userId);
            
            let fileNames = file.map((content)=>content.fileName);
            if(checkUserId){
                
                let payload = {
                    post_images:fileNames,
                    user_id:userId,
                    caption:caption,
                    user_picture:checkUserId.profile_image,
                    full_name: `${checkUserId.first_name} ${checkUserId.last_name}`

                }
                SocialPostSchema.create(payload, (socialError, insertSocialResult) => {                    
                    if(socialError){
                        // error on insert
                        return res.send({
                            status:false,
                            message:'Something went wrong',
                            error:socialError
                        })

                    }else{
                        return  res.send({
                            status:true,
                            message:'Successfully posted.',                                                    
                        })
                    }
                });

            }else{
                return res.send({
                    status:false,
                    message:'User cannot be found',                                                
                })
            }

        }else{
            return res.send({
                status:false,
                message:'Failed to post.',                                                
            })
        }
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.hypePost = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.body.userId;
        let  post = req.body.post;

        
        let checkPost = await SocialPostSchema.findById(post._id);

       
        if(checkPost){


            let checkIfAlreadyHype = checkPost.hypes.filter((item)=>item.user_id == userId);

            let updatePayload = [];
            let hypeStatus = '';
            if(checkIfAlreadyHype.length == 1){
                
                let cleanHypes = checkPost.hypes.filter((item)=>item.user_id != userId);

                updatePayload = {
                    $set:{hypes :cleanHypes}
                }

                hypeStatus = 'unHype';
                

            }else{
          
                updatePayload = {
                    $set:{hypes :[...new Set(checkPost.hypes),{user_id:userId,date_hyped:new Date()}]
                    
                    }
                }                
                hypeStatus = 'hype';
            }
           

            SocialPostSchema.findByIdAndUpdate(post._id,updatePayload, {new:true},function (updateError,updateResult) {
                if(updateError){
                    console.warn(updateError)
                    // error on update
                    return res.send({
                        status:false,        
                    })
        
                }else{        
                    
                    return  res.send({
                        status:true,   
                        hypes:updateResult.hypes,
                        hypeCount:updateResult.hypes.length + 1,          
                        hypeStatus:hypeStatus
                    })                    
                }
            
            });
        }else{

        }
                


        
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.comment = async (req,res)=>{

    try{
        // initialize body        
        
        let  postId = req.body.postId;
        let  userId = req.body.userId;
        let  comment = req.body.comment;
        let  fullName = req.body.fullName;
 
      
        let checkPost = await SocialPostSchema.findById(postId);



        updatePayload = {
            $push:{post_comment:{
                comment:comment,
                user_id:userId,
                comment_by_name:fullName,     
                date_commented: new Date()
            }}
        }



        if(checkPost ){


        

        SocialPostSchema.findByIdAndUpdate(postId,updatePayload, {new:true},async function (updateError,updateResult) {
            if(updateError){
                console.warn(updateError)
                // error on update
                return res.send({
                    status:false,        
                })
    
            }else{        
             
              

                let commentPromise = Promise.all( updateResult.post_comment.map(async (item)=>{
                    let getUserInfo =   await UsersSchema.findById(item.user_id).exec();
                    
                    if(getUserInfo){
                
                        item.profile_image = getUserInfo.profile_image;
                    }
                    return item;
                 }))    

        

                return  res.send({
                    status:true,   
                    newComment: await  commentPromise             
                })                    
            }
        
        });
                        
            
        }else{

        }
                


        
               
    }catch(error){
        console.warn(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


    
}



// GET PROFILE INFO
methods.getProfileInfo = async (req,res)=>{    
    try{
        // initialize body
        let userId = req.params.userId;
    
        console.warn(userId)
        let checkUserId = await UsersSchema.findById(userId);
        
        if(checkUserId){
            
            checkUserId.profile_image = checkUserId.profile_image;
            checkUserId.cover_pic = checkUserId.cover_pic;
            let countPosts =  await SocialPostSchema.find({user_id:userId}).countDocuments();
            let countFriends =  await FriendSchema.find({user_id:userId}).countDocuments();

   
            
            checkUserId.total_posts = countPosts;
            checkUserId.total_friends = countFriends;
       
            return res.send({
                status:true,
                message:'User info has been found.',                    
                data:checkUserId
            })
        
        }else{
            return res.send({
                status:false,
                message:'User not found.',                    
            })
        }
    }catch(error){
        console.warn(error);
        return res.send({
            status:false,
            message:'Something went wrong',
            error:error
        })
    }
}



methods.getAllFriendsStories = async (req,res)=>{


    try{
        // initialize body        
        
        let userId = req.body.userId;

        let getAllFriends = await FriendSchema.find({user_id:userId});
        let cleanGetAllFriends = getAllFriends.map((item)=>item.friend_user_id);

        console.warn(req.body)

        let getAllFriendsStories = await SocialStoriesSchema.find({ $or:[{user_id : {$in:cleanGetAllFriends,}},{user_id :userId}]}).sort({date_created: -1});
    
        if(getAllFriendsStories.length > 0 ){

            // GET ALL FRIENDS STORIES
            let getStories = Promise.all(getAllFriendsStories.map( async (stories,index)=>{
        
                 stories.user_picture = stories.user_picture ? stories.user_picture : 'default-profile.png';              
                 stories.user_image = stories.user_picture ? `${process.env.DEV_URL}//uploads/profile_pictures//${stories.user_picture}` :  `${process.env.DEV_URL}/uploads/profile_pictures/default-profile.png`  ;              
                 stories.stories = stories.files.map((file,fileIndex)=>                    
                   ({
                        story_id: fileIndex+1,
                        story_image: `${process.env.DEV_URL}//uploads//stories//${file}`,                           
                    }))
                 return stories;
            }))

          
            console.warn(await getStories );
            return res.send({
                status:true,
                message:'Successfully got all stories.',
                data:await getStories
            }) 
            
        }else{
            return res.send({
                status:false,
                message:'Failed to get all friends stories.',                
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.createStory = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.body.userId;
        let  file  = req.body.file ;
        console.warn(req.body);
  
        let countErrorUploads = 0 ;
        

        // upload image
        file.map((fileResponse)=>{
            let fileBuffer =  Buffer.from(fileResponse.fileBase64, 'base64');
            console.warn(fileResponse)
            fs.writeFile(`./uploads/stories/${fileResponse.fileName}`, fileBuffer , function (err) {  
                if(err){
                    countErrorUploads++
                }                
            });    
        })
      
        

   


        if(countErrorUploads == 0 ){


        
            let checkUserId = await UsersSchema.findById(userId);
            
            let fileNames = file.map((content)=>content.fileName);

            if(checkUserId){
                
                let payload = {
                    files:fileNames,
                    user_id:userId,
                    user_picture:checkUserId.profile_image,
                    full_name: `${checkUserId.first_name} ${checkUserId.last_name}`,
                    user_image:checkUserId.profile_image,
                    user_name: `${checkUserId.first_name} ${checkUserId.last_name}`

                }

                SocialStoriesSchema.create(payload, (socialError, insertStoryResult) => {                    
                    if(socialError){
                        // error on insert
                        return res.send({
                            status:false,
                            message:'Something went wrong',
                            error:socialError
                        })

                    }else{
                        return  res.send({
                            status:true,
                            message:'Successfully added your story.',                                                    
                        })
                    }
                });

            }else{
                return res.send({
                    status:false,
                    message:'User cannot be found',                                                
                })
            }

        }else{
            return res.send({
                status:false,
                message:'Failed to create story.',                                                
            })
        }
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}
module.exports = methods;
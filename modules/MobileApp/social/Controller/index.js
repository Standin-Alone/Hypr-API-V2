// MARKET CONTROLLER

const { post } = require("@forkjs/group-router");
const { method, get } = require("lodash");



const methods = {};

const sendOtp = (userId,res)=>{
    
    let generateOtp =   Math.random().toFixed(4).substr(`-4`);
    // initialize update options
    let updateOptions = {
        otp: generateOtp
    }

    let email = '';
    // UPDATE TABLE
    UsersSchema.findByIdAndUpdate(userId.toString(),updateOptions,(updateError, updateResult)=>{
        if(updateError){
            console.warn(updateError);
            // error on update
            return  res.send({
                status:false,
                message:'Something went wrong',
                error:updateError
            })

        }else{                  
            
            let otpEmailPayload = {
                name:`${updateResult.first_name} ${updateResult.last_name}`,
                toEmail:updateResult.email,
                otp:generateOtp
            }

         
            // UNCOMMENT WHEN THE NODEMAILER IS FIX
            // ejs.renderFile('./views/templates/otpEmail.ejs',otpEmailPayload,function(err,data){
            //     let mailOptions = {
            //                         from: "Hypr", // sender address
            //                         to: otpEmailPayload.toEmail,                                        
            //                         subject: 'Hypr One Time Password',
            //                         html:      data,
            //                         attachments: [{
            //                         filename: 'otp.jpeg',
            //                         path: `${process.env.DEV_URL}/images/otp.jpeg`,
            //                         cid: 'otp' //same cid value as in the html img src
            //                     },{
            //                         filename: 'hypr-logo.png',
            //                         path: `${process.env.DEV_URL}/images/hypr-logo.png`,
            //                         cid: 'logo' //same cid value as in the html img src
            //                     }]
            //                     }
            //     transporter.sendMail(mailOptions, function (error, info) {
            //         if (error) {       
            //             console.warn(error);
            //             return  res.send({
            //                 status:false,
            //                 message:'Error sent.',                
            //             })
            //         } else {
                    
            //             return  res.send({
            //                 status:true,
            //                 message:'Successfully send OTP to your email.',     
            //                 userId:userId.toString(),
            //                 email:otpEmailPayload.toEmail  
            //             })
                        
            //         }            
            //       });
            // });
            
                 return  res.send({
                            status:true,
                            message:'Successfully signed in. You are now part of Hypr Family.',     
                            userId:userId.toString(),
                            email:otpEmailPayload.toEmail ,
                            _id:userId
                        })
        }
    });
}





methods.getAllFriendsPost = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
        let currentPage = req.body.currentPage;

        let getAllFriends = await FriendSchema.find({user_id:userId});
        let cleanGetAllFriends = getAllFriends.map((item)=>item.friend_user_id);
  


        cleanGetAllFriends.push(userId);
        
        let getAllFriendsPost = await SocialPostSchema.find({user_id : {$in:cleanGetAllFriends}}).limit(2).skip(currentPage).sort({date_created: -1});
   
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




methods.getAllMyPost = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;

     
  

        
        let getAllMyPost = await SocialPostSchema.find({user_id :userId}).sort({date_created: -1});
   
        if(getAllMyPost.length > 0 ){

            // GET ALL FRIENDS POST
            let getPost = getAllMyPost.map( async (posts,index)=>{
          
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
                message:'Successfully got all my  post.',
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

   

        return res.render('./templates/referral.ejs',{userId:userId,signInLink:req.protocol + '://' + req.get('Host') + `/hypr-mobile/social/referral-sign-in/${userId}`});        
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.getReferralSignIn = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.params.id;
        
        let checkUserId = await UsersSchema.findById(userId);

     

        return res.render('./templates/referralLogin.ejs',{userId:userId,signUpLink:req.protocol + '://' + req.get('Host') + `/hypr-mobile/social/referral/${userId}`});        
               
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.useReferral = async (req,res)=>{

    try{
        // initialize body        
        
              
             
        


        // INITIALIZE BODY
        let referralType   = req.body.referralType;



        // USE REFERRAL SIGNIN
        if(referralType == 'sign-in'){
             // initialize body
                let username = req.body.username;
                let password = req.body.password;

                
                let checkUserIfExists = await UsersSchema.findOne({$or:[{email:username},{username: username}]});
                
                if(checkUserIfExists){

                    let decryptPassword = await bcrypt.compare(password, checkUserIfExists.password);
                    
                    if(checkUserIfExists.verified_date){                
                        if(decryptPassword){

                            sendOtp(checkUserIfExists._id,res);

                        
                        }else{
                            res.send({
                                status:false,
                                message:'Incorrect email or password.',                
                            })
                        }
                    }else{

                        let verficationLink = `${process.env.DEV_URL}/hypr-mobile/user/verifyAccount/${checkUserIfExists._id}`;
                        let fullName =  `${checkUserIfExists.first_name} ${checkUserIfExists.last_name}`;            

                        // email payload
                        let emailPayload = {
                                            name:fullName,
                                            toemail:checkUserIfExists.email,                                        
                                            url:verficationLink
                                        };
                        
                        // SEND VERIFICATION EMAIL
                        ejs.renderFile('./views/templates/accountVerificationEmail.ejs',emailPayload,function(err,data){                                                   
                            // co
                            // ready for email otp
                            var mailOptions = {
                                from: "Hypr", // sender address
                                to: checkUserIfExists.email,                                        
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
                                    res.json({
                                        status: false,
                                        msg: 'Email not sent',
                                        code: 'E110'
                                    });
                                } else {
                                // success create
                                res.send({
                                    status:false,
                                    message:'Please check your email to verify your account.',                
                                    })    
                                }
                            });
                        });      

                      

                    
                    } 
                }else{
                    res.send({
                        status:false,
                        message:'Username or email not found.',                
                    })
                }
        }else{

        // USE REFERRAL SIGNUP
        
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

        console.warn(req.body.productLink);
        // initialize body     
        let userId = req.body.userId; 
        let caption = req.body.caption;
        let rawProductLink = req.body.productLink;
        let  files = req.files;  
        
        console.warn(`RAW PRODUCT LINK`,rawProductLink)

        let productLink = JSON.parse(rawProductLink);
       
        console.warn(`PRODUCT LINK`,productLink)

        let uploads =  files ? Object.values(files) : [];

        let fileNames = uploads.map(function(file) {
            if(file.length > 1){
                return file.map((fileResponse)=>fileResponse?.name);
            }else{
                return file?.name
            }                       
        })[0];      
       
        let countErrorUploads = 0 ;       
        if(uploads.length > 0){
            uploads.map(item=>{
                if(item.length > 1){
                    item.map((responseFile)=>{

                     
                        responseFile.mv(`./uploads/posts/${responseFile.name}`,(err)=>{
                            if(err){
                                countErrorUploads++;
                                return  res.send({
                                    status:true,
                                    message:'Failed to upload.',                                                    
                                })
                            }
                        });
                    
                    })    
                }else{
                    item.mv(`./uploads/posts/${item.name}`,(err)=>{
                        if(err){
                            countErrorUploads++;
                            return  res.send({
                                status:true,
                                message:'Failed to upload.',                                                    
                            })
                        }
                    });        
                }       
            })
        }

        
        if(countErrorUploads == 0 ){
            let checkUserId = await UsersSchema.findById(userId);
     
            if(checkUserId){
           
                let payload = {
                    post_images:fileNames,
                    user_id:userId,
                    caption:caption,
                    product_link:productLink,
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
        console.warn(error);
        return res.send({
            status:false,
            message:error,                                                
        })   
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



        let getAllFriendsStories = await SocialStoriesSchema.find({ $or:[{user_id : {$in:cleanGetAllFriends,}},{user_id :userId}]}).sort({date_created: -1});
    
        if(getAllFriendsStories.length > 0 ){
            // check if story is already one day
            getAllFriendsStories.map(stories=>{                

                let prevStoriesFile = stories.files;
                let dateToday = new Date();
                prevStoriesFile.map(prevStory =>{
                    console.warn(moment(prevStory.date_created).isAfter(dateToday, 'day'));
                    if(moment(dateToday ).isAfter(prevStory.date_created, 'day')){
                        prevStory.status = 0 ;
                    }else{
                        prevStory.status = 1;
                    }

                    return prevStory;

                });
                
                let updateSocialStory = {
                    $set:{
                        files:prevStoriesFile
                    }
                }


                SocialStoriesSchema.findOneAndUpdate({_id:stories._id},updateSocialStory,function(errorUpdate,storyUpdateResult){
                    if(errorUpdate){
                        console.log(errorUpdate)
                    }else{
                        
                    }
                });
                
            });

            // GET ALL FRIENDS STORIES
            let getStories = Promise.all(getAllFriendsStories.map( async (stories,index)=>{
        
                 stories.user_picture = stories.user_picture ? stories.user_picture : 'default-profile.png';              
                 stories.user_image = stories.user_picture ? `${process.env.DEV_URL}//uploads/profile_pictures//${stories.user_picture}` :  `${process.env.DEV_URL}/uploads/profile_pictures/default-profile.png`  ;              
                 stories.stories = stories.files.map((file,fileIndex)=>                    
                   ({
                        story_id: fileIndex+1,
                        story_image: file.hasOwnProperty('variantInfo') ? file.file_name : `${process.env.DEV_URL}//uploads//stories//${file.file_name}`,                  
                        date_created: file.date_created,
                        status:file.status
                    })).filter((storyFilter)=>storyFilter.status == 1)
                 return stories;
            }))

          
         
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
  
  
        let countErrorUploads = 0 ;
        

        // upload image
        file.map((fileResponse)=>{
            let fileBuffer =  Buffer.from(fileResponse.fileBase64, 'base64');
            console.warn(`filerespoinse`,fileResponse.fileName)
            fs.writeFile(`./uploads/stories/${fileResponse.fileName}`, fileBuffer , function (err) {  
                if(err){
                    countErrorUploads++
                }                
            });    
        })
      
        

   


        if(countErrorUploads == 0 ){


        
            let checkUserId = await UsersSchema.findById(userId);
            
            let fileNames = file.map((content)=>({file_name:content.fileName,date_created:  new Date,status:1}));

            if(checkUserId){
                
                let payload = {
                    files:fileNames,
                    user_id:userId,
                    user_picture:checkUserId.profile_image,
                    full_name: `${checkUserId.first_name} ${checkUserId.last_name}`,
                    user_image:checkUserId.profile_image,
                    user_name: `${checkUserId.first_name} ${checkUserId.last_name}`

                }   


                let checkIfUserHasAlreadyStory = await SocialStoriesSchema.find({user_id:userId});
                console.warn(`filenames`,file)

                
                if(checkIfUserHasAlreadyStory.length > 0){
                    let updatePayload = {
                        $set:{
                                files:[...checkIfUserHasAlreadyStory[0].files,...fileNames]
                            }
                    };
                    
                    SocialStoriesSchema.findOneAndUpdate({user_id:userId},updatePayload, {new:true},async function (updateError,updateResult) {
                        if(updateError){
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
                }
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




methods.boost = async (req,res)=>{

    try{
        // initialize body        
        
        
        let  userId = req.body.userId;
        let  variant = req.body.variant;  
        
        
        
        let countErrorUploads = 0 ;
           

   


        if(countErrorUploads == 0 ){


        
            let checkUserId = await UsersSchema.findById(userId);
            let variantData = {file_name:variant.variantImage,date_created:  new Date,status:1,variantInfo:variant};

            if(checkUserId){
                
                let payload = {
                    files:variantData,
                    user_id:userId,
                    user_picture:checkUserId.profile_image,
                    full_name: `${checkUserId.first_name} ${checkUserId.last_name}`,
                    user_image:checkUserId.profile_image,
                    user_name: `${checkUserId.first_name} ${checkUserId.last_name}`

                }   


                let checkIfUserHasAlreadyStory = await SocialStoriesSchema.find({user_id:userId});
          

                
                if(checkIfUserHasAlreadyStory.length > 0){
                    let updatePayload = {
                        $set:{
                                files:[...checkIfUserHasAlreadyStory[0].files,variantData]
                            }
                    };
                    
                    SocialStoriesSchema.findOneAndUpdate({user_id:userId},updatePayload, {new:true},async function (updateError,updateResult) {
                        if(updateError){
                            // error on insert
                            return res.send({
                                status:false,
                                message:'Something went wrong',
                                error:socialError
                            })

                        }else{
                            return  res.send({
                                status:true,
                                message:'Successfully boosted.',                                                    
                            })
                        }
                    });
            
                }else{
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
                                message:'Successfully boosted.',                                                    
                            })
                        }
                    });
                }
            }else{
                return res.send({
                    status:false,
                    message:'User cannot be found',                                                
                })
            }

        }else{
            return res.send({
                status:false,
                message:'Failed to boost.',                                                
            })
        }
              
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }
}
module.exports = methods;
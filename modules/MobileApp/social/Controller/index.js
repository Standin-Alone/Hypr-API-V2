// MARKET CONTROLLER

const { method, get } = require("lodash");



const methods = {};




methods.getAllFriendsPost = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;

        let getAllFriendsPost = await SocialPostSchema.find({user_id : {$in:['629c76daba51ae90e4fa2728',userId]}});
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

                    UsersSchema.findByIdAndUpdate(insertUserResult._id,setReferralLink, function (updateError,updateResult) {
                        if(updateError){
                            console.warn(updateError)
                            // error on update
                            return res.send({
                                status:false,
                                message:'Something went wrong',
                                error:updateError
                            })
                
                        }else{                        
        
                            return  res.send({
                                status:true,
                                message:'Sucessfully created your account. Please check your email to  verify your account.',                            
                                link:`${process.env.DEV_URL}/hypr-mobile/social/successful/created-account`
                            })

                            
                        }
                    
                    });
    

                    // let verficationLink = `${process.env.DEV_URL}/hypr-mobile/user/verifyAccount/${insertUserResult._id}`;
                    // let fullName =  `${first_name} ${last_name}`;            

                    // // email payload
                    // let emailPayload = {
                    //                     name:fullName,
                    //                     toemail:email,                                        
                    //                     url:verficationLink
                    //                  };

                    // SEND VERIFICATION EMAIL
                    // ejs.renderFile('./views/templates/accountVerificationEmail.ejs',emailPayload,function(err,data){                                                   
                    //     // co
                    //     // ready for email otp
                    //     var mailOptions = {
                    //         from: "Hypr", // sender address
                    //         to: email,                                        
                    //         subject: 'Hypr Verification  Email',
                    //         html:      data,
                    //         attachments: [{
                    //             filename: 'otp.jpeg',
                    //             path: `${process.env.DEV_URL}/images/otp.jpeg`,
                    //             cid: 'otp' //same cid value as in the html img src
                    //         },{
                    //             filename: 'hypr-logo.png',
                    //             path: `${process.env.DEV_URL}/images/hypr-logo.png`,
                    //             cid: 'logo' //same cid value as in the html img src
                    //         }]
                    //     }
                    //     transporter.sendMail(mailOptions, function (mailError, info) {
                    //         if (mailError) {
                    //             console.log('Error: ' + mailError);
                    //             console.warn('Email not sent');
                    //             return  res.json({
                    //                 status: false,
                    //                 msg: 'Email not sent',
                    //                 code: 'E110'
                    //             });
                    //         } else {
                    //            // success create
                    //            return  res.send({
                    //                 status:true,
                    //                 message:'Sucessfully created your account. Please check your email to  verify your account.',                            
                    //             })
                    //         }
                    //     });
                    //  });       
                    
                              
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
        let  image  = req.body.image ;
        let  caption  = req.body.caption ;
        
        let checkUserId = await UsersSchema.findById(userId);
        
        
        if(checkUserId){
            
            let payload = {
                post_images:[image],
                user_id:userId,
                caption:caption,
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
           

            SocialPostSchema.findByIdAndUpdate(post._id,updatePayload, function (updateError,updateResult) {
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


module.exports = methods;
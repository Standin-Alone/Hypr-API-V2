// LOGIN CONTROLLER

const e = require("express");


const methods = {};

const sendOtp = (userId,res)=>{
    
    let generateOtp =   Math.random().toFixed(4).substr(`-4`);
    // initialize update options
    let updateOptions = {
        otp: generateOtp
    }


    // UPDATE TABLE
    UsersSchema.findByIdAndUpdate(userId.toString(),updateOptions,(updateError, updateResult)=>{
        if(updateError){
            console.warn(updateError);
            // error on update
            res.send({
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

            ejs.renderFile('./views/templates/otpEmail.ejs',otpEmailPayload,function(err,data){
                let mailOptions = {
                                    from: "Hypr", // sender address
                                    to: otpEmailPayload.toEmail,                                        
                                    subject: 'Hypr One Time Password',
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
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {                    
                        res.send({
                            status:false,
                            message:'Error sent.',                
                        })
                    } else {
                    
                        res.send({
                            status:true,
                            message:'Successfully logged in.',     
                            userId:userId.toString()           
                        })
                    }            
                });
            });
            
            
        }
    });
}

// SIGN UP BUTTON
methods.getSignUp = async (req,res)=>{
    try{
        // INITIALIZE BODY
        let first_name           = req.body.first_name;
        let last_name            = req.body.last_name;
        let email                = req.body.email;
        let phone                = req.body.phone;
        let birthday             = req.body.birthday;
        let age                  = req.body.age;
        let country              = req.body.country;
        let country_name         = req.body.country_name;
        let address              = req.body.address;                        
        let username             = req.body.username;
        let password             = req.body.password;        
        let encrypt_password     = await bcrypt.hash(password,8);
        let referral_code        = req.body.referral_code;
        let referral_code_by_id  = '';
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
            referral_code:referral_code,
            referral_code_by_id:referral_code_by_id,
            referred_by_name:referred_by_name,
            user_refferal_code:user_refferal_code,
         
        }

        let checkUserIfExists = await UsersSchema.findOne({ email: email });
        let checkIfRefferalCodeExists = await UsersSchema.findOne({ referral_code: referral_code });
        


        if(checkUserIfExists){

            res.send({
                status:false,
                message:'Your Email already exists.',                
            })

        }else{             
            
            UsersSchema.create(payload, (userError, insertUserResult) => {                    
                if(userError){
                    // error create
                    res.send({
                        status:false,
                        message:'Something went wrong.',    
                        error:userError         
                    })
                }else if(insertUserResult){

                    // success create
                    console.warn(insertUserResult);

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
                                res.json({
                                    status: false,
                                    msg: 'Email not sent',
                                    code: 'E110'
                                });
                            } else {
                               // success create
                                res.send({
                                    status:true,
                                    message:'Sucessfully created your account. Please check your email to  verify your account.',                            
                                })
                            }
                        });
                     });        
                }
            });          
        }
    }catch(error){
        // CATCH ERROR 
        console.warn(error)
        res.send({
            status:false,
            message:'Something went wrong',
            error:JSON.stringify(error)
        })
    }
}


// VERIFY ACCOUNT BUTTON (accountVerificationEmail.ejs)
methods.renderVerifyAccount = async (req,res)=>{    

    try{
        // initialize body        
        let userId = req.params.userId;
        

        let checkUserId = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUserId){

            
            // check if already verified
            if(checkUserId.verified_date){    
                
                res.render('./templates/alreadyVerified.ejs');
            }else{
                
                // initialize update options
                let updateOptions = {
                    verified_date:  Date.now() 
                }

        
                // UPDATE TABLE
                UsersSchema.findByIdAndUpdate(userId,updateOptions,(updateError, updateResult)=>{
              
                    if(updateError){
                        console.warn(updateError);
                        // error on update
                        res.send({
                            status:false,
                            message:'Something went wrong',
                            error:updateError
                        })

                    }else{                   
                        // success on update
                        res.render('./templates/verified.ejs');
                    }
                })
              
            }
        }else{            
            res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }
}






// SIGN IN BUTTON
methods.getSignIn = async (req,res)=>{
    try{
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
                res.send({
                    status:false,
                    message:'Please check your email to verify your account.',                
                })    
            }
        }else{
            res.send({
                status:false,
                message:'Username or email not found.',                
            })
        }

        

       

    }catch(error){
        console.log(error);
        res.send({
            status:false,
            message:'Something went wrong',
            error:error
        })
    }
}






// VERIFY OTP BUTTON
methods.getVeriyfyOtp = async (req,res)=>{    
    try{
        // initialize body
        let userId = req.body.userId;
        let otp = req.body.otp;
        
        let checkUserId = await UsersSchema.findById(userId);

        if(checkUserId){
            
            if(checkUserId.otp == otp){
                console.warn(otp)
                res.send({
                    status:true,
                    message:'Your otp is correct.',                    
                })

            }else{
                // error 
                res.send({
                    status:false,
                    message:'Incorrect OTP.',                    
                })
            }

        }else{
            res.send({
                status:false,
                message:'User not found.',                    
            })
        }
    }catch(error){
        res.send({
            status:false,
            message:'Something went wrong',
            error:error
        })
    }
}







module.exports = methods;
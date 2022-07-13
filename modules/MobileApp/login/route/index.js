

//  LOGIN ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/user',()=>{

    route.post('/sign-up',controller.getSignUp);    
    route.post('/sign-up-using-google',controller.getSignUpUsingGoogle);    
    route.get('/verifyAccount/:userId',controller.renderVerifyAccount);
    route.post('/sign-in',controller.getSignIn);    
    route.post('/resend-otp',controller.resendOtp)
    route.post('/verify-otp',controller.getVeriyfyOtp);
    route.post('/get-user-info',controller.getUserInfo);
    route.post('/change-profile-picture',controller.changeProfilePicture);

})


module.exports = route.router;
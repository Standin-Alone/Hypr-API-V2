

//  LOGIN ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/user',()=>{

    route.post('/sign-up',controller.getSignUp);    
    route.get('/verifyAccount/:userId',controller.renderVerifyAccount);
    route.post('/sign-in',controller.getSignIn);    
    route.post('/verify-otp',controller.getVeriyfyOtp);

})


module.exports = route.router;
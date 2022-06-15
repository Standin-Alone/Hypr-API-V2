

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/social',()=>{    
    route.post('/get-all-friends-post',controller.getAllFriendsPost)    
    route.get('/referral/:id',controller.getReferral)        
    route.post('/use-referral',controller.useReferral)    
})


module.exports = route.router;


//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/friend',()=>{    
    route.post('/get-all-friends-suggestion',controller.getAllFriendsSuggestion)   
    route.post('/get-all-friends-requests',controller.getAllFriendRequests)   
    route.post('/send-friend-request',controller.sendFriendRequest)    
    route.post('/accept-friend-request',controller.acceptFriendRequest)    
    route.post('/decline-friend-request',controller.declineFriendRequest)    
})


module.exports = route.router;
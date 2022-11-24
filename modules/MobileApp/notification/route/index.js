

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/notification',()=>{    
    route.post('/get-notifications',controller.getNotifications)   

})


module.exports = route.router;


//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/tracking',()=>{    
    route.post('/get-to-verify-orders',controller.getToVerifyOrders)    
})


module.exports = route.router;
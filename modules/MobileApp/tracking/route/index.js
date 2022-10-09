

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/tracking',()=>{    
    route.post('/update-tracking',controller.updateTracking)    
    route.post('/get-to-verify-orders',controller.getToVerifyOrders)    
    route.post('/get-to-review-orders',controller.getToReviewOrders)    
    route.post('/get-ordered-products',controller.getOrderedProducts)  
    route.post('/order-received',controller.orderReceived)     
})


module.exports = route.router;
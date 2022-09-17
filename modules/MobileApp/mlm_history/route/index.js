

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/mlm',()=>{    
    route.post('/reward-history',controller.rewardHistory)   
 
})


module.exports = route.router;
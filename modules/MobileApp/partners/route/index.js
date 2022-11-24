

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/partners',()=>{    
    route.get('/get-partners',controller.getPartners)    
 
})


module.exports = route.router;
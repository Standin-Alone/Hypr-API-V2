

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/order',()=>{

    route.post('/order',controller.getOrder)

})


module.exports = route.router;
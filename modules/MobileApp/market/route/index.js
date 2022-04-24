

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/market',()=>{

    route.post('/add-to-cart',controller.addToCart);
        

})


module.exports = route.router;
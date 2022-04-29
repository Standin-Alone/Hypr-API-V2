

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/market',()=>{

    route.post('/get-shipping-address',controller.getShippingAddress)
    route.get('/get-cities/:countryCode',controller.getCities)
    route.post('/save-address',controller.saveAddress)

})


module.exports = route.router;
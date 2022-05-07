

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// paypal success web view
route.get('/success',controller.paypalSuccess)


// GROUP ROUTE
route.group('/hypr-mobile/payment',()=>{    
    route.get('/pay-with-paypal/:payload',controller.payWithPaypal)
    route.post('/final-success-payment',controller.finalSuccessPayment)
})


module.exports = route.router;
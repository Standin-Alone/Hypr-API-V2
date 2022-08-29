

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// paypal success web view
route.get('/success',controller.paypalSuccess)
route.get('/successPayment',controller.renderSuccessPaymentUrl)

// GROUP ROUTE
route.group('/hypr-mobile/payment',()=>{    

    // route.get('/cancelledPayment',controller.renderCancelledPaymentUrl)


    route.post('/stripe-checkout-session/',controller.stripeCheckoutSession)

    route.get('/pay-with-paypal/:payload',controller.payWithPaypal)
    
    route.post('/pay-with-reward',controller.payWithReward)
    route.post('/final-success-payment',controller.finalSuccessPayment)
})


module.exports = route.router;
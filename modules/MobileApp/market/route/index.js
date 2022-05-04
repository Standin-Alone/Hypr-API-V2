

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/market',()=>{

    route.post('/add-to-wishlist',controller.addToWishList)
    route.post('/add-to-cart',controller.addToCart)
    route.post('/get-shipping-address',controller.getShippingAddress)
    route.post('/get-cart',controller.getCart)
    route.post('/update-selected-address',controller.updateSelectedAddress)
    route.post('/get-wish-list',controller.getWishList)
    route.get('/get-cities/:countryCode',controller.getCities)
    route.get('/get-state/:countryName',controller.getState)
    route.post('/save-address',controller.saveAddress)
    route.post('/increase-quantity',controller.increaseQuantity)
    route.post('/decrease-quantity',controller.decreaseQuantity)

})


module.exports = route.router;
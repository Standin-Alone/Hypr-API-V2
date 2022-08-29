

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/market',()=>{

    route.post('/add-to-wishlist',controller.addToWishList)
    route.post('/remove-product-from-wishlist',controller.removeProductFromWishList)
    route.post('/add-to-cart',controller.addToCart)
    route.post('/get-shipping-address',controller.getShippingAddress)
    route.post('/get-cart',controller.getCart)
    route.post('/get-cart-count',controller.getCartCount)
    route.post('/update-selected-address',controller.updateSelectedAddress)
    route.post('/get-wish-list',controller.getWishList)
    route.get('/get-cities/:countryCode',controller.getCities)
    route.get('/get-state/:countryName',controller.getState)
    route.post('/save-address',controller.saveAddress)
    route.post('/update-address',controller.updateAddress)
    route.post('/delete-address',controller.deleteAddress)
    route.post('/increase-quantity',controller.increaseQuantity)
    route.post('/decrease-quantity',controller.decreaseQuantity)
    route.post('/remove-item-in-cart',controller.removeItemInCart)

})


module.exports = route.router;
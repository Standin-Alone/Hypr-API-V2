
var login = require('../modules/MobileApp/login/route');
var cj = require('../modules/MobileApp/cj/route');
var market = require('../modules/MobileApp/market/route');
var order = require('../modules/MobileApp/order/route');
var payment = require('../modules/MobileApp/payment/route');
var tracking = require('../modules/MobileApp/tracking/route');
var social = require('../modules/MobileApp/social/route');
var mlm = require('../modules/MobileApp/mlm/route');



module.exports = function(app){
    // MODULAR ROUTES
    app.use('',login);
    app.use('',market);
    app.use('',cj);
    app.use('',order);
    app.use('',payment);
    app.use('',tracking);
    app.use('',social);
    app.use('',mlm);

}
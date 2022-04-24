
var login = require('../modules/MobileApp/login/route');
var cj = require('../modules/MobileApp/cj/route');
var market = require('../modules/MobileApp/market/route');



module.exports = function(app){
    // MODULAR ROUTES
    app.use('',login);
    app.use('',market);
    app.use('',cj);


}
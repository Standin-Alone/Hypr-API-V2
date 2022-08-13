

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/chat',()=>{    
    route.post('/send-message',controller.sendMessage)   

})


module.exports = route.router;
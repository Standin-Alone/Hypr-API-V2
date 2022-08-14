

//  MARKET ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

// GROUP ROUTE
route.group('/hypr-mobile/chat',()=>{    
    route.post('/send-message',controller.sendMessage)   
    route.post('/check-room',controller.checkRoom)   

})


module.exports = route.router;
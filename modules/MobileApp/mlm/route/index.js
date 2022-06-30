

//  CJ ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');

route.group("/mlm/api/v1", () => {
    route.post("/mlm-disseminate-rewards", controller.insertRewards);
    route.post("/mlm-insert-team", controller.recruiteMember);
    route.post("/updator", controller.updator);
});




module.exports = route.router;
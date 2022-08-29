

//  CJ ROUTE
const route = require('@forkjs/group-router');

const controller  = require('../Controller');



const isAuth = (req, res, next) => {

    fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({email: "hyprweb@gmail.com", password: "02cf4f3d305f4312b865f8e8eed59c64"})
  })
    .then((response) => {
        if (!response.ok) {
            throw 'error on fetching token';
        }
        return response.json();
    })
    .then((response) => {
        if (!response.data.accessToken) return res.status(401).send("Access denied");

        // if (document.cookie.split(';').some((item) => item.trim().startsWith('auth='))) {
        //     res.clearCookie('auth');
        // }

        if(response.data.accessToken) {
            res.cookie('auth', response.data.accessToken);
            next();
        }   
    })
    .catch(err => {
      if(err.name === 'AbortError') {
          console.log('Timed out');
      }}
  )
};
  
//URL mapping
route.group("/cj/api/market", () => {
    route.post("/search-products", controller.searchProducts);
    route.router.use(isAuth);
    route.post("/get-token", controller.getToken);
    // products and variants

    route.get("/get-products", controller.getProducts);
    route.get("/get-variants", controller.getVariants);

    // shopping
    route.post("/create-order", controller.createOrder);
    route.get("/list-order", controller.listOrder);
    route.get("/fetch-order", controller.getOrder);
    route.post("/delete-order", controller.deleteOrder);
    route.post("/confirm-order", controller.confirmOrder);

    // logistics
    route.post("/freight-calculate", controller.FreightCalculate);
    route.get("/countries", controller.getCountryCode);
    route.get("/logistics", controller.getLogistics);
    route.get("/tracking-details", controller.trackingDetails);

    route.post("/products-sync", controller.productSync);
    route.post("/get-sync-products", controller.getSyncProducts);

});





module.exports = route.router;
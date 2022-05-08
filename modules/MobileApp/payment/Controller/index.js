// MARKET CONTROLLER

const { method } = require("lodash");



const methods = {};





methods.payWithPaypal = async (req,res)=>{

    try{
        // initialize body        


        payload = Buffer.from(req.params.payload, 'base64') ;


        let cart = JSON.parse(payload.toString()).cart;
        let userId = JSON.parse(payload.toString()).userId;
        let orderId = JSON.parse(payload.toString()).orderId;

   
   
        
        let cleanCart = [];

        cart.map((items)=>{
            cleanCart.push({
                name: items.variant_name,
                sku: items.product_code,
                price: items.product_price,
                currency: 'USD',
                quantity: items.quantity
            })
        })

        
        let cleanTotal = total_amount = cleanCart.reduce((prev, current) => prev + (current.price * current.quantity), 0).toFixed(2);


        let shippingAddress = {
            "recipient_name": cart[0].shipping_address[0].full_name,
            "line1": cart[0].shipping_address[0].address,
            "line2": "",
            "city": cart[0].shipping_address[0].city,
            "state": cart[0].shipping_address[0].state,
            "phone":  cart[0].shipping_address[0].contact,
            "postal_code": cart[0].shipping_address[0].zip_code,
            "country_code": cart[0].shipping_address[0].country_code
        };
        
        

        var createPaymentJson = {
            "intent": "order",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.DEV_URL}/success`,
                "cancel_url": `${process.env.DEV_URL}/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items":cleanCart,
                    "shipping_address":shippingAddress,
                },
                "amount": {
                    "currency": "USD",
                    "total": cleanTotal
                },
                "description": `Your order ID is ${orderId}`
            }]
        };


      

        
        paypal.payment.create(createPaymentJson, function (error, payment) {
            if (error) {
                throw error;
            } else {

              
                payment.links.map(itemLinks=>{
               
                    if(itemLinks.rel == 'approval_url'){
                        res.redirect(`${itemLinks.href}&total=${cleanTotal}`);
                    }
                   
                })
                
            }
        });

    
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}





methods.paypalSuccess = async (req,res)=>{

    try{
        // initialize body        
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const total = req.query.total;
        
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total_amount
                }
            }]
        };
        console.warn(execute_payment_json);

        // CONFIRM PAYMENT IN PAYPAL
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            
            if (error) {

                res.render('/cancelledPayment&paymentTitle=Paypal',{             
                    paymentTitle: 'Paypal',              
                })

            } else {
                


                res.render('templates/payment/successPayment', {
                    payerId: payerId,
                    paymentTitle: 'Paypal',
                    paymentId: paymentId
                })
            }
        });

    
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.finalSuccessPayment = async (req,res)=>{

    try{
        // initialize body        
        let count_error = 0; 
        let cart = req.body.cart;
        let userId = req.body.userId;
        let orderId = req.body.orderId;
        let paymentMethod = req.body.paymentMethod;        
        let payerId = req.body.payerId;
        let paymentId = req.body.paymentId;


    
        let shippingAddress = cart[0].shipping_address[0];
        let cleanTotal = total_amount = cart.reduce((prev, current) => prev + (current.product_price * current.quantity), 0).toFixed(2);

        // T_ORDER PAYLOAD
        let payload = {
            user_id:userId,
            order_number:orderId,
            paymentMode:paymentMethod,
            payment_method:paymentMethod,
            payerId:payerId,
            paymentId:paymentId,
            order_status:'For Delivery',
            payment_status:'paid',       
            billing_name:shippingAddress.full_name,
            billing_address:shippingAddress.address,
            billing_state:shippingAddress.state,
            billing_city:shippingAddress.city,
            billing_country:shippingAddress.country,
            billing_country_code:shippingAddress.country_code,
            billing_contact:shippingAddress.contact,
            billing_zip_code:shippingAddress.zip_code,
            total_amount:cleanTotal,
            currency_format:'$',
            currency:'USD',
            status:true
        }

        let checkOrderIdOrderSchema = await OrdersSchema.find({order_number:payload.order_number});
        


        if(checkOrderIdOrderSchema.length == 0){
        // CREATE ORDER 
        OrdersSchema.create(payload, async (orderError, insertOrderResult) => {                    

            if(orderError){
                
                // error on insert
                return res.send({
                    status:false,
                    message:'Something went wrong',
                    error:orderError
                })

            }else{                   
                // success on insert
                let getOrderNumber = insertOrderResult.order_number;



                let orderDetailsPayload = [];

                cart.map((items)=>{
                    orderDetailsPayload.push({
                        order_number:   getOrderNumber ,                            
                        product_id:   items.product_code ,
                        variant_id: items.variant_id,    
                        product_price:   items.product_price ,            
                        item_quantity:    items.quantity ,
                        total_amount: items.total_amount,                            
                        status:true ,
                    })
                });

          

                // CREATE ORDER DETAILS
                OrderDetailsSchema.create(orderDetailsPayload, (orderDetailsError, insertOrderDetailsResult) => {     
                    if(orderDetailsError){
                        count_error++;
                        // error on insert
                        return res.send({
                            status:false,
                            message:'Something went wrong',
                            error:orderError
                        })
        
                    }
                })
                
            }
        });

        if(count_error == 0){

            cart.map((items)=>{
                //    remove in cart
                let deleteCart ={
                    variant_id:items.variant_id,
                    buyer_id:userId,
                    shipping_address:{$elemMatch:{country_code:items.shipping_address[0].country_code}}
                    
                };
        
                CartSchema.deleteOne(deleteCart, function (err) {
                    if (err) return handleError(err);
              
                  });

            });


            

            return res.send({
                status:true,
                message:'Thank you for buying. Please wait for the delivery.'                
            })
        }else{
            return res.send({
                status:false,
                message:'Something went wrong.'                
            })
        }
    }
        
        
    

    
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }

}


module.exports = methods;
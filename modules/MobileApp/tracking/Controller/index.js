// MARKET CONTROLLER

const { method } = require("lodash");



const methods = {};




methods.getToVerifyOrders = async (req,res)=>{

    try{
        // initialize body        
        const userId = req.body.userId;
      
        let checkUserOrders = await OrdersSchema.find({user_id : userId}).sort({order_date: -1});

        if(checkUserOrders.length != 0 ){

            console.warn(checkUserOrders);
            return res.send({
                status:true,
                message:'Successfully get the to verify orders.',
                data:checkUserOrders
            })

            
        }else{
            return res.send({
                status:false,
                message:'You have no active orders.',
                data:[]
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.getOrderedProducts = async (req,res)=>{

    try{
        // initialize body        
        const orderNumber = req.body.orderNumber;
        
        let checkOrderDetails = await OrderDetailsSchema.find({order_number : orderNumber});

        if(checkOrderDetails.length != 0 ){

                         
        
                return res.send({
                    status:true,
                    message:'Successfully get my ordered products.',
                    data:checkOrderDetails
                })


 

            
        }else{
            return res.send({
                status:false,
                message:'Failed to get my ordered products.',                
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.updateTracking = async (req,res)=>{

    try{
        // initialize body        
        const userId = req.body.userId;
        const orderNumber = req.body.orderNumber;
        const tracks = req.body.tracks;
     
      
        let checkUserOrders = await OrdersSchema.find({user_id : userId,order_number:orderNumber});

        if(checkUserOrders.length > 0 ){

            let updatePayload = {
                $set:{
                    tracking:tracks
                }
            };

            OrdersSchema.findOneAndUpdate({user_id : userId,order_number:orderNumber},updatePayload,{new:true},function(error,result){

                if(error){
            
                    // error on update
                    return res.send({
                        status:false,        
                    })
        
                }else{        
                 
                    return res.send({
                        status:true,
                        message:'Successfully get the to verify orders.',
                        data:checkUserOrders
                    })             
                }

            });
        

            
        }else{
            return res.send({
                status:false,
                message:'You have no active orders.',
                data:[]
            })
        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }
}

module.exports = methods;
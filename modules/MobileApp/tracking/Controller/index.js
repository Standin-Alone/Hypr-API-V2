// MARKET CONTROLLER

const { method } = require("lodash");



const methods = {};




methods.getToVerifyOrders = async (req,res)=>{

    try{
        // initialize body        
        const userId = req.body.userId;
      
        let checkUserOrders = await OrdersSchema.find({user_id : userId}).sort({order_date: -1});

        if(checkUserOrders.length != 0 ){

          
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




methods.getToReviewOrders = async (req,res,next)=>{

    try{
        // initialize body        
        const userId = req.body.userId;
      
        // let checkUserOrders = await OrdersSchema.find({user_id : userId,order_status:'Received'}).sort({order_date: -1}).lean();
        let checkUserOrders = await OrdersSchema.aggregate([{
            $lookup:{
                from:"t_order_details",
                localField:"order_number",
                foreignField:"order_number",
                as:'orderForReviews'
            }          
        },{
        $match:{
            user_id : userId,
            order_number:'1579084954116296704'
          
        }}]);

        if(checkUserOrders.length != 0 ){
            Promise.all(checkUserOrders.map((item)=>item.orderForReviews.flat())).then(data=>{
                return res.send({
                    status:true,
                    message:'Successfully get the orders for review.',
                    data:data.flat()
                })            
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
        
        let checkOrderDetails = await OrderDetailsSchema.find({order_number : orderNumber}).lean();

        if(checkOrderDetails.length != 0 ){
   
        Promise.all(checkOrderDetails.map(async item=>{
            let getProduct = await ProductSchema.findOne({pid:item.pid});
            
            // get markup value
            item.computed_markup_price = item?.price + (item?.price  * ((getProduct.markup_price ? getProduct.markup_price : 0.5 ) /100) ) ;

            return item;
        })).then((data)=>{
            return res.send({
                status:true,
                message:'Successfully get my ordered products.',
                data:data
            })
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
                        data:checkUserOrders,
                        tracking:result.tracking
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

methods.orderReceived = async (req,res)=>{
    try{
        // initialize body        
        const userId = req.body.userId;
        const orderNumber = req.body.orderNumber;

        let checkUserOrders = await OrdersSchema.find({user_id : userId,order_number:orderNumber});

        if(checkUserOrders.length > 0 ){

            let updatePayload = {
                $set:{
                    order_status:'Received'
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
                        message:'Successfully order received',                        
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
        return res.send({
            status:false,
            message:error,
        
        })      
    }
}




methods.reviewProduct = async (req,res)=>{
    try{
        // initialize body        
        const userId = req.body.userId;
        const rating = req.body.rating;
        const productReview = req.body.productReview;
        const pid = req.body.pid;

        let  files = req.files;          
        let uploads =  files ? Object.values(files) : [];

        
        let fileNames = uploads.map(function(file) {

         
            if(file.length > 1){
                return file.map((fileResponse)=>fileResponse?.name);
            }else{
                return file?.name
            }                       
        });      


        
    
        let countErrorUploads = 0 ;       
        if(uploads.length > 0){
            uploads.map(item=>{
                if(item.length > 1){
                    item.map((responseFile)=>{

                     
                        responseFile.mv(`./uploads/reviews/${responseFile.name}`,(err)=>{
                            if(err){
                                countErrorUploads++;
                                return  res.send({
                                    status:true,
                                    message:'Failed to upload.',                                                    
                                })
                            }
                        });
                    
                    })    
                }else{
                    item.mv(`./uploads/reviews/${item.name}`,(err)=>{
                        if(err){
                            countErrorUploads++;
                            return  res.send({
                                status:true,
                                message:'Failed to upload.',                                                    
                            })
                        }
                    });        
                }       
            })
        }


        let payload = {
            pid: pid,
            user_id: userId,
            review:productReview,
            rating:rating,            
            file_names:fileNames
        }

        ProductReviewSchema.create(payload, (error, response) => {                    
            if(error){
                // error on insert
                return res.send({
                    status:false,
                    message:'Something went wrong',
                    error:error
                })

            }else{
                return  res.send({
                    status:true,
                    message:'Successfully sent a review.',  
                    data:response                                                  
                })
            }
        });

  
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }
}
module.exports = methods;
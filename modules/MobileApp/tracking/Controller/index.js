// MARKET CONTROLLER

const { method } = require("lodash");



const methods = {};




methods.getToVerifyOrders = async (req,res)=>{

    try{
        // initialize body        
        const userId = req.body.userId;
        console.warn(userId);
        let checkUserOrders = await OrdersSchema.find({user_id : userId});

        if(checkUserOrders.length != 0 ){

            console.warn(checkUserOrders);
            return res.send({
                status:true,
                message:'Successfully get the to verify orders.',
                data:checkUserOrders
            })

            
        }else{

        }
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}





module.exports = methods;
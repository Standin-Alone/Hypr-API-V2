// MARKET CONTROLLER


const { method, get } = require("lodash");



const methods = {};




methods.rewardHistory = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;

   

        let checkRewardsHistory = await RewardsHistorySchema.find({user_id:userId});


        if(checkRewardsHistory.length > 0 ){
            return res.send({status:true,data:checkRewardsHistory})

        }else{
            return res.send({status:false})
        }






               
    }catch(error){
        console.log(error);
        return res.send({status:false,message:'error'})
    }


}




module.exports = methods;
// MARKET CONTROLLER

const { method, get } = require("lodash");



const methods = {};





methods.sendMessage = async (req,res)=>{

    try{
        // initialize body        
        
        let userId = req.body.userId;
        let friendUserId = req.body.friendUserId;

     
        
        return res.send({status:true})
               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



module.exports = methods;
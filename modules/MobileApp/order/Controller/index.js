// MARKET CONTROLLER

const { method } = require("lodash");


const methods = {};


methods.getOrder = async (req,res)=>{

    try{
        // initialize body        
        let countryCode = req.params.countryCode;
        

        
        let checkCountry = await CitiesSchema.find({country_code:countryCode});

        // CHECK IF USER ID EXIST
        if(checkCountry){

            
            res.send({
                status:true,
                message:'Successfully Found.',                
                data:checkCountry
            })
        }else{            
            res.send({
                status:false,
                message:'Country Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



module.exports = methods;
// PARTNERS CONTROLLER
const methods = {};


methods.getPartners = async (req,res)=>{
    try{
        // initialize body              
        let getPartners = await PartnersSchema.find();
        if(getPartners.length > 0 ){         
            return res.send({
                status:true,
                message:'Successfully get partners.',
                data:getPartners
            })            
        }else{
            return res.send({
                status:false,
                message:'No Partners.',
                data:[]
            })
        }               
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }
}


module.exports = methods;
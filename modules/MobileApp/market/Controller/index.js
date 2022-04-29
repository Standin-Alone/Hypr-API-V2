// MARKET CONTROLLER

const { method } = require("lodash");


const methods = {};


methods.getCities = async (req,res)=>{

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

methods.saveAddress =  async (req,res)=>{
    console.warn('req',req.body);
    try{


   
        // initialize body        
        let userId = req.body.userId;
        let fullName = `${req.body.firstName} ${req.body.lastName}`;
        let contact = req.body.contact;        
        let country = req.body.country;
        let countryName = req.body.countryName;
        let zipCode = req.body.zipCode;
        let address = req.body.address;
        let city = req.body.city;
        
       
        
        

        let checkUserId = await UsersSchema.findById(userId);

  
        // CHECK IF USER ID EXIST
        if(checkUserId){

            let checkShippingAddress = checkUserId.shipping_address.length == 0 ? true : false;
            let cleanPayload = {

                $addToSet:{

                    shipping_address:{
                        full_name:fullName,
                        contact:contact,
                        country:countryName,
                        country_code:country,
                        zip_code:zipCode,
                        address:address,
                        city:city,
                        is_selected: checkShippingAddress
                    }
                }

            }

            
            // add new shipping address
            UsersSchema.findByIdAndUpdate(userId,cleanPayload,{upsert: true},function(updateError,updateResult){
                if(updateError){
                    console.warn(updateError)
                    // error on update
                    res.send({
                        status:false,
                        message:'Something went wrong',
                        error:updateError
                    })
        
                }else{    
                    
                    res.send({
                        status:true,
                        message:'Successfully saved a new address',                        
                    })
                }
            });
           
        }else{            
            res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.getShippingAddress =  async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        

        let checkUserId = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUserId){


            // get shipping address
            if(checkUserId.shipping_address){    
                
                res.send({
                    status:true,
                    message:'Successfully get the shipping address',                                        
                    data:checkUserId.shipping_address
                })  

                
                
            }else{
                
                res.send({
                    status:false,
                    message:'Something went wrong',                    
                })                              
            }
        }else{            
            res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


module.exports = methods;
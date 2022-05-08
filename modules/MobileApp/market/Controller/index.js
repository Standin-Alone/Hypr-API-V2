// MARKET CONTROLLER

const { method } = require("lodash");
const { default: mongoose } = require("mongoose");


const methods = {};

methods.getState = async (req,res)=>{

    try{
        // initialize body        
        let countryName = req.params.countryName;
      
       
    
        let checkCountry = await CountriesSchema.find({country_name:countryName});
       
        // CHECK IF USER ID EXIST
        if(checkCountry.length != 0 ){

            let countryId = checkCountry[0].country_id;
            
            let getStates = await StateSchema.find({country_id:countryId})

            
          
            res.send({
                status:true,
                message:'Successfully Found.',                
                data:getStates
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



methods.updateSelectedAddress =  async (req,res)=>{

    try{


   
        // initialize body        
        let userId = req.body.userId;
        let shippingAddress =  req.body.shippingAddress;
        
       
        
        console.warn('SHIPPING_ADDRESS',shippingAddress);

        let checkUser = await UsersSchema.findById(userId);

        let addressId  = shippingAddress.id

    
        // CHECK IF USER ID EXIST
        if(checkUser){

            
            // Update not selected address to false
            checkUser.shipping_address.map( async (item,result_index)=>{  
                
                if(item.id != addressId ){
                      await UsersSchema.findByIdAndUpdate(userId, {
                        $set: {
                                                            
                                'shipping_address.$[element].is_selected': false                               
                        }
                    },{
                        arrayFilters: [ { "element.id":  mongoose.Types.ObjectId(item.id)} ]
                    })  
                }
            })


            // Update selected address to true
            UsersSchema.findByIdAndUpdate(userId, {
                $set: {                         
                    'shipping_address.$[element].is_selected':true,
                
            },                       
            },{
                arrayFilters: [ { "element.id":  mongoose.Types.ObjectId(addressId)} ]
            },function(updateError,updateResult){
                if(updateError){
                    console.warn(updateError)
                    // error on update
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:updateError
                    })
        
                }else{    
                    
                    return  res.send({
                        status:true,
                        message:'Successfully updated your selected address',                        
                    })
                }
            })


    
           
        }else{            
            return  res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return  res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}







  methods.deleteAddress =  async (req,res)=>{
    console.warn('req',req.body);
    try{


   
        // initialize body        
        let userId = req.body.userId;
        let addressId = req.body.addressId; 
        
       

        

        let checkUserId = await UsersSchema.findById(userId);

  
        // CHECK IF USER ID EXIST
        if(checkUserId){
                         

            //  DELETE SHIPPING ADDRESS
            let deletePayload ={                            
               $pull: { shipping_address: {id:mongoose.Types.ObjectId(addressId)} },
            };            

            
            UsersSchema.findByIdAndUpdate(userId,deletePayload, function (deleteError,deleteResult) {
                if(deleteError){
                    console.warn(deleteError)
                    // error on update
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:deleteError
                    })
        
                }else{                        

                    return res.send({
                        status:true,
                        message:'Successfully removed your address',                        
                    })
                }
            
            });


            
            
           
        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.updateAddress =  async (req,res)=>{
    console.warn('req',req.body);
    try{


   
        // initialize body        
        let userId = req.body.userId;
        let addressId = req.body.addressId;
        let fullName = `${req.body.firstName} ${req.body.lastName}`;
        let contact = req.body.contact;        
        let country = req.body.country;
        let countryName = req.body.countryName;
        let zipCode = req.body.zipCode;
        let address = req.body.address;
        let city = req.body.city;
        let state = req.body.state;
        
       
        console.warn(req.body);
        

        let checkUserId = await UsersSchema.findById(userId);

  
        // CHECK IF USER ID EXIST
        if(checkUserId){


                        


            let cleanPayload = {
                $set: {
                                                    
                        'shipping_address.$[element].full_name': fullName,
                        'shipping_address.$[element].contact': contact,
                        'shipping_address.$[element].country': countryName,
                        'shipping_address.$[element].country_code': country,
                        'shipping_address.$[element].zip_code': zipCode,
                        'shipping_address.$[element].address': address,
                        'shipping_address.$[element].city': city,
                        'shipping_address.$[element].state': state,
                }
            };

            //  UPDATE SHIPPING ADDRESSS
            UsersSchema.findByIdAndUpdate(userId, cleanPayload,{
                arrayFilters: [ { "element.id": mongoose.Types.ObjectId(addressId)} ]
            },function(updateError,updateResult){
                if(updateError){
                    console.warn(updateError)
                    // error on update
                    return res.send({
                        status:false,
                        message:'Something went wrong',
                        error:updateError
                    })
        
                }else{                        
                    return res.send({
                        status:true,
                        message:'Successfully updated your address',                        
                    })
                }
            }) 


            
            
           
        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
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
        let state = req.body.state;
        
       
        
        

        let checkUserId = await UsersSchema.findById(userId);

  
        // CHECK IF USER ID EXIST
        if(checkUserId){

            let checkShippingAddress = checkUserId.shipping_address.length == 0 ? true : false;
            let cleanPayload = {

                $addToSet:{

                    shipping_address:{
                        id: mongoose.Types.ObjectId(),
                        full_name:fullName,
                        contact:contact,
                        country:countryName,
                        country_code:country,
                        zip_code:zipCode,
                        address:address,
                        city:city,
                        state:state,
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
        

        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){


            // get shipping address
            if(checkUser.shipping_address){    
                console.warn(checkUser.shipping_address)
                return res.send({
                    status:true,
                    message:'Successfully get the shipping address',                                        
                    data:checkUser.shipping_address
                })  

                
                
            }else{
                
                return res.send({
                    status:false,
                    message:'Something went wrong',                    
                })                              
            }
        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.getCart =  async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        

        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){


            // get cart
            let getCart = await CartSchema.find({buyer_id:userId});

            return res.send({
                status:true,
                message:'You have items in your cart',                
                data:getCart
            })


        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}




methods.getCartCount =  async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        

        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){


            // get cart
            let getCart = await CartSchema.find({buyer_id:userId});

            return res.send({
                status:true,
                message:'You have items in your cart',                
                data:getCart.length
            })


        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.getWishList =  async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        

        let checkWishList = await WishListSchema.find({buyer_id:userId});


        // CHECK IF USER ID EXIST
        if(checkWishList.length != 0){

            return res.send({
                status:true,
                message:'Successfully fetched your wish list',  
                data:checkWishList              
            })
           
        }else{            
            return res.send({
                status:false,
                message:"You don't have items on your wish list",  
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}



methods.addToCart = async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        let variant = req.body.variant;
        let freightCalculation = req.body.freightCalculation;
        let shippingAddress = req.body.shippingAddress;

        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){
             
            let cleanPayload = {
                product_id: variant.pid,
                variant_id: variant.variantVid,
                product_price: variant.variantPrice,
                prouct_price_cny: '',
                product_code: variant.variantSku,
                product_img: variant.variantImage,
                quantity: 1,
                buyer_id: userId,
                buyer_name: `${checkUser.first_name} ${checkUser.last_name}`,
                total_amount:  variant.variantPrice,
                total_amount_cny: '',  
                variant_name : variant.variantName,
                status: 1,              
                freight_calculation:freightCalculation[0],
                shipping_address:shippingAddress
            };

            let checkIfProductExistInCart = await CartSchema.find({product_id: variant.pid,variant_id: variant.variantVid});
      
            if(checkIfProductExistInCart.length !=  0){
                return res.send({
                    status:false,
                    message:'This product is already exist in your cart.',                        
                })

            }else{            
                CartSchema.create(cleanPayload, (userError, insertUserResult) => {                    
                    if(userError){
                        // error create
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:userError         
                        })
                    }else if(insertUserResult){

                        // success create
                        return  res.send({
                            status:true,
                            message:'Successfully added to your cart.',    
                            
                        })
                    }else{
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:userError         
                        })
                    }
                })            
            }   
                
                        
        }else{            
            return  res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return  res.send({
            status:false,
            message:'Something went wrong',    
            error:error            
        })    
    }

}



methods.removeProductFromWishList =  async (req,res)=>{
    console.warn('req',req.body);
    try{
        // initialize body        
        let wishListId = req.body.wishListId;
    

        let checkWishList = await WishListSchema.findById(wishListId);

        // CHECK IF WISH LIST EXIST
        if(checkWishList){
                         

            //  DELETE PRODUCT FROM WISHLIST
            let deletePayload ={                            
                _id: checkWishList._id           
            };            

    
            WishListSchema.deleteOne(deletePayload, function (deleteError,deleteResult) {
                if(deleteError){
                    // error create
                    return  res.send({
                        status:false,
                        message:'Something went wrong.',    
                        error:deleteError         
                    })
                }else{
                    return  res.send({
                        status:true,
                        message:'Successfully removed the product from wish list.',                                
                    })
                }
          
              });
                        
        }else{            
            return res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return res.render('./error.ejs',{message:'ERROR! PAGE NOT FOUND',status:404,stack:false});        
    }


}


methods.addToWishList = async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        let variant = req.body.variant;
  

        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){
             
            let cleanPayload = {
                product_id: variant.pid,
                variant_id: variant.variantVid,
                product_price: variant.variantPrice,            
                variant_sku: variant.variantSku,
                product_img: variant.variantImage,
                buyer_id: userId,
                variant_name : variant.variantName,
                status: 1        
            };

            let checkIfProductExistInCart = await WishListSchema.find({product_id: variant.pid,variant_id: variant.variantVid});
      
            if(checkIfProductExistInCart.length !=  0){
                return res.send({
                    status:false,
                    message:'This product is already exist in your item wish list.',                        
                })

            }else{            
                WishListSchema.create(cleanPayload, (userError, insertUserResult) => {                    
                    if(userError){
                        // error create
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:userError         
                        })
                    }else if(insertUserResult){

                        // success create
                        return  res.send({
                            status:true,
                            message:'Successfully added to your wishlist.',    
                            
                        })
                    }else{
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:userError         
                        })
                    }
                })            
            }   
                
                        
        }else{            
            return  res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return  res.send({
            status:false,
            message:'Something went wrong',    
            error:error            
        })    
    }

}




methods.increaseQuantity = async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        let product = req.body.item;
  
        console.warn(product);
        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){
             
           

            let checkProduct = await CartSchema.find({variant_id:product.variant_id});
      
            if(checkProduct.length !=  0){

                let computeQuantity = checkProduct[0].quantity  + 1;
                let computeTotalAmount = checkProduct[0].product_price * computeQuantity;
                let updateOptions = {
                    $set:{
                        quantity:computeQuantity,
                        total_amount:computeTotalAmount
                    }
                }


                CartSchema.findByIdAndUpdate(product._id,updateOptions,function(updateError,updateResult){
                    if(updateError){
                        // error create
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:updateError         
                        })
                    }else{
                        return  res.send({
                            status:true,
                            message:'Successfully increase the quantity of item.',                                
                        })
                    }
                });                

            }                        
        }else{            
            return  res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return  res.send({
            status:false,
            message:'Something went wrong',    
            error:error            
        })    
    }

}




methods.decreaseQuantity = async (req,res)=>{

    try{
        // initialize body        
        let userId = req.body.userId;
        let product = req.body.item;
  
        console.warn(product);
        let checkUser = await UsersSchema.findById(userId);


        // CHECK IF USER ID EXIST
        if(checkUser){
             
           

            let checkProduct = await CartSchema.find({variant_id:product.variant_id});
      
            if(checkProduct.length !=  0){

                let computeQuantity = (checkProduct[0].quantity <= 1 ? 1 : (checkProduct[0].quantity  - 1) ) ;
                let computeTotalAmount = checkProduct[0].product_price * computeQuantity;
                let updateOptions = {
                    $set:{
                        quantity:computeQuantity,
                        total_amount:computeTotalAmount
                    }
                }


                CartSchema.findByIdAndUpdate(product._id,updateOptions,function(updateError,updateResult){
                    if(updateError){
                        // error create
                        return  res.send({
                            status:false,
                            message:'Something went wrong.',    
                            error:updateError         
                        })
                    }else{
                        return  res.send({
                            status:true,
                            message:'Successfully increase the quantity of item.',                                
                        })
                    }
                });                

            }                        
        }else{            
            return  res.send({
                status:false,
                message:'User Cannot be found',                
            })
        }
    }catch(error){
        console.log(error);
        return  res.send({
            status:false,
            message:'Something went wrong',    
            error:error            
        })    
    }

}
module.exports = methods;
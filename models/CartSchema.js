
require('../global/variables');



  const cart = new mongoose.Schema({  
    user_id: String,
    product_id: String,
    variant_id: String,
    variant_name : String,
    buyer_name: String,
    product_price: String,  
    product_price_cny: String,  
    product_code: String,    
    product_image:String,  
    quantity: Number,    
    total_amount: String,
    total_amount_cny: String,
    status: Boolean,
    created_at:{
      type:Date,
      default:Date.now()
    },  
    updated_at:{
      type:Date,
      default:Date.now()
    },  
    freight_calculation:Array,
    shipping_address:Array
    },{collection:"t_cart"});

module.exports =CartSchema = mongoose.model("cart", cart);
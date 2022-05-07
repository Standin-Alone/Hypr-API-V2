
require('../global/variables');

let orderDetailsSchema = new schema({
    order_id:   mongoose.Schema.Types.ObjectId ,
    order_number:   String ,              
    product_id:   String ,
    variant_id: String,    
    product_price:   String ,            
    quantity:   String ,
    total_amount: String,                            
    status:   Boolean ,
    created_at:{
      type:Date,
      default:Date.now()
    },  
    updated_at:{
      type:Date,
      default:Date.now()
    },  
}, { collection: "t_order_details" });

module.exports = orderDetailsSchema = mongoose.model("t_order_details", orderDetailsSchema);


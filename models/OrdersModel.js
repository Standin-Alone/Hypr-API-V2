
require('../global/variables');

let orderNewSchema = new mongoose.Schema({  
    order_id:  mongoose.Schema.Types.ObjectId ,
    user_id:String,
    order_number:  String,    
    payment_method:  String,
    payerId:String,
    paymentId:String,    
    order_date:  {
      type:Date,
      default:Date.now()
    },     
    order_status:  String ,     
    payment_status:  String ,  
    billing_name:  String ,    
    billing_address:  String ,
    billing_state:  String ,
    billing_city:  String ,
    billing_country:  String ,
    billing_country_code:  String ,
    billing_contact:  String ,
    billing_zip_code:  String ,
    sub_total:  String ,  
    total_amount:  String ,    
    currency_format:  String ,
    currency:  String ,
    status:  Boolean ,
    created_at:  {
      type: Date,
      default: Date.now()
    },
    updated_at:  {
      type: Date,
      default: Date.now()
    } 
  }, { collection: "t_orders" });

  module.exports = OrdersSchema = mongoose.model("t_orders", orderNewSchema);

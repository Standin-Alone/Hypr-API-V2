
require('../global/variables');

let orderNewSchema = new mongoose.Schema({  
    user_id:  mongoose.Schema.Types.ObjectId ,
    order_number:  String,
    payment_mode:  String,
    payment_method:  String,
    order_date:  {
      type:Date,
      default:Date.now()
    },     
    order_status:  String ,     
    payment_status:  String ,  
    user_email:  String ,
    billing_name:  String ,
    sellerId:  String ,
    billing_address:  String ,
    billing_state:  String ,
    billing_city:  String ,
    billing_country:  String ,
    billing_contact_number:  String ,
    billing_zip_code:  String ,
    total_amount:  String ,
    description:  String ,
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

  module.exports = orderSchema = mongoose.model("t_orders", orderNewSchema);

/*
  Author name : ATTI
  Description : user model after business model updation
  Date : 25 march 2020
*/
require('../global/variables');

// let addToCartNewSchema = new schema({

  const cartSchema = new mongoose.Schema({  
  product_id: String,
  variant_id: String,
  product_price: String,
  prouct_price_cny: String,
  product_code: String,
  product_img: String,
  quantity: Number,
  buyer_id: String,
  buyer_name: String,
  total_amount: String,
  total_amount_cny: String,  
  variant_name : String,
  cash_back : String,
  status: Boolean,
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default:Date.now()
  },  
  freight_calculation:Array,
  shipping_address:Array
},{collection:"t_cart"});

module.exports =CartSchema = mongoose.model("t_cart", cartSchema);
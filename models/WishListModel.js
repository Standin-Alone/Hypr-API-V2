/*
  Author name : ATTI
  Description : user model after business model updation
  Date : 25 march 2020
*/
require('../global/variables');

// let addToCartNewSchema = new schema({

  const wishListSchema = new mongoose.Schema({  
  product_id: String,
  variant_id: String,
  product_price: String,
  prouct_price_cny: String,
  variant_sku: String,
  product_img: String,
  buyer_id: String,  
  variant_name : String,
  status: Boolean,
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default:Date.now()
  },  
},{collection:"t_wishlist"});

module.exports = WishListSchema = mongoose.model("t_wishlist", wishListSchema);
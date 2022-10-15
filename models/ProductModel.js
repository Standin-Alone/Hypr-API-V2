
require('../global/variables');

let productSchema = new mongoose.Schema({  
    pid: String ,    
    product_information: {
        type: String,
      },
      page_number: {
        type: String,
      },
      category_name: {
        type: String,
      },
      product_name: {
        type: String,
      },
      product_sku: {
        type: String,
      },
      price: {
        type: String,
      },
      product_add_price: {
        type: String,
      },
      cache_key: {
        type: String,
      },
      shop: {
        type: String,
      },
      product_review:{
        type: Array
      },
      markup_price:{
        type: String
      }
  }, { collection: "t_api_products" });

  module.exports = ProductSchema = mongoose.model("t_api_products", productSchema);

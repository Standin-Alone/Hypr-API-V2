
require('../global/variables');

let productReviewSchema = new mongoose.Schema({   
    pid: String,
    user_id: {
        type:String,  
    },
    review:{
        type:String,        
    },
    rating:{
        type:Number,        
    },
    file_names:{    
        type: Array,
    },
    date_created: {  
        type: Date,
        default: Date.now()   
    }
  }, { collection: "t_product_review" });

  module.exports = ProductReviewSchema = mongoose.model("t_product_review", productReviewSchema);

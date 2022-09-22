
require('../global/variables');

let rewardsHistorySchema = new mongoose.Schema({  
    _id:  mongoose.Schema.Types.ObjectId ,    
    user_id: String,
    order_id: String,
    old_reward: Number,
    new_reward: Number,
    date_created: {  
        type: Date,
        default: Date.now()   
    }
  }, { collection: "t_rewards_history" });

  module.exports = RewardsHistorySchema = mongoose.model("t_rewards_history", rewardsHistorySchema);

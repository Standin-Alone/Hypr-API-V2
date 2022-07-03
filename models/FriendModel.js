
require('../global/variables');

let friendSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    user_id: String,
    friend_user_id: String,  
    date_created:  {
      type:Date,   
      default:Date.now()   
    },     
  }, { collection: "t_friend" });

  module.exports = FriendSchema = mongoose.model("t_friend", friendSchema);

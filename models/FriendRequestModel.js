
require('../global/variables');

let friendRequestSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    sender_user_id: String,
    receiver_user_id: String,
    date_accepted:  {
      type:Date,      
    },     
    date_declined:  {
      type:Date,
      
    },  
    date_sent:  {
      type:Date,   
      default:Date.now()   
    },     
  }, { collection: "t_friend_request" });

  module.exports = FriendRequestSchema = mongoose.model("t_friend_request", friendRequestSchema);

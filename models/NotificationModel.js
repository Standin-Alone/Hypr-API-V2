
require('../global/variables');

let notificationSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    message: String,
    receiver_user_id: String,
    sender_user_id: String,
    other_info:Array,
    date_created:  {
      type:Date,      
    }
  }, { collection: "t_notification" });

  module.exports = NotificationSchema = mongoose.model("t_notification", notificationSchema);

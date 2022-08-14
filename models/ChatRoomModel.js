
require('../global/variables');

let chatRoomSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    room_name: String,  
    messages: Array,
    date_created:  {
      type:Date,   
      default:Date.now()   
    },     
  }, { collection: "t_chat_room" });

  module.exports = ChatRoomSchema = mongoose.model("t_chat_room", chatRoomSchema);

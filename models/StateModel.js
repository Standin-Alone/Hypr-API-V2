
require('../global/variables');

let stateSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    state_id: String,
    state_name: String,
    country_id: Number,
  }, { collection: "r_state" });

  module.exports = StateSchema = mongoose.model("r_state", stateSchema);

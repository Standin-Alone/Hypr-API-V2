
require('../global/variables');

let teamsSchema = new mongoose.Schema({  
 
    recruiter_id: String,
    recruited_id: String,
    date_created: {  
        type: Date,
        default: Date.now()   
    },
  }, { collection: "r_teams" });

  module.exports = TeamsSchema = mongoose.model("r_teams", teamsSchema);

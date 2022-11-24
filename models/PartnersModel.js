
require('../global/variables');

let partnersSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    partner_name: String,
    parter_logo: String,
    status:String,
    date_created:  {
        type: Date,
        default: Date.now()
    },
  }, { collection: "r_partners" });

  module.exports = PartnersSchema = mongoose.model("r_partners", partnersSchema);

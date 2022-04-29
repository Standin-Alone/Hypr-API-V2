
require('../global/variables');

let citiesSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    name: String,
    state_id: Number,
    state_code: String,
    state_name:String,
    country_id: Number,
    country_code: String,
    country_name: String,
    latitude: String,
    longitude: String,
    wikiDataId: String
  }, { collection: "r_cities" });

  module.exports = orderSchema = mongoose.model("r_cities", citiesSchema);

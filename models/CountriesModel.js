
require('../global/variables');

let countriesSchema = new mongoose.Schema({  
    id:  mongoose.Schema.Types.ObjectId ,    
    country_id: String,
    country_name: String,
    country_code: String,
  }, { collection: "r_countries" });

  module.exports = CountriesSchema = mongoose.model("r_countries", countriesSchema);

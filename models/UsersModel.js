
require('../global/variables');

let userNewSchema = new schema({
    profile_image: String,
    first_name: String,
    last_name: String,
    email: String,   
    phone: Number,
    birthday: Date,
    age: Number,
    country: String,
    country_name: String,
    address: String,
    shipping_address:Array,
    area: String,
    city: String,
    landmark: String,
    pincode: Number,
    state: String,
    about:String,
    username: String,
    password: String,
    otp: Number,
    referral_code: String,
    referred_by_id : String,
    referred_by_name : String,
    picture:String,
    cover_pic:String,
    user_refferal_code: String,  
    referral_link: String,  
    referral_user_id:String,
    access_token:String,
    social_type: String,
    signupType: String,
    startDate: Date,
    app_id: String,
    share_token: String,
    logi_at: Date,
    last_login_at: Date,
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default:Date.now()
    },    
    wallet: Number,
    verified_date: Date,    
    reward_pending:Number,    
    status: {
       type: Boolean,
       default:1
    },
    //  { collection: "t_product" });
    },{collection:"users"});

module.exports = UsersSchema = mongoose.model("users", userNewSchema);
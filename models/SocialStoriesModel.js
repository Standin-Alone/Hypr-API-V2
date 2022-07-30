const mongoose = require('mongoose');

const socialStories = new mongoose.Schema({
   user_id: {
        type: String,
        default: ''
    },
   username: {
        type: String,
        default: ''
    },
   full_name: {
        type: String,
        default: ''
    },
   user_picture: {
        type: String,
        default: ''
    },
    user_name: { //story column only
        type: String,
        default: ''
    },
    user_image: { //story column only
        type: String,
        default: ''
    },
   files: { type: Array },
   stories:{ type: Array },
   date_created: { type: Date,  default: Date.now()},
   status: { type: Boolean,default:true }

}, { collection: "t_social_stories" });

module.exports = SocialStoriesSchema = mongoose.model("t_social_stories", socialStories);
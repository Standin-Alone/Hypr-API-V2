const mongoose = require('mongoose');

const socialPost = new mongoose.Schema({
    social_post_id:  mongoose.Schema.Types.ObjectId ,
    caption: {
        type: String,
        default: ''
    },
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
   post_images: { type: Array },
   post_location: {type: Array},
   post_tags: { type: Array },
   post_hypes: { type: Array },
   post_comment: { type: Array },
   post_share: { type: Array },
   post_privacty: { type: Number },//0-OnlyMe, 1- MyPals, 2-Everyone
//    postFeeling: {
//         type: String,
//         default: ''
//     },
//    postGalleryName: {
//         type: String,
//         default: ''
//     },//Cover,Profile,Timeline,Profile etc
   date_created: { type: Date,  default: Date.now()},
   date_updated: { type: Date },
   video_link: {
        type: String,
        default: ''
    },
//    userIP: {
//         type: String,
//         default: ''
//     },
   status: { type: Boolean },

}, { collection: "t_social_post" });

module.exports = SocialPostSchema = mongoose.model("t_social_post", socialPost);
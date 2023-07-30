const mongoose = require("mongoose");
const {Schema} = mongoose;


const userSchema = new Schema({
    username:{type:String,require:true},
    roles:{
        User:{type:Number,default:2001},
        Editor: Number,
        Admin: Number
    },
    pwd:{type:String,require:true},
    refreshToken:{type:String, default:""}
})

module.exports = mongoose.model("User", userSchema)
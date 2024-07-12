import mongoose     from "mongoose";

const otpSchema = new mongoose.Schema({
    otp : { type : Number },
    createdAt : { type : Number },
    sessionId : { type : String },
    tries : { type : Number },
    username : { type : String },
    email : { type : String },
    password : { type : String }

})

const Otp = mongoose.models.otpTable || mongoose.model("otpTable",otpSchema)

export default Otp
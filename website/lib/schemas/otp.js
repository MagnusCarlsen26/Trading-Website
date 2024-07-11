import mongoose, { mongo } from "mongoose";
import { number, string } from "zod";

const otpSchema = new mongoose.Schema({
    otp : { type : Number },
    createdAt : { type : Date },
    sessionId : { type : String },
})

const Otp = mongoose.models.otpTable || mongoose.model("otpTable",otpSchema)

export default Otp
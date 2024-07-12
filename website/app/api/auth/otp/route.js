import Otp from "@/lib/schemas/otp";
import User from "@/lib/schemas/user";
import { NextRequest, NextResponse } from "next/server";
import { authDb } from "@/lib/mongo";
import bcrypt from 'bcrypt';

async function saveUser({username,email,password}) {
    console.log(username,email,password)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    await User.create({username,email,password : hashedPassword})
}

async function deleteOtp( sessionId ) {
    await Otp.findOneAndDelete({
        sessionId
    })

}
async function updateOtpTry( sessionId ) {
    const otpRecord = await Otp.findOne({
        sessionId
    })
    await Otp.findOneAndUpdate({
        sessionId,
    },{
        $inc: { tries : 1 }
    })
}
async function checkOtp( otp,sessionId ) {
    const otpRecord = await Otp.findOne({
        sessionId 
    })
    if (otpRecord && otpRecord.tries <= 10) {
        console.log(otpRecord)
        updateOtpTry(sessionId)
        if (Date.now() - otpRecord.createdAt > 100*60*1000) return "Otp Expired"
        if (otpRecord.otp !=  otp) return "Incorrect Otp"
        deleteOtp(sessionId)
        saveUser(otpRecord)
        return "Login"
    }
    // deleteOtp(sessionId)
    return "Otp Expired"
}

export async function POST(req,res) {
    try {
        await authDb()
        const data = await req.json();  
        
        const {otp,sessionId} = data
        const result = await checkOtp(otp,sessionId)
        
        if (result === 'Login') res = { success : true }
        else res = { success : false }
        
        return NextResponse.json({
            ...res,
            data : {
                result
            }
        })
    } catch(error) {
        console.log(error)
        return NextResponse.json("FUCK")
    }
}
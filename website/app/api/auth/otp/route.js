import Otp from "@/lib/schemas/otp";
import { NextRequest, NextResponse } from "next/server";

async function saveUser(username,email,password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    await User.create({username,email,password : hashedPassword})
}

async function checkOtp( otp,sessionId ) {
    const otpRecord = await Otp.findOne({
        sessionId
    })
    console.log(sessionId)
    if (otpRecord) {
        console.log(otpRecord)
        if (otpRecord.otp ==  otp) return "Login"
        else return "Incorrect Otp"
    }
    return "Otp Expired"
}

export async function POST(req,res) {
    try {

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
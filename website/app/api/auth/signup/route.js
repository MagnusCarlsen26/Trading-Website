import { authDb } from '@/lib/mongo/index';
import User from '@/lib/schemas/user'
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'
import {uuid} from 'uuidv4'
import Otp from '@/lib/schemas/otp';

async function getuserTable(username,email) {
    const query = { $or: [ { username }, { email }, ] };
    return await User.findOne(query) 
} 

async function saveOtp(otp,sessionId) {
    await Otp.create({
        otp,
        createdAt : Date.now(),
        sessionId
    })
}

export async function POST(req,res) {
    try {
        console.log('HI')
        await authDb()
        const data = await req.json(); 
        const { username, email ,password } = data;
        
        const users = await getuserTable(username,email)
        
        let message
        if (users) {
            if (users.username) message = users.username
            else if (users.email) message = users.email
            
            return NextResponse.json({
                success : false,
                data : { message : `Already exists ${message}`  }
            })
        } else {
            const sessionId = uuid().replace(/-/g, '');
            const otp = 100000 + Math.floor(Math.random()*899999)
            await saveOtp(otp,sessionId)
            return NextResponse.json({
                success : true,
                data : { sessionId }
            })
        }
    } catch(error) {
        console.log(error)
        return NextResponse.json("FUCK")
    }
    
}  
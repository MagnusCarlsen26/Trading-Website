import { authDb } from '@/lib/mongo/index';
import User from '@/lib/schemas/user'
import { NextResponse } from 'next/server';
import {uuid} from 'uuidv4'
import Otp from '@/lib/schemas/otp';

async function getuserTable(username,email) {
    const query = { $or: [ { username }, { email }, ] };
    return await User.findOne(query) 
} 

async function saveOtp(otp,sessionId,username,email,password) {
    console.log(username,email,password,'api/signup')
    await Otp.create({
        otp,
        createdAt : Date.now(),
        sessionId,
        tries : 0,
        username,
        email,
        password
    })
}

export async function POST(req,res) {
    try {
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
            await saveOtp(otp,sessionId,username,email,password)
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
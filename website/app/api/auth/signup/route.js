// import { userTable,init } from '@/lib/mongo/auth';
import { clientPromise } from '@/lib/mongo/index';
import User from '@/lib/schemas/user'

import { NextResponse } from 'next/server';
import bcrypt, { compareSync, hash } from 'bcrypt'

async function getuserTable(username,email) {
    const query = {
        $or: [
            { username },
            { email },
        ]
        };
    
    return await User.findOne(query) 
} 

async function saveUser(username,email,password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    await User.create({username,email,password : hashedPassword
    })
}

export async function POST(req,res) {
    try {
        await clientPromise()
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
            await saveUser(username,email,password)
            console.log("HI")
            return NextResponse.redirect( new URL('http://localhost:3000/otp') , req.url )
        }
    } catch(error) {
        console.log(error)
        return NextResponse.json("FUCK")
    }
    
}  
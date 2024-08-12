import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import User from '@/lib/schemas/user';
import { authDb } from '@/lib/mongo';
import bcrypt from 'bcrypt'

async function getuserTable(username,password) {
    const record = await User.findOne({ username }) 
    console.log(password)
    if (record) {
        if (await bcrypt.compare(password,record.password)) return "OK"
        else return 'Incorrect Password'
    }
    return "No username found"
}

export async function GET(req,res) {
    try{
        console.log('HI')
        await authDb()
        const data = await req.json()
        const { username,password } = data
        
        const check = await getuserTable(username,password)
        console.log(check)
        if (check !== "OK") return NextResponse.json({
            success : false,
            data : { message : check }
        })

        const jwt_secret = process.env.JWT_SECRET
        const token = jwt.sign({
            username,
            password
            },
            jwt_secret,{ expiresIn : '1h' }
        )
        return NextResponse.json({
            success : true,
            data : { token }
        })
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({
            success : false,
            data : { error }
        })
    }
}
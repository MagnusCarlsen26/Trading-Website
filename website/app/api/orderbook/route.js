import { NextResponse } from 'next/server'

export async function POST(req,res) {
    const body = await req.json();
    console.log(body)
    return NextResponse.json({
        hello : "hello"
    })
}
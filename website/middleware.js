import { NextResponse } from "next/server";
import { signup } from "./middleware/auth/signup/signup";

export async function middleware(req) {
    const path = req.nextUrl.pathname

    if (path.startsWith('/api')) {
        const data = await req.json()
        if (path.startsWith('/api/auth')) {
            if (path.startsWith('/api/auth/login')) {

            }
            if (path.startsWith('/api/auth/signup')) {
                const { username , email , password } = data
                const result = signup({ username , email , password })
                if (result.success) {return NextResponse.next()}
                else {return NextResponse.json(result.data.message)}
            }   
        }
    }
    return NextResponse.next()
}
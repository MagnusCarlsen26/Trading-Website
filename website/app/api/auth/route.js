import { getUsers } from "@/lib/mongo/auth";
import { NextResponse } from 'next/server';

export async function GET(req) { // req is usually not needed here
      const response = await getUsers();
      return NextResponse.json(response); // Use NextResponse.json
  }
  

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { 
    const { username, password } = await req.json();

    console.log({username, password})
    console.log({ env_username: process.env.BLOG_USERNAME, env_password: process.env.PASSWORD})
    
    if (
        username === process.env.BLOG_USERNAME &&
        password === process.env.PASSWORD
    ) {
        return NextResponse.json({ token: 'authenticated-token' });
    } else {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
}
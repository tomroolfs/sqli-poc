import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: { id: payload.id, username: payload.username } });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const db = await createConnection();
    const [rows] = await db.execute(`SELECT id, username, password FROM users WHERE username = '${username}' AND password = '${password}'`);

    if (!rows.length) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const user = rows[0];
    // const match = (password === user.password);
    // if (!match) {
    //   return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    // } 
    // password matching disabled for making sql injection possible for poC purposes

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });

    const res = NextResponse.json({ success: true, token: token, userId: user.id }, { status: 200 });
    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 2 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

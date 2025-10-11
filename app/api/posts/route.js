import { createConnection } from '@/lib/db.js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET);
    const db = await createConnection();
    const [posts] = await db.execute('SELECT id, title, content FROM posts ORDER BY id DESC');
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('Posts route error:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

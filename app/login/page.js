'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (res.ok) {

      const data = await res.json();
      

      if (data.token) {

        localStorage.setItem('authToken', data.token);
        console.log('Login successful. Token stored.');

        router.push('/');
      } else {

        console.log('Login successful, but no token received.');
        router.push('/');
      }

    } else {

      const data = await res.json();
      setErr(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 border border-black rounded bg-white shadow">
        <h1 className="text-2xl mb-4 text-black">Login</h1>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        <label className="block mb-2 text-black">
          <span className="text-sm text-black">Username</span>
          <input
            className="w-full mt-1 p-2 border border-black rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4 text-black">
          <span className="text-sm text-black">Password</span>
          <input
            type="password"
            className="w-full mt-1 p-2 border border-black rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="w-full p-2 rounded bg-blue-600 text-white">Login</button>
      </form>
    </div>
  );
}
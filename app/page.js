'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const me = await fetch('/api/auth/me', { credentials: 'include' });
      if (!me.ok) {
        router.push('/login');
        return;
      }
      const res = await fetch('/api/posts', { credentials: 'include' });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onLogout}
            className="px-3 py-1 border-2 border-black rounded text-black font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <Image src="/next.svg" alt="Logo" width={180} height={38} priority />
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border rounded bg-white shadow">
              <h2 className="text-xl font-semibold mb-1 text-black">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

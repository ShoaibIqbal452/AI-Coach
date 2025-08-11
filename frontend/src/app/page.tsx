'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      router.push('/chat');
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-600">AI Gym Coach</h1>
        <p className="text-neutral-500 mt-2">Redirecting...</p>
      </div>
    </div>
  );
}

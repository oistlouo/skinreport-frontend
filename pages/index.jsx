// pages/index.jsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 홈페이지 접근 시 바로 /upload로 이동
    router.replace('/upload');
  }, []);

  return <p>Redirecting...</p>;
}

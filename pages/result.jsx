// pages/result.jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const router = useRouter();
  const { html } = router.query;

  const [decodedHtml, setDecodedHtml] = useState('');

  useEffect(() => {
    if (html) {
      setDecodedHtml(decodeURIComponent(html));
    }
  }, [html]);

  if (!decodedHtml) return <p>결과를 불러오는 중입니다...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>🔍 피부 분석 결과</h1>
      <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />
    </div>
  );
}

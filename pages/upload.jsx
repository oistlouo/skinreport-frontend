import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function UploadPage() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error details:', errorText);
        throw new Error('Server responded with error');
      }

      const data = await response.json();
      if (!data.fullHtml) {
        throw new Error('Incomplete result from server');
      }

      router.push({
        pathname: '/result',
        query: {
          html: encodeURIComponent(data.fullHtml),
          image: encodeURIComponent(data.imageUrl),
        },
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-md">
  <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
    셀카 한 장으로<br /> 피부과에서 받는 피부진단을 받아보세요
  </h2>
  <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
    정밀한 피부 분석을 위해 <br />
    <span className="block mt-2">📸 이마부터 턱까지 잘 나온 밝은 정면 셀카를 업로드해주세요.</span>
    <span className="block">🚫 모자, 앞머리, 그림자, 흐릿한 사진은 피해 주세요.</span>
  </p>

  <label className="block w-full text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-100 transition">
    📁 사진 선택하기
    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
  </label>

  {previewUrl && (
    <img
      src={previewUrl}
      alt="Preview"
      className="mt-4 w-full rounded-lg shadow-inner"
    />
  )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-8 px-6 py-3 rounded-lg text-white font-semibold transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {loading ? (
          <span className="animate-pulse">지금 피부 상태를 진단 중입니다... 최대 3분 소요</span>
        ) : (
          '분석 시작'
        )}
      </button>
    </div>
  );
}

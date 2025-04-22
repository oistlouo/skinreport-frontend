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
    <div className="w-full min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-2 text-center">
          AI Skin Diagnostics<br /> Powered by One Simple Selfie
        </h2>
        <p className="text-sm text-gray-300 text-center mb-4 leading-relaxed">
          For the most accurate results, please follow these guidelines:<br />
          <span className="block mt-2">📸 Upload a clear front-facing selfie showing your full face from forehead to chin.</span>
          <span className="block">🚫 Avoid hats, bangs, shadows, or blurry images for best analysis quality.</span>
        </p>

        <label className="block w-full text-center bg-[#2a2a2a] border border-dashed border-gray-600 rounded-lg px-4 py-3 cursor-pointer hover:bg-[#333] transition">
          📁 Upload Your Photo
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
          className={`mt-8 w-full px-6 py-3 rounded-lg text-white font-semibold transition text-center ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:opacity-90'
          }`}
        >
          {loading ? (
            <span className="animate-pulse">Analyzing your skin... This may take up to 3 minutes</span>
          ) : (
            'Start Analysis'
          )}
        </button>
      </div>
    </div>
  );
}

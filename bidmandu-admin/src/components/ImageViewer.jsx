import React from 'react';

export default function ImageViewer({ src, alt = 'Document' }) {
  if (!src) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl text-gray-400 text-sm">
        No image
      </div>
    );
  }

  // Only prepend localhost if it's a relative path (starts with /)
  const displaySrc = src.startsWith('http') ? src : `http://localhost:3000${src}`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-full">
      <img
        src={displaySrc}
        alt={alt}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
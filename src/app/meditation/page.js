'use client'

import { useState } from 'react';
import Image from 'next/image';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.css';

// List of YouTube video IDs
const videoIds = [
    'YRJ6xoiRcpQ',
  'DdIIhary3-E',
  'jyRFwFwZZ5c',
  // Add more video IDs as needed
];

export default function MeditationPage() {
  const [isOpen, setOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const openModal = (id) => {
    setCurrentVideoId(id);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Meditation Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoIds.map((videoId) => (
          <div key={videoId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                layout="fill"
                objectFit="cover"
                className="cursor-pointer"
                onClick={() => openModal(videoId)}
              />
              <button
                onClick={() => openModal(videoId)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4l12 6-12 6z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId={currentVideoId}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
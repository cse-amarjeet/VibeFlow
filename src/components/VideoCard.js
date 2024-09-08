import Image from 'next/image';

export default function VideoCard({ video, openModal }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={320}
        height={180}
        className="w-full object-cover cursor-pointer"
        onClick={() => openModal(video.id)}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{video.title}</h2>
        <button
          onClick={() => openModal(video.id)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Watch Video
        </button>
      </div>
    </div>
  );
}
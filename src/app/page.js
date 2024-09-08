import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-8 text-center text-white">Welcome to VibeFlow</h1>
      <p className="text-2xl mb-12 text-center text-white">Your journey to mental wellness starts here.</p>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-white">Breathing Exercise</h2>
          <p className="mb-6 text-white">Take a moment to relax and focus on your breath.</p>
          <Link href="/breathing-setup" className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors text-lg font-semibold">
            Start Breathing
          </Link>
        </div>
        <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-white">Wellness Assistant</h2>
          <p className="mb-6 text-white">Get personalized support for stress, anxiety, and mental well-being.</p>
          <Link href="/assistant" className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors text-lg font-semibold">
            Chat with Assistant
          </Link>
        </div>
        <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-white">Meditation</h2>
          <p className="mb-6 text-white">Explore guided meditations for inner peace.</p>
          <Link href="/meditation" className="inline-block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors text-lg font-semibold">
            Start Meditating
          </Link>
        </div>
      </div>
    </div>
  );
}

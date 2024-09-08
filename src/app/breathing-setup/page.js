'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BreathingSetup() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    breatheIn: 4,
    hold: 4,
    breatheOut: 6,
    pause: 2,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(settings).toString();
    router.push(`/breathing?${queryParams}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">VibeFlow Breathing Setup</h1>
      <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-semibold mb-4">How to Use:</h2>
        <ol className="list-decimal list-inside space-y-2 mb-6">
          <li>Find a comfortable, quiet place to sit or lie down.</li>
          <li>Follow the on-screen prompts for each breath phase.</li>
          <li>Breathe in through your nose and out through your mouth.</li>
          <li>Focus on your breath and try to clear your mind.</li>
          <li>Continue for 5-10 minutes or as long as comfortable.</li>
        </ol>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">Customize Breathing Pattern:</h3>
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')} (sec):</label>
              <input
                type="number"
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="w-16 p-1 text-black rounded"
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
            Start Breathing Exercise
          </button>
        </form>
        
        <Link href="/breathing" className="mt-4 inline-block text-center w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Use Default Settings
        </Link>
      </div>
    </div>
  );
}
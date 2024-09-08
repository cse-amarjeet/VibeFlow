import './globals.css'
import 'react-modal-video/css/modal-video.css'
import Link from 'next/link'
import { Providers } from "./providers"
import AuthButtons from "@/components/AuthButtons"

export const metadata = {
  title: 'VibeFlow',
  description: 'Your journey to mental wellness',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gradient-to-br from-teal-400 to-blue-500 min-h-screen">
        <Providers>
          <nav className="bg-white bg-opacity-10 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-2xl font-bold">VibeFlow</Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                    <Link href="/breathing-setup" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium">Breathing</Link>
                    <a href="/meditation" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium">Meditation</a>
                    <a href="#" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium">About</a>
                    <AuthButtons />
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white bg-opacity-10 text-white text-center py-4">
            <p>&copy; 2023 VibeFlow. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}

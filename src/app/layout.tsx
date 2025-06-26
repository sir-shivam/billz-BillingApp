import "./globals.css";
import { Inter } from 'next/font/google'
// import Navbar from './components/Navbar'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Billz - Invoicing Made Easy',
  description: 'Manage your invoices, stock, and business with ease',
}

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="spinner"></div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  bg-gray-50`}>
        {/* <Navbar /> */}
        <Suspense fallback={<LoadingSpinner />}>
          <main className="container min-h-svh mx-auto px-1 sm:px-4 md:px-4 lg:px-4 py-4 animate-fade-in">
            {children}
          </main>
        </Suspense>
      </body>
    </html>
  )
}



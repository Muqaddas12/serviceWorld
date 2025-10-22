'use client'
import { useState } from 'react'
import Link from 'next/link'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 flex items-center justify-center text-white font-bold">
          SM
        </div>
        <h1 className="text-lg md:text-2xl font-semibold">InstantSMM</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 items-center text-sm">
        <Link href="/services" className="hover:underline">Services</Link>
        <Link href="/pricing" className="hover:underline">Pricing</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
        <Link href="/auth/login">
          <button className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-emerald-400 text-white text-sm">
            Login/SignUp
          </button>
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 border rounded"
        >
          Menu
        </button>
      </div>

      {/* Fullscreen Top-to-Bottom Gradient Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 transform transition-transform duration-300 flex flex-col items-center justify-center gap-8 
          bg-gradient-to-b from-orange-400/90 via-amber-400/80 to-emerald-400/90 backdrop-blur-sm
          ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 border rounded text-white bg-black/20 hover:bg-black/30 transition"
        >
          Close
        </button>

        {/* Links */}
        <nav className="flex flex-col gap-6 text-xl text-white">
          <Link href="/services" className="hover:underline" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/pricing" className="hover:underline" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/contact" className="hover:underline" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/auth/login" onClick={() => setIsOpen(false)}>
            <button className="px-6 py-3 rounded-full bg-white text-orange-500 font-semibold hover:scale-105 transition-transform">
              Login/SignUp
            </button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header

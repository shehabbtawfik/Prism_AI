'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            {/* Prism SVG mark */}
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
              <defs>
                <linearGradient id="prism-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <polygon points="18,3 33,30 3,30" fill="url(#prism-grad)" opacity="0.9" />
              <polygon points="18,9 28,28 8,28" fill="rgba(10,5,20,0.6)" />
              <line x1="18" y1="28" x2="28" y2="34" stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
              <line x1="18" y1="28" x2="22" y2="35" stroke="#6366f1" strokeWidth="1.5" opacity="0.8" />
              <line x1="18" y1="28" x2="16" y2="35" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
              <line x1="18" y1="28" x2="10" y2="34" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight">Prism</span>
            <span className="font-light text-lg text-white/60 ml-1">AI</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#architecture">Architecture</NavLink>
          <NavLink href="/demo">Demo</NavLink>
          <NavLink href="/demo/showcase">
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-violet-400">
                <path d="M2 1.5v7L8.5 5z" />
              </svg>
              Showcase
            </span>
          </NavLink>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-prism-600/20 text-prism-300 border border-prism-500/30 font-mono">
            DEMO MODE
          </span>
          <Link
            href="/demo"
            className="px-4 py-2 rounded-lg btn-primary text-sm font-semibold"
          >
            <span>Launch Demo</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white/60 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 px-6 py-4 flex flex-col gap-3">
          <MobileNavLink href="/#features" onClick={() => setMobileOpen(false)}>Features</MobileNavLink>
          <MobileNavLink href="/#architecture" onClick={() => setMobileOpen(false)}>Architecture</MobileNavLink>
          <MobileNavLink href="/demo" onClick={() => setMobileOpen(false)}>Demo</MobileNavLink>
          <MobileNavLink href="/demo/showcase" onClick={() => setMobileOpen(false)}>▶ Showcase</MobileNavLink>
          <Link
            href="/demo"
            className="mt-2 px-4 py-2.5 rounded-lg btn-primary text-sm font-semibold text-center"
            onClick={() => setMobileOpen(false)}
          >
            <span>Launch Demo</span>
          </Link>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2.5 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

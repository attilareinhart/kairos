'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Kairos
          </Link>

          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="side-menu"
            onClick={() => setIsOpen((value) => !value)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? 'rotate-45' : '-translate-y-1.5 rotate-0'
                }`}
              />
              <span
                className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? '-rotate-45' : 'translate-y-1.5 rotate-0'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl items-start px-4 py-6 sm:px-6 lg:px-8">
        <main className="min-w-0 flex-1 transition-all duration-300 ease-out">
          {children}
        </main>

        <aside
          id="side-menu"
          aria-label="Sidebar navigation"
          className={`ml-0 overflow-hidden border-slate-200 bg-slate-950 text-white shadow-2xl transition-all duration-300 ease-out ${
            isOpen ? 'ml-6 w-80 shrink-0 border-l' : 'w-0 shrink-0 border-l-0'
          }`}
        >
          <div className="flex h-full min-h-[calc(100vh-7rem)] w-80 flex-col p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Navigate</p>

            <nav className="mt-8 flex flex-col gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(true)}
                    className={`rounded-2xl px-4 py-3 text-left text-base font-medium transition ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Kairos</p>
              <p className="mt-2 leading-6">A flexible app shell for building richer experiences with persistent navigation.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

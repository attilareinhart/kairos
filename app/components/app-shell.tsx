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
    <div className="min-h-screen bg-transparent text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--header-bg)] text-[var(--header-text)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-[0.25em] text-[var(--header-text)] uppercase">
            Kairos
          </Link>

          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="side-menu"
            onClick={() => setIsOpen((value) => !value)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)] bg-[var(--accent-soft)] text-[var(--header-bg)] shadow-[0_2px_8px_rgba(35,51,73,0.18)] transition hover:border-[var(--accent)] hover:text-[var(--header-text)]"
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl items-start px-4 py-6 sm:px-6 lg:px-8">
        <main className="min-w-0 flex-1 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_8px_30px_rgba(35,51,73,0.05)] transition-all duration-300 ease-out sm:p-8">
          {children}
        </main>

        <aside
          id="side-menu"
          aria-label="Sidebar navigation"
          className={`ml-0 overflow-hidden border-[var(--border)] bg-[var(--drawer-bg)] text-[var(--header-text)] shadow-[0_14px_40px_rgba(35,51,73,0.18)] transition-all duration-300 ease-out ${
            isOpen ? 'ml-6 w-80 shrink-0 border-l' : 'w-0 shrink-0 border-l-0'
          }`}
        >
          <div className="flex h-full min-h-[calc(100vh-7rem)] w-80 flex-col p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">Navigate</p>

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
                        ? 'bg-[var(--accent)]/20 text-[var(--header-text)] ring-1 ring-[var(--gold)]'
                        : 'text-[var(--header-text)] hover:bg-[var(--accent-soft)]/25 hover:text-[var(--header-text)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-[var(--border)] bg-[#375f6b]/90 p-4 text-sm text-[var(--header-text)]">
              <p className="font-semibold text-[var(--header-text)]">Kairos</p>
              <p className="mt-2 leading-6 text-[var(--header-text)]">A flexible app shell for building richer experiences with persistent navigation.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

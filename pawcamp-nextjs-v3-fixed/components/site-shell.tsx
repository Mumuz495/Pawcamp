'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, House, UserRound } from 'lucide-react';
import { ReactNode } from 'react';

const nav = [
  { href: '/', label: 'Home', icon: House },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/favorites', label: 'Saved', icon: Heart },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface shadow-lg md:my-8 md:rounded-[40px] md:border md:border-border md:shadow-[0_24px_80px_rgba(20,27,35,0.14)]">
      <div className="pointer-events-none sticky top-0 z-30 h-5 bg-gradient-to-b from-surface via-surface/70 to-transparent" />
      <main className="flex-1 px-0 pb-34 -mt-5">{children}</main>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <nav className="pointer-events-auto rounded-[30px] border border-white/60 bg-white/82 px-2 py-2 shadow-[0_18px_55px_rgba(20,27,35,0.18)] backdrop-blur-xl">
          <div className="grid grid-cols-4 gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-[22px] px-2 py-2.5 text-[11px] font-medium transition ${
                    active ? 'bg-primary text-white shadow-soft' : 'text-muted hover:bg-surface-alt hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

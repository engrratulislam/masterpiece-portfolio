'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't add left padding on ANY admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  return (
    <main className={isAdminPage ? 'min-h-screen' : 'min-h-screen lg:pl-64'}>
      {children}
    </main>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't add left padding on admin login page
  const isAdminLogin = pathname === '/admin/login';
  
  return (
    <main className={isAdminLogin ? 'min-h-screen' : 'min-h-screen lg:pl-64'}>
      {children}
    </main>
  );
}

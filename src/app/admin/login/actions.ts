'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  email: string,
  password: string,
  rememberMe: boolean
) {
  try {
    console.log('[AUTH] Attempting login for:', email);
    
    await signIn('credentials', {
      email,
      password,
      rememberMe: rememberMe.toString(),
      redirect: false,
    });

    console.log('[AUTH] Login successful for:', email);
    return { success: true };
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password' };
        default:
          return { success: false, error: 'Authentication failed' };
      }
    }
    
    // Check if error has a message property
    if (error && typeof error === 'object' && 'message' in error) {
      return { success: false, error: (error as { message: string }).message };
    }
    
    return { success: false, error: 'An unexpected error occurred' };
  }
}

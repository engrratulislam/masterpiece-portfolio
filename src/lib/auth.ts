import 'server-only';
import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { executeQuery } from './db';
import { RowDataPacket } from 'mysql2';

// Rate limiting helper
async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = new Date();
  
  interface RateLimitRow extends RowDataPacket {
    attempts: number;
    lockedUntil: Date | null;
  }

  // Check if IP is rate limited
  const rateLimits = await executeQuery<RateLimitRow[]>(
    'SELECT attempts, lockedUntil FROM rate_limits WHERE identifier = ? LIMIT 1',
    [identifier]
  );

  if (rateLimits.length > 0) {
    const rateLimit = rateLimits[0];
    
    // Check if locked
    if (rateLimit.lockedUntil && new Date(rateLimit.lockedUntil) > now) {
      return false; // Still locked
    }

    // Check if too many attempts
    if (rateLimit.attempts >= 5) {
      // Lock for 15 minutes
      const lockUntil = new Date(now.getTime() + 15 * 60 * 1000);
      await executeQuery(
        'UPDATE rate_limits SET lockedUntil = ?, attempts = attempts + 1 WHERE identifier = ?',
        [lockUntil, identifier]
      );
      return false;
    }

    // Increment attempts
    await executeQuery(
      'UPDATE rate_limits SET attempts = attempts + 1, lastAttempt = ? WHERE identifier = ?',
      [now, identifier]
    );
  } else {
    // First attempt - create record
    await executeQuery(
      'INSERT INTO rate_limits (identifier, attempts, lastAttempt) VALUES (?, 1, ?)',
      [identifier, now]
    );
  }

  return true;
}

// Reset rate limit on successful login
async function resetRateLimit(identifier: string): Promise<void> {
  await executeQuery(
    'DELETE FROM rate_limits WHERE identifier = ?',
    [identifier]
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.error('[AUTH] Missing credentials');
          throw new Error('Email and password are required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        
        console.log('[AUTH] Authorize attempt for:', email);
        
        // Get IP address for rate limiting
        const forwarded = req.headers?.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : req.headers?.get('x-real-ip') || 'unknown';
        console.log('[AUTH] IP address:', ip);

        // Check rate limit
        const isAllowed = await checkRateLimit(ip);
        if (!isAllowed) {
          console.error('[AUTH] Rate limit exceeded for IP:', ip);
          throw new Error('Too many failed login attempts. Please try again in 15 minutes.');
        }

        interface UserRow extends RowDataPacket {
          id: number;
          email: string;
          password_hash: string;
          name: string | null;
          role: string;
          isActive: boolean;
        }

        // Query user from database
        console.log('[AUTH] Querying database for user...');
        const users = await executeQuery<UserRow[]>(
          'SELECT id, email, password_hash, name, role, isActive FROM users WHERE email = ? LIMIT 1',
          [email]
        );

        if (users.length === 0) {
          console.error('[AUTH] User not found:', email);
          throw new Error('Invalid email or password');
        }

        const user = users[0];
        console.log('[AUTH] User found:', { id: user.id, email: user.email, role: user.role, isActive: user.isActive });

        // Check if user is active
        if (!user.isActive) {
          console.error('[AUTH] User inactive:', email);
          throw new Error('Account is inactive. Please contact administrator.');
        }

        // Verify password
        console.log('[AUTH] Verifying password...');
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('[AUTH] Password valid:', isValidPassword);

        if (!isValidPassword) {
          console.error('[AUTH] Invalid password for:', email);
          throw new Error('Invalid email or password');
        }

        // Reset rate limit on successful login
        await resetRateLimit(ip);
        console.log('[AUTH] Rate limit reset for IP:', ip);

        // Update last login
        await executeQuery(
          'UPDATE users SET lastLogin = ? WHERE id = ?',
          [new Date(), user.id]
        );
        console.log('[AUTH] Last login updated');

        console.log('[AUTH] Authorization successful for:', email);
        
        // Return user object
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name || user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role: string }).role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours default
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

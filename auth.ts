import type { NextAuthConfig } from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export const auth = require('next-auth').default(authConfig);

export { auth };

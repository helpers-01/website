import { decode } from 'https://deno.fresh.dev/std@v1.0/encoding/base64.ts';
import * as jose from 'https://deno.fresh.dev/x/jose@v4.11.1/index.ts';

export async function verifyJWT(token: string) {
  try {
    const jwks = jose.createRemoteJWKSet(
      new URL(`${Deno.env.get('SUPABASE_URL')}/auth/v1/jwks`)
    );

    const { payload } = await jose.jwtVerify(token, jwks, {
      issuer: 'supabase',
      audience: Deno.env.get('SUPABASE_PROJECT_REF')
    });

    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

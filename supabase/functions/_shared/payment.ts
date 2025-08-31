import * as crypto from 'https://deno.fresh.dev/std@v1.0/crypto/mod.ts';

export function verifySignature(
  body: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(body).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

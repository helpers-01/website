export async function verifySignature(
  body: string,
  signature: string,
  webhookSecret: string
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const expectedSignature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    const expectedHex = Array.from(new Uint8Array(expectedSignature)).map(b => b.toString(16).padStart(2, '0')).join('');
    return expectedHex === signature;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

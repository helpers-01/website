import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts'
import { verifyPaymentSignature } from '../_shared/utils.ts'

Deno.test('verifyPaymentSignature', async (t) => {
  await t.step('validates correct signature', () => {
    const secret = 'test_secret'
    const body = JSON.stringify({ test: 'data' })
    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    assertEquals(
      verifyPaymentSignature(body, signature, secret),
      true,
      'should validate correct signature'
    )
  })

  await t.step('rejects invalid signature', () => {
    const secret = 'test_secret'
    const body = JSON.stringify({ test: 'data' })
    const signature = 'invalid_signature'

    assertEquals(
      verifyPaymentSignature(body, signature, secret),
      false,
      'should reject invalid signature'
    )
  })
})

// Integration test simulating signup event
Deno.test('auth-signup-sync integration', async (t) => {
  await t.step('creates profile and related records', async () => {
    const testUser = {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      raw_user_meta_data: {
        role: 'provider',
        company_name: 'Test Company',
        phone: '+1234567890'
      }
    }

    const response = await fetch(
      'http://localhost:54321/functions/v1/auth-signup-sync',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'INSERT',
          record: testUser
        })
      }
    )

    assertEquals(response.status, 200)
    const result = await response.json()
    assertEquals(result.success, true)

    // Verify profile creation
    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('id', testUser.id)
      .single()

    assertNotEquals(profile, null)
    assertEquals(profile.email, testUser.email)
    assertEquals(profile.role, 'provider')

    // Verify provider record
    const { data: provider } = await supabase
      .from('providers')
      .select()
      .eq('id', testUser.id)
      .single()

    assertNotEquals(provider, null)
    assertEquals(provider.company_name, testUser.raw_user_meta_data.company_name)

    // Verify wallet creation
    const { data: wallet } = await supabase
      .from('wallets')
      .select()
      .eq('user_id', testUser.id)
      .single()

    assertNotEquals(wallet, null)
    assertEquals(wallet.balance, 0)

    // Verify audit log
    const { data: auditLog } = await supabase
      .from('audit_logs')
      .select()
      .eq('record_id', testUser.id)
      .eq('action', 'SYNC_PROFILE')
      .single()

    assertNotEquals(auditLog, null)
  })
})

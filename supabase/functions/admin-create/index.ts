import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createAdminUser } from '../_shared/admin.ts'

interface CreateAdminRequest {
  email: string
  password: string
}

serve(async (req: Request) => {
  try {
    // Get authorization token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401 }
      )
    }

    // Parse request body
    const { email, password }: CreateAdminRequest = await req.json()

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      )
    }

    // Create admin user
    const result = await createAdminUser(
      email, 
      password, 
      authHeader.replace('Bearer ', '')
    )

    if ('error' in result) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { 
          status: result.error.includes('permissions') ? 403 : 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Admin created successfully',
        id: result.id
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in admin-create endpoint:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

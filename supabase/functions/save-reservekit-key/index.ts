import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// This function securely saves a user's ReserveKit API key by encrypting it first.
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the user's auth token
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user from the token
    const { data: { user } } = await userSupabaseClient.auth.getUser()
    if (!user) throw new Error('User not found')

    // Get the raw API key from the request body
    const { apiKey } = await req.json()
    if (!apiKey) throw new Error('API key is required')

    // Create a service role client to perform the encryption and update
    const adminSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('VENA_SERVICE_ROLE_KEY') ?? ''
    )

    // Encrypt the key using pgsodium
    const { data: encryptedKey, error: encryptionError } = await adminSupabaseClient.rpc(
      'pgsodium_crypto_aead_det_encrypt',
      {
        plaintext: apiKey,
        additional: '{"service":"reservekit"}', // a.k.a. "additional authenticated data"
        key_uuid: Deno.env.get('SODIUM_KEY_ID') // The UUID of your pgsodium key
      }
    )
    if (encryptionError) throw encryptionError

    // Update the user's record with the encrypted key
    const { error: updateError } = await adminSupabaseClient
      .from('registrations')
      .update({ encrypted_reservekit_api_key: encryptedKey })
      .eq('id', user.id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ message: 'API key saved successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

await supabase.functions.invoke('save-reservekit-key', {
  body: JSON.stringify({ apiKey }),
});
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("New function version with detailed logging deployed.");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- START NEW LOGGING ---
    const requestBodyText = await req.text();
    console.log("Received raw request body:", requestBodyText);
    // --- END NEW LOGGING ---

    // Create a Supabase client with the user's auth token
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user from the token
    const { data: { user } } = await userSupabaseClient.auth.getUser()
    if (!user) throw new Error('User not found')

    // Parse the body text we logged earlier
    const bodyJSON = JSON.parse(requestBodyText);
    const apiKey = bodyJSON.apiKey;
    console.log("Parsed API key:", apiKey ? "Key found" : "Key NOT found");

    if (!apiKey) throw new Error('API key is required in the JSON body')

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
        additional: '{"service":"reservekit"}',
        key_uuid: Deno.env.get('SODIUM_KEY_ID')
      }
    )
    if (encryptionError) {
      console.error("Encryption error:", encryptionError);
      throw encryptionError;
    }

    // Update the user's record with the encrypted key
    const { error: updateError } = await adminSupabaseClient
      .from('registrations')
      .update({ encrypted_reservekit_api_key: encryptedKey })
      .eq('id', user.id)

    if (updateError) {
      console.error("Database update error:", updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ message: 'API key saved successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Caught an error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Keep as 400 to see if it changes
    })
  }
})

await supabase.functions.invoke('save-reservekit-key', {
  body: JSON.stringify({ apiKey }),
});
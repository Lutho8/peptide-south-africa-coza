import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RENPHO_API_BASE = 'https://renpho.qnclouds.com';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    const { action, email, passwordHash } = await req.json();

    if (action === 'connect') {
      // Validate credentials with Renpho API
      const authResponse = await fetch(`${RENPHO_API_BASE}/api/v3/users/sign_in.json?app_id=Renpho`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secure_flag: '1',
          email: email,
          password: passwordHash,
        }),
      });

      const authData = await authResponse.json();

      if (!authData.terminal_user_session_key) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid Renpho credentials' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Store credentials (in production, these should be encrypted)
      const { error: storeError } = await supabase
        .from('renpho_credentials')
        .upsert({
          user_id: userId,
          email_encrypted: email, // In production: encrypt this
          password_hash_encrypted: passwordHash, // In production: encrypt this
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (storeError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to store credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'sync') {
      // Get stored credentials
      const { data: creds } = await supabase
        .from('renpho_credentials')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!creds) {
        return new Response(
          JSON.stringify({ success: false, error: 'Renpho not connected' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Authenticate with Renpho
      const authResponse = await fetch(`${RENPHO_API_BASE}/api/v3/users/sign_in.json?app_id=Renpho`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secure_flag: '1',
          email: creds.email_encrypted,
          password: creds.password_hash_encrypted,
        }),
      });

      const authData = await authResponse.json();
      const sessionKey = authData.terminal_user_session_key;

      if (!sessionKey) {
        return new Response(
          JSON.stringify({ success: false, error: 'Renpho authentication failed' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get scale users
      const usersResponse = await fetch(
        `${RENPHO_API_BASE}/api/v3/scale_users/list_scale_user?locale=en&terminal_user_session_key=${sessionKey}`
      );
      const usersData = await usersResponse.json();
      const scaleUserId = usersData.scale_users?.[0]?.user_id;

      if (!scaleUserId) {
        return new Response(
          JSON.stringify({ success: false, error: 'No scale user found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get measurements from last 30 days
      const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
      const measurementsResponse = await fetch(
        `${RENPHO_API_BASE}/api/v2/measurements/list.json?user_id=${scaleUserId}&last_at=${thirtyDaysAgo}&locale=en&app_id=Renpho&terminal_user_session_key=${sessionKey}`
      );
      const measurementsData = await measurementsResponse.json();

      // Update last sync time
      await supabase
        .from('renpho_credentials')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', userId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          measurements: measurementsData.last_ary || [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Renpho sync error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

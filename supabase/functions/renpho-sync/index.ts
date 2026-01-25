import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";
import md5 from "https://esm.sh/md5@2.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RENPHO_API_BASE = 'https://renpho.qnclouds.com';

// Hash password using MD5 (Renpho uses MD5 hashed passwords)
function hashPasswordMD5(password: string): string {
  return md5(password);
}

// Common headers for Renpho API requests
const renphoHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'Renpho/3.8.0 (iPhone; iOS 17.0)',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
};

function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

async function renphoSignIn(email: string, passwordHash: string) {
  // Renpho API is finicky; we try the most common working formats.
  const normalizedEmail = normalizeEmail(email);

  const baseParams = {
    app_id: 'Renpho',
    email: normalizedEmail,
    password: passwordHash,
    secure_flag: '1',
  };

  const headers = {
    'User-Agent': 'okhttp/3.6.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Attempt 1: POST form body (common for this endpoint)
  const bodyParams = new URLSearchParams(baseParams);
  let res = await fetch(`${RENPHO_API_BASE}/api/v3/users/sign_in.json`, {
    method: 'POST',
    headers,
    body: bodyParams,
  });

  let text = await res.text();

  // If Renpho returns a generic 500, try querystring variant as fallback
  if (res.status >= 500) {
    const qs = new URLSearchParams(baseParams);
    res = await fetch(`${RENPHO_API_BASE}/api/v3/users/sign_in.json?${qs.toString()}`, {
      method: 'POST',
      headers: {
        'User-Agent': 'okhttp/3.6.0',
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });
    text = await res.text();
  }

  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    // fall through
  }

  return { res, text, json };
}

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
    const { action, email, password } = await req.json();

    if (action === 'connect') {
      console.log('Attempting to connect Renpho account for user:', userId);

      const normalizedEmail = normalizeEmail(email);
      if (!normalizedEmail || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Email and password are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Hash the password using MD5 (Renpho expects MD5 hashed passwords)
      const passwordHash = hashPasswordMD5(password);
      console.log('Password hashed successfully');

      console.log('Calling Renpho auth API');
      const { res: authResponse, text: authText, json: authData } = await renphoSignIn(normalizedEmail, passwordHash);
      console.log('Renpho auth response status:', authResponse.status);

      if (!authData) {
        console.error('Failed to parse Renpho response (non-JSON)');
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid response from Renpho API' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If Renpho itself is erroring, don't mislabel as credential failure.
      const renphoStatus = typeof authData?.status === 'number' ? authData.status : null;
      if (authResponse.status >= 500 || (renphoStatus !== null && renphoStatus >= 500)) {
        const msg = authData?.error || authData?.message || 'Renpho API error. Please try again.';
        console.error('Renpho auth upstream error:', msg);
        return new Response(
          JSON.stringify({ success: false, error: msg }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!authData.terminal_user_session_key) {
        const errorMsg = authData.error_msg || authData.message || 'Invalid Renpho credentials';
        console.error('Renpho auth failed:', errorMsg);
        return new Response(
          JSON.stringify({ success: false, error: errorMsg }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Renpho authentication successful');

      // Store credentials (store the hash, not the plain password)
      const { error: storeError } = await supabase
        .from('renpho_credentials')
        .upsert({
          user_id: userId,
          email_encrypted: normalizedEmail,
          password_hash_encrypted: passwordHash,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (storeError) {
        console.error('Failed to store credentials:', storeError);
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
      console.log('Starting Renpho sync for user:', userId);
      
      // Get stored credentials
      const { data: creds } = await supabase
        .from('renpho_credentials')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!creds) {
        return new Response(
          JSON.stringify({ success: false, error: 'Renpho not connected. Please connect your account first.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Authenticate with Renpho
      const { res: authResponse, json: authData } = await renphoSignIn(
        creds.email_encrypted,
        creds.password_hash_encrypted,
      );
      console.log('Renpho sync auth response status:', authResponse.status);

      if (!authData) {
        console.error('Failed to parse Renpho auth response (non-JSON)');
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid response from Renpho API' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const sessionKey = authData.terminal_user_session_key;

      if (!sessionKey) {
        const errorMsg = authData.error_msg || authData.message || 'Renpho authentication failed';
        console.error('Renpho sync auth failed:', errorMsg);
        return new Response(
          JSON.stringify({ success: false, error: errorMsg }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get scale users
      const usersResponse = await fetch(
        `${RENPHO_API_BASE}/api/v3/scale_users/list_scale_user?locale=en&terminal_user_session_key=${sessionKey}`,
        { headers: renphoHeaders }
      );
      const usersText = await usersResponse.text();
      console.log('Renpho users response:', usersText);
      
      let usersData;
      try {
        usersData = JSON.parse(usersText);
      } catch (e) {
        console.error('Failed to parse users response:', e);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to get scale users' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const scaleUserId = usersData.scale_users?.[0]?.user_id;

      if (!scaleUserId) {
        return new Response(
          JSON.stringify({ success: false, error: 'No scale user found. Make sure you have used your Renpho scale at least once.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get measurements from last 30 days
      const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
      const measurementsResponse = await fetch(
        `${RENPHO_API_BASE}/api/v2/measurements/list.json?user_id=${scaleUserId}&last_at=${thirtyDaysAgo}&locale=en&app_id=Renpho&terminal_user_session_key=${sessionKey}`,
        { headers: renphoHeaders }
      );
      const measurementsText = await measurementsResponse.text();
      console.log('Renpho measurements response length:', measurementsText.length);
      
      let measurementsData;
      try {
        measurementsData = JSON.parse(measurementsText);
      } catch (e) {
        console.error('Failed to parse measurements response:', e);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to get measurements' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update last sync time
      await supabase
        .from('renpho_credentials')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('user_id', userId);

      const measurements = measurementsData.last_ary || [];
      console.log('Found', measurements.length, 'measurements');

      return new Response(
        JSON.stringify({ 
          success: true, 
          measurements 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Renpho sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

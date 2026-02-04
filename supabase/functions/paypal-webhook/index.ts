import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PayPal webhook event types we care about
const SUBSCRIPTION_EVENTS = {
  ACTIVATED: 'BILLING.SUBSCRIPTION.ACTIVATED',
  CANCELLED: 'BILLING.SUBSCRIPTION.CANCELLED',
  EXPIRED: 'BILLING.SUBSCRIPTION.EXPIRED',
  SUSPENDED: 'BILLING.SUBSCRIPTION.SUSPENDED',
  PAYMENT_FAILED: 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
  RENEWED: 'PAYMENT.SALE.COMPLETED',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    console.log('PayPal Webhook received:', eventType);

    // Initialize Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Extract subscription details
    const subscriptionId = resource?.id || resource?.billing_agreement_id;
    const payerId = resource?.subscriber?.payer_id || resource?.payer?.payer_info?.payer_id;
    const planId = resource?.plan_id;

    if (!subscriptionId) {
      console.log('No subscription ID found in webhook');
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the membership by PayPal subscription ID
    const { data: membership, error: findError } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('paypal_subscription_id', subscriptionId)
      .maybeSingle();

    // Handle different event types
    switch (eventType) {
      case SUBSCRIPTION_EVENTS.ACTIVATED:
        if (membership) {
          // Update existing membership
          await supabase
            .from('user_memberships')
            .update({
              status: 'active',
              started_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('paypal_subscription_id', subscriptionId);
        }
        console.log('Subscription activated:', subscriptionId);
        break;

      case SUBSCRIPTION_EVENTS.CANCELLED:
        if (membership) {
          await supabase
            .from('user_memberships')
            .update({
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
            })
            .eq('paypal_subscription_id', subscriptionId);
        }
        console.log('Subscription cancelled:', subscriptionId);
        break;

      case SUBSCRIPTION_EVENTS.EXPIRED:
        if (membership) {
          await supabase
            .from('user_memberships')
            .update({
              status: 'expired',
            })
            .eq('paypal_subscription_id', subscriptionId);
        }
        console.log('Subscription expired:', subscriptionId);
        break;

      case SUBSCRIPTION_EVENTS.SUSPENDED:
      case SUBSCRIPTION_EVENTS.PAYMENT_FAILED:
        if (membership) {
          await supabase
            .from('user_memberships')
            .update({
              status: 'pending',
            })
            .eq('paypal_subscription_id', subscriptionId);
        }
        console.log('Subscription suspended/payment failed:', subscriptionId);
        break;

      case SUBSCRIPTION_EVENTS.RENEWED:
        if (membership) {
          // Extend membership by 30 days
          await supabase
            .from('user_memberships')
            .update({
              status: 'active',
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
            .eq('paypal_subscription_id', subscriptionId);
        }
        console.log('Subscription renewed:', subscriptionId);
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

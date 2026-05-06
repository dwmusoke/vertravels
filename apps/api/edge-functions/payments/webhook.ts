import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.8.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('Missing Stripe signature');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingRef = paymentIntent.metadata?.booking_ref;

        if (bookingRef) {
          // Update transaction status
          await supabaseClient
            .from('transactions')
            .update({
              status: 'success',
              gateway_response: paymentIntent,
            })
            .eq('transaction_id', paymentIntent.id);

          // Update booking status
          await supabaseClient
            .from('flights_bookings')
            .update({
              payment_status: 'paid',
              booking_status: 'confirmed',
              transaction_id: paymentIntent.id,
              payment_gateway: 'stripe',
            })
            .eq('booking_ref_no', bookingRef);

          console.log(`Payment succeeded for booking ${bookingRef}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const bookingRef = paymentIntent.metadata?.booking_ref;

        if (bookingRef) {
          // Update transaction status
          await supabaseClient
            .from('transactions')
            .update({
              status: 'failed',
              gateway_response: paymentIntent,
            })
            .eq('transaction_id', paymentIntent.id);

          // Update booking status
          await supabaseClient
            .from('flights_bookings')
            .update({
              payment_status: 'unpaid',
              booking_status: 'pending',
            })
            .eq('booking_ref_no', bookingRef);

          console.log(`Payment failed for booking ${bookingRef}`);
        }
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const bookingRef = charge.metadata?.booking_ref;

        if (bookingRef) {
          // Update transaction status
          await supabaseClient
            .from('transactions')
            .update({
              status: 'refunded',
            })
            .eq('transaction_id', charge.payment_intent);

          // Update booking status
          await supabaseClient
            .from('flights_bookings')
            .update({
              payment_status: 'refunded',
              booking_status: 'cancelled',
            })
            .eq('booking_ref_no', bookingRef);

          console.log(`Payment refunded for booking ${bookingRef}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: corsHeaders, status: 400 }
    );
  }
});

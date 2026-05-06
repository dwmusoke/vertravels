import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { amount, currency, booking_ref, customer_email } = await req.json();

    // Validate required fields
    if (!amount || !currency || !booking_ref) {
      throw new Error('Missing required fields');
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

    // Create Stripe payment intent
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency: currency.toLowerCase(),
        description: `VerTravels Booking ${booking_ref}`,
        metadata: JSON.stringify({
          booking_ref,
          customer_email,
        }),
      }),
    });

    const paymentIntent = await stripeResponse.json();

    if (paymentIntent.error) {
      throw new Error(paymentIntent.error.message);
    }

    // Store transaction in database
    const { error: dbError } = await supabaseClient.from('transactions').insert({
      transaction_id: paymentIntent.id,
      booking_ref_no: booking_ref,
      booking_type: 'payment',
      amount: amount,
      currency: currency,
      payment_gateway: 'stripe',
      payment_method: 'card',
      status: 'pending',
      transaction_type: 'purchase',
      description: `Payment for booking ${booking_ref}`,
      gateway_response: paymentIntent,
    });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating Stripe payment:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create payment' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

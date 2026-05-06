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
    const { amount, currency, booking_ref, customer } = await req.json();

    // Validate required fields
    if (!amount || !currency || !booking_ref || !customer?.email) {
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

    // Generate transaction reference
    const txRef = `VT-${booking_ref}-${Date.now()}`;

    // Create Flutterwave payment
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: amount,
        currency: currency.toUpperCase(),
        redirect_url: `${Deno.env.get('SITE_URL')}/payment/success?gateway=flutterwave&booking_ref=${booking_ref}`,
        payment_options: 'card, mobilemoneyghana, ussd',
        customer: {
          email: customer.email,
          name: customer.name || 'Customer',
        },
        customizations: {
          title: 'VerTravels Booking Payment',
          description: `Payment for booking ${booking_ref}`,
          logo: `${Deno.env.get('SITE_URL')}/logo.png`,
        },
        meta: {
          booking_ref: booking_ref,
          customer_email: customer.email,
        },
      }),
    });

    const paymentData = await flutterwaveResponse.json();

    if (paymentData.status !== 'success') {
      throw new Error(paymentData.message || 'Failed to create Flutterwave payment');
    }

    // Store transaction in database
    const { error: dbError } = await supabaseClient.from('transactions').insert({
      transaction_id: txRef,
      booking_ref_no: booking_ref,
      booking_type: 'payment',
      amount: amount,
      currency: currency,
      payment_gateway: 'flutterwave',
      payment_method: 'card',
      status: 'pending',
      transaction_type: 'purchase',
      description: `Payment for booking ${booking_ref}`,
      gateway_response: paymentData,
    });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({
        paymentUrl: paymentData.data.link,
        txRef: txRef,
        amount: amount,
        currency: currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating Flutterwave payment:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create payment' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

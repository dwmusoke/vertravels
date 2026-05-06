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
    const { gateway, booking_ref, transaction_id } = await req.json();

    if (!gateway || !booking_ref) {
      throw new Error('Missing required fields');
    }

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

    let verified = false;
    let paymentDetails = null;

    // Verify payment based on gateway
    if (gateway === 'flutterwave') {
      // Verify with Flutterwave API
      const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('FLUTTERWAVE_SECRET_KEY')}`,
          },
        }
      );
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data.status === 'successful') {
        verified = true;
        paymentDetails = data.data;
      }
    } else if (gateway === 'stripe') {
      // Verify with Stripe API
      const response = await fetch(
        `https://api.stripe.com/v1/payment_intents/${transaction_id}`,
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
          },
        }
      );
      
      const paymentIntent = await response.json();
      
      if (paymentIntent.status === 'succeeded') {
        verified = true;
        paymentDetails = paymentIntent;
      }
    } else if (gateway === 'paypal') {
      // Verify with PayPal API (simplified)
      verified = true; // In production, verify with PayPal API
    } else if (gateway === 'bank_transfer' || gateway === 'wallet') {
      // These are manual/internal payments
      verified = true;
    }

    // Update transaction status if verified
    if (verified) {
      const { error: updateError } = await supabaseClient
        .from('transactions')
        .update({
          status: 'success',
          gateway_response: paymentDetails,
        })
        .eq('transaction_id', transaction_id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Update booking status
      const { error: bookingError } = await supabaseClient
        .from('flights_bookings')
        .update({
          payment_status: 'paid',
          booking_status: 'confirmed',
          transaction_id: transaction_id,
          payment_gateway: gateway,
        })
        .eq('booking_ref_no', booking_ref);

      if (bookingError) {
        console.error('Error updating booking:', bookingError);
        // Try other booking tables
        await supabaseClient
          .from('hotels_bookings')
          .update({
            payment_status: 'paid',
            booking_status: 'confirmed',
            transaction_id: transaction_id,
            payment_gateway: gateway,
          })
          .eq('booking_ref_no', booking_ref);
      }
    }

    return new Response(
      JSON.stringify({
        verified,
        gateway,
        booking_ref,
        transaction_id,
        payment_details: paymentDetails,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ 
        verified: false, 
        error: error.message || 'Verification failed' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

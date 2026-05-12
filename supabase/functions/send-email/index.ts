import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, customerEmail, customerName, status, trackingId, trackingUrl, totalAmount } = await req.json()

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in edge function secrets");
    }

    let subject = "";
    let htmlContent = "";

    if (status === 'confirmed') {
      subject = `Order Confirmed! #${orderId.slice(0, 8)}`;
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px;">
          <tr>
            <td style="background-color: #0f172a; padding: 40px 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Shades By Mahiee</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #0f172a; font-size: 24px; margin-top: 0; margin-bottom: 24px;">Order Confirmed! 🎉</h2>
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">Hi ${customerName},</p>
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">Thank you for shopping with us! We've received your order and are getting it ready for shipment.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Order Information</p>
                <p style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;"><strong>Order ID:</strong> #${orderId.slice(0, 8)}</p>
                <p style="margin: 0; color: #0f172a; font-size: 16px;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
              </div>

              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 8px;">We will send you another email with tracking details as soon as your package ships.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 30px; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">Stay stylish,</p>
              <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 4px 0 0 0;">The Shades By Mahiee Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
    } else if (status === 'shipped') {
      subject = `Your Order has Shipped! #${orderId.slice(0, 8)}`;
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px;">
          <tr>
            <td style="background-color: #4f46e5; padding: 40px 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Shades By Mahiee</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #0f172a; font-size: 24px; margin-top: 0; margin-bottom: 24px;">Your order has shipped! 🚚</h2>
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">Hi ${customerName},</p>
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">Great news! Your order <strong>#${orderId.slice(0, 8)}</strong> has been handed over to our delivery partners and is on its way to you.</p>
              
              <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 32px 24px; margin-bottom: 32px; text-align: center;">
                <p style="margin: 0 0 12px 0; color: #4f46e5; font-size: 14px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Tracking ID</p>
                <p style="margin: 0 0 24px 0; color: #1e1b4b; font-size: 28px; font-weight: 800; font-family: monospace; letter-spacing: 2px;">${trackingId || 'N/A'}</p>
                
                ${trackingUrl ? `
                <a href="${trackingUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Track Your Package</a>
                ` : trackingId ? `
                <a href="https://www.google.com/search?q=track+${trackingId}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Search Tracking ID</a>
                ` : ''}
              </div>

              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 8px;">Thank you for your purchase. We hope you love your new items!</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 30px; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">Stay stylish,</p>
              <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 4px 0 0 0;">The Shades By Mahiee Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
    } else {
      return new Response(JSON.stringify({ message: "Status ignored for emails" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Shades By Mahiee <onboarding@resend.dev>', // Change this to updates@shadesbymahiee.com once you verify your domain in Resend
        to: [customerEmail],
        subject: subject,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
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

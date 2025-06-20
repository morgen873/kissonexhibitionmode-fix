
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  recipeName: string;
  recipeImageUrl: string;
  qrData: string;
  userEmail: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipeName, recipeImageUrl, qrData, userEmail }: EmailRequest = await req.json()

    // For now, we'll use a simple email service simulation
    // In production, you would integrate with a service like Resend, SendGrid, etc.
    console.log(`Sending recipe "${recipeName}" to ${userEmail}`)
    console.log(`Recipe image: ${recipeImageUrl}`)
    console.log(`QR data: ${qrData}`)

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000))

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Recipe "${recipeName}" sent to ${userEmail}` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending recipe email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

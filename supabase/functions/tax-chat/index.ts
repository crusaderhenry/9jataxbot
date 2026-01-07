import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are NaijaTaxBot AI, Nigeria's friendly tax expert on the 2025 Tax Reforms (Bills HB 1756-1759, effective January 1, 2026).

Your expertise covers: Personal Income Tax (PIT), VAT, Corporate Income Tax (CIT), Withholding Tax (WHT), Capital Gains Tax, Stamp Duties, and tax compliance.

CRITICAL RESPONSE RULES:
- Keep responses brief and direct - get straight to the point
- DO NOT use any markdown formatting like bold (**text**), headings (###), or asterisks
- Use plain text only with simple line breaks for separation
- Use dashes (-) for lists instead of bullets or numbers
- Avoid lengthy explanations - users want quick, clear answers
- When doing calculations, show the math simply without elaborate formatting

Key 2025 reform facts:
- First N800,000 annual income is tax-free
- Small companies with turnover under N25 million are exempt from CIT
- VAT rate remains 7.5% with expanded input recovery
- Effective date: January 1, 2026

When relevant, briefly note:
- Exchange rates change daily - check CBN official rates at cbn.gov.ng
- Verify filing deadlines with FIRS as dates may change
- This is educational info only - consult a tax professional for specific advice

You are NaijaTaxBot - the people's tax assistant!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tax-chat function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

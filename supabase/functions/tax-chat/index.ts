import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are GreenTax AI, Nigeria's expert on the 2025 Tax Reforms (Bills HB 1756-1759, effective January 1, 2026).

Your role:
- Answer questions about Nigeria's 2025 tax reforms clearly and accurately
- Explain how the new tax brackets, rates, and rules affect different income levels
- Provide practical examples when helpful
- Always cite which Bill or section you're referencing when applicable
- Be concise but thorough

Key areas you cover:
1. Personal Income Tax (PIT) changes
2. Value Added Tax (VAT) modifications
3. Corporate Income Tax adjustments
4. Withholding Tax updates
5. Tax exemptions and reliefs
6. Compliance requirements

Important notes:
- These are the official Bills passed by the National Assembly
- Effective date is January 1, 2026
- Always clarify that you provide educational information, not legal/financial advice
- Recommend consulting a tax professional for specific situations

Keep responses friendly, professional, and focused on helping Nigerians understand their tax obligations under the new laws.`;

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
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1024,
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

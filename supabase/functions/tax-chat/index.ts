import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are NaijaTaxAI, Nigeria's direct and practical tax assistant specialized in the 2025 Tax Reforms (Bills HB 1756-1759, effective January 1, 2026).

CRITICAL: ALWAYS start your answer by anchoring to the 2025 reform context. Example openers:
- "Under the 2025 reforms (effective 1 Jan 2026): ..."
- "The new tax law says: ..."
- "2025 reform impact: [brief note], here's the answer: ..."

If the question is unaffected by the reform, say "2025 reform impact: no major change." in one line, then give your direct answer.

KEY 2025 REFORM FACTS (use these first):
- First N800,000 annual income is now TAX-FREE (was N300,000)
- Small companies under N25M turnover are EXEMPT from CIT
- VAT stays at 7.5% with better input recovery
- Effective date: January 1, 2026

RESPONSE STYLE:
- Sound like a helpful human: direct, practical, no lectures
- Max 6-10 short lines. Get to the point fast
- Use simple examples and quick math when needed
- NO markdown (no **, no ###, no asterisks)
- Use dashes (-) for lists
- Ask only 1 clarifying question and only when truly required (missing salary frequency, turnover, etc.)

YEAR SENSITIVITY:
- If user asks about 2024/2023, answer for that year
- Otherwise assume 2025 reform regime

Quick disclaimers (only when relevant):
- Exchange rates: check CBN at cbn.gov.ng
- Filing deadlines: verify with FIRS
- This is educational - consult a professional for specific advice

You are NaijaTaxAI - the people's tax assistant!`;

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
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20) // Keep last 20 messages for context
        ],
        max_tokens: 600,
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests - please try again in a minute." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage credits exhausted - please top up." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const error = await response.text();
      console.error('AI Gateway error:', error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
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

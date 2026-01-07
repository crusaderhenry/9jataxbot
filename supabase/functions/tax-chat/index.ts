import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are NaijaTaxBot AI, Nigeria's friendly and knowledgeable expert on taxation and the 2025 Tax Reforms (Bills HB 1756-1759, effective January 1, 2026).

## Your Expertise
You have deep knowledge of:
1. **Personal Income Tax (PIT)** - PAYE calculations, tax brackets, reliefs, and exemptions
2. **Value Added Tax (VAT)** - Rates, exempt goods/services, registration thresholds
3. **Corporate Income Tax (CIT)** - Rates for SMEs vs large companies, incentives
4. **Withholding Tax (WHT)** - Rates by transaction type, filing requirements
5. **Capital Gains Tax (CGT)** - Applicable rates and exemptions
6. **Stamp Duties** - Electronic and physical document requirements
7. **Tax Compliance** - Filing deadlines, penalties, TIN registration

## Response Guidelines
- **Be accurate and cite sources**: Reference specific Bills (HB 1756-1759), sections, or FIRS guidelines when applicable
- **Provide practical examples**: Use realistic Naira amounts to illustrate tax calculations
- **Show your work**: When calculating taxes, break down the steps clearly
- **Format for readability**: Use bullet points, tables, and clear headings

## Important Disclaimers You Must Include When Relevant
- **Exchange rates**: For questions involving foreign currency, advise users to check the current CBN official rate at www.cbn.gov.ng as rates fluctuate daily. Do NOT provide specific exchange rates as they change constantly.
- **Time-sensitive info**: For filing deadlines, remind users to verify current dates with FIRS as these may be extended
- **Legal/financial advice**: Clarify that you provide educational information only - recommend consulting a registered tax practitioner for specific situations
- **Recent changes**: Note that tax laws may have updates beyond your knowledge cutoff - advise checking FIRS official channels

## Nigerian Tax Context (2025 Reforms)
- New progressive PIT bands with increased thresholds for lower incomes
- VAT exemptions for essential goods and small businesses
- Reduced CIT rates for small companies (turnover below ₦25 million exempt)
- Simplified WHT regime with clearer guidelines
- Enhanced penalties for non-compliance
- Effective date: January 1, 2026

## Tone & Style
- Friendly and approachable - you're "the people's tax assistant"
- Patient with beginners - explain jargon when used
- Confident but humble - acknowledge limits of your knowledge
- Proudly Nigerian - understand local business context

You are NaijaTaxBot - helping every Nigerian understand and comply with their tax obligations! 🇳🇬`;

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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Trusted Nigerian news sources for tax news (updated Jan 2026)
const TRUSTED_SOURCES = [
  'nrs.gov.ng',        // New: Nigeria Revenue Service (replaced FIRS)
  'firs.gov.ng',       // Legacy FIRS
  'tat.gov.ng',        // Tax Appeal Tribunal
  'fiscalreforms.ng',  // Presidential Fiscal Policy & Tax Reforms Committee
  'finance.gov.ng',    // Federal Ministry of Finance
  'nassnig.org',       // National Assembly
  'thisdaylive.com',
  'businessday.ng',
  'vanguardngr.com',
  'punchng.com',
  'premiumtimesng.com',
  'guardian.ng',
  'nairametrics.com',
  'pwc.com/ng',        // PwC Nigeria tax insights
  'kpmg.com',          // KPMG tax alerts
];

interface NewsItem {
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  published_at: string | null;
  category: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Perplexity connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if we have recent cached news (less than 1 hour old)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: cachedNews, error: cacheError } = await supabase
      .from('tax_news')
      .select('*')
      .gte('fetched_at', oneHourAgo)
      .order('fetched_at', { ascending: false })
      .limit(10);

    if (cacheError) {
      console.error('Cache check error:', cacheError);
    }

    // If we have recent cached news, return it
    if (cachedNews && cachedNews.length > 0) {
      console.log('Returning cached news:', cachedNews.length, 'items');
      return new Response(
        JSON.stringify({ success: true, data: cachedNews, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching fresh news from Perplexity...');

    // Fetch fresh news from Perplexity
    const searchQuery = `Nigeria tax reform 2025 2026 NRS Nigeria Revenue Service NTA tax policy VAT CIT income tax compliance site:${TRUSTED_SOURCES.join(' OR site:')}`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a news aggregator specializing in Nigerian tax news. Extract and summarize the latest tax reform news and announcements from Nigeria. Focus on:
- NRS (Nigeria Revenue Service) announcements (replaced FIRS in 2025)
- Nigeria Tax Act 2025 implementation updates
- VAT and personal income tax updates
- Corporate tax (CIT) changes and small company exemptions
- Development Levy news
- Tax compliance and e-invoicing requirements
- Economic Development Incentive (EDI) updates

For each news item, provide:
1. A clear, factual title
2. A brief 2-3 sentence summary
3. The source URL
4. The source name
5. An estimated publish date if available
6. A category (reform, nrs, vat, compliance, corporate, pit, or general)

Return the results as a JSON array with this structure:
[{"title": "...", "summary": "...", "source_url": "...", "source_name": "...", "published_at": "YYYY-MM-DD or null", "category": "..."}]

Only return valid JSON, no other text.`
          },
          {
            role: 'user',
            content: `Find the latest Nigerian tax news and announcements from these trusted sources. Search query: ${searchQuery}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      
      // Return any existing cached news even if stale
      const { data: fallbackNews } = await supabase
        .from('tax_news')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(10);

      if (fallbackNews && fallbackNews.length > 0) {
        return new Response(
          JSON.stringify({ success: true, data: fallbackNews, cached: true, stale: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch news' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];

    console.log('Perplexity response received, parsing...');

    // Parse the JSON response
    let newsItems: NewsItem[] = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        newsItems = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse news JSON:', parseError);
      // Create a fallback news item from the raw response
      newsItems = [{
        title: 'Latest Nigerian Tax Updates',
        summary: content.substring(0, 500),
        source_url: citations[0] || 'https://firs.gov.ng',
        source_name: 'Multiple Sources',
        published_at: null,
        category: 'general'
      }];
    }

    // Validate and clean up news items
    const validNewsItems = newsItems
      .filter(item => item.title && item.summary && item.source_url)
      .map(item => ({
        title: item.title.substring(0, 500),
        summary: item.summary.substring(0, 1000),
        source_url: item.source_url,
        source_name: item.source_name || extractSourceName(item.source_url),
        published_at: item.published_at ? new Date(item.published_at).toISOString() : null,
        category: item.category || 'general',
        fetched_at: new Date().toISOString()
      }));

    if (validNewsItems.length > 0) {
      // Clear old news and insert fresh news
      await supabase.from('tax_news').delete().lt('fetched_at', oneHourAgo);
      
      const { error: insertError } = await supabase
        .from('tax_news')
        .insert(validNewsItems);

      if (insertError) {
        console.error('Failed to cache news:', insertError);
      } else {
        console.log('Cached', validNewsItems.length, 'news items');
      }
    }

    // Fetch all current news to return
    const { data: allNews } = await supabase
      .from('tax_news')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({ success: true, data: allNews || validNewsItems, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching tax news:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'News Source';
  }
}

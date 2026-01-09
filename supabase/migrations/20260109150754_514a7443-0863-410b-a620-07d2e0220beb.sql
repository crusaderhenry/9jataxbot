-- Create table to cache tax news articles
CREATE TABLE public.tax_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  category TEXT DEFAULT 'general',
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security with public read access (news is public content)
ALTER TABLE public.tax_news ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read news
CREATE POLICY "Allow public read access to tax news" 
ON public.tax_news 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_tax_news_fetched_at ON public.tax_news(fetched_at DESC);
CREATE INDEX idx_tax_news_category ON public.tax_news(category);
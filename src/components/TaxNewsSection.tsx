import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  published_at: string | null;
  category: string;
  fetched_at: string;
}

const TaxNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const { data, error: funcError } = await supabase.functions.invoke('fetch-tax-news');

      if (funcError) {
        throw new Error(funcError.message);
      }

      if (data?.success && data?.data) {
        setNews(data.data.slice(0, 4));
      } else {
        throw new Error(data?.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      reform: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      firs: 'bg-green-500/20 text-green-400 border-green-500/30',
      vat: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      compliance: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      corporate: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      general: 'bg-primary/20 text-primary border-primary/30',
    };
    return colors[category] || colors.general;
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">Tax News & Updates</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-secondary/30 border-border">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">Tax News & Updates</h2>
            </div>
          </div>
          <Card className="bg-destructive/10 border-destructive/30">
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <span className="text-muted-foreground">{error}</span>
              <Button variant="outline" size="sm" onClick={() => fetchNews(true)}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-display font-bold">Tax News & Updates</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNews(true)}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/news">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {news.length === 0 ? (
          <Card className="bg-secondary/30 border-border">
            <CardContent className="flex items-center justify-center py-8">
              <span className="text-muted-foreground">No news available at the moment</span>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {news.map((item) => (
              <Card 
                key={item.id} 
                className="bg-secondary/30 border-border hover:border-primary/50 transition-colors group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.published_at || item.fetched_at)}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.summary}
                  </p>
                  <a 
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {item.source_name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TaxNewsSection;

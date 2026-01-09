import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink, RefreshCw, Clock, AlertCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useModal } from "@/contexts/ModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'reform', label: 'Tax Reform' },
  { value: 'firs', label: 'FIRS' },
  { value: 'vat', label: 'VAT' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'general', label: 'General' },
];

const TaxNews = () => {
  const { openChat, openCalculator } = useModal();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
        setNews(data.data);
        setFilteredNews(data.data);
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

  useEffect(() => {
    let filtered = news;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.source_name?.toLowerCase().includes(query)
      );
    }

    setFilteredNews(filtered);
  }, [news, selectedCategory, searchQuery]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        weekday: 'short',
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenChat={openChat} onOpenCalculator={openCalculator} />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Newspaper className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-display font-bold">Tax News & Updates</h1>
                  <p className="text-muted-foreground">Latest Nigerian tax reform news from verified sources</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => fetchNews(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="bg-secondary/30 border-border">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <span className="text-muted-foreground text-center">{error}</span>
                <Button variant="outline" onClick={() => fetchNews(true)}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredNews.length === 0 ? (
            <Card className="bg-secondary/30 border-border">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
                <Newspaper className="w-8 h-8 text-muted-foreground" />
                <span className="text-muted-foreground text-center">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No news matching your filters'
                    : 'No news available at the moment'}
                </span>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-secondary/30 border-border hover:border-primary/50 transition-colors"
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
                    <CardTitle className="text-lg leading-tight">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {item.summary}
                    </p>
                    <a 
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      Read full article on {item.source_name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaxNews;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Newspaper, ExternalLink, RefreshCw, Clock, AlertCircle, ArrowLeft, Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useModal } from "@/contexts/ModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShareButtons = ({ title, url }: { title: string; url: string }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Share on Facebook
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
                    <div className="flex items-center justify-between">
                      <a 
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                      >
                        Read full article on {item.source_name}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <ShareButtons title={item.title} url={item.source_url} />
                    </div>
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

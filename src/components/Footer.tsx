import { FileText, Mic, MessageCircle, Clock, Download, Newspaper, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const dataSources = [
  { name: "Nigeria Fiscal Policy & Tax Reforms", url: "https://fiscalreforms.ng", short: "fiscalreforms.ng" },
  { name: "Nigeria Revenue Service (NRS)", url: "https://nrs.gov.ng", short: "nrs.gov.ng" },
  { name: "PwC Nigeria Tax Insights", url: "https://www.pwc.com/ng/en/services/tax.html", short: "PwC Nigeria" },
  { name: "Baker Tilly Nigeria", url: "https://www.bakertilly.ng", short: "Baker Tilly" },
  { name: "KPMG Nigeria Tax", url: "https://kpmg.com/ng/en/home/services/tax.html", short: "KPMG Nigeria" },
];

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Data Sources Section */}
        <div className="mb-6 pb-6 border-b border-border/50">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Data Sources</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {dataSources.map((source, index) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                title={source.name}
              >
                {source.short}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {index < dataSources.length - 1 && <span className="text-muted-foreground/50 ml-3">•</span>}
              </a>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <span className="text-sm text-muted-foreground">Coming Soon:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Mic className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Voice AI</span>
            <Clock className="w-3 h-3 text-primary/60" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">WhatsApp Bot</span>
            <Clock className="w-3 h-3 text-primary/60" />
          </div>
        </div>

        {/* Footer Content */}
        <div className="text-center">
          <h3 className="font-display text-lg font-bold text-foreground mb-2">
            <span className="text-primary">Naija</span>TaxAI
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <FileText className="w-4 h-4" />
            <span>Based on Nigeria Tax Reform Acts 2025</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            © {new Date().getFullYear()} NaijaTaxAI. Educational tool only. Not legal or financial advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/about" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/terms" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/news" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Newspaper className="w-3 h-3" />
              Tax News
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/install" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Install App
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

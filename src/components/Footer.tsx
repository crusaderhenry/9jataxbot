import { FileText, Mic, MessageCircle, Clock, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
            <span className="text-primary">Naija</span>TaxBot
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <FileText className="w-4 h-4" />
            <span>Based on Bills HB 1756-1759</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            © {new Date().getFullYear()} NaijaTaxBot. Educational tool only. Not legal or financial advice.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
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

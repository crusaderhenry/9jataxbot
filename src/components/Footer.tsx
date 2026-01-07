import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="font-display text-lg font-bold text-foreground mb-2"><span className="text-primary">Green</span>Tax</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <FileText className="w-4 h-4" />
          <span>Based on Bills HB 1756-1759</span>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} GreenTax. Educational tool only. Not legal or financial advice.</p>
      </div>
    </footer>
  );
};

export default Footer;

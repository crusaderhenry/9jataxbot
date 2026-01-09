import { useState, useEffect } from "react";
import { Menu, Calculator, MessageCircle, Sun, Moon, Download, Share, MoreVertical, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import naijaTaxAILogo from "@/assets/naijataxai-logo.png";

interface NavbarProps {
  onOpenChat: () => void;
  onOpenCalculator: () => void;
}

const navLinks = [
  { href: "#exemptions", label: "Exemptions" },
  { href: "#calendar", label: "Tax Calendar" },
  { href: "/news", label: "Tax News", isPage: true },
  { href: "#faq", label: "FAQs" },
];

const Navbar = ({ onOpenChat, onOpenCalculator }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, setTheme } = useTheme();
  const { isInstallable, isInstalled, isIOS, isAndroid, promptInstall } = usePwaInstall();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
      const sections = navLinks.map(link => link.href.replace("#", ""));
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, isPage?: boolean) => {
    if (isPage) {
      setIsOpen(false);
      return; // Let Link handle navigation
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => {
    return activeSection === href.replace("#", "");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Mobile Install */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <img src={naijaTaxAILogo} alt="NaijaTaxAI" className="w-8 h-8 rounded-lg" />
              <span className="font-display text-xl font-bold text-foreground">
                <span className="text-primary">Naija</span>TaxAI
              </span>
            </Link>
            
            {/* Mobile Install Button */}
            {!isInstalled && (
              <div className="md:hidden">
                {isInstallable ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={promptInstall}
                    className="text-primary h-8 w-8"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                ) : (
                  <Link to="/install">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary h-8 w-8"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.isPage ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Install App Button - Always show unless installed */}
            {!isInstalled && (
              isInstallable ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={promptInstall}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" align="end">
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Install NaijaTaxAI</p>
                      {isIOS ? (
                        <p className="text-xs text-muted-foreground">
                          Tap <Share className="w-3 h-3 inline mx-1" /> then "Add to Home Screen" to install.
                        </p>
                      ) : isAndroid ? (
                        <p className="text-xs text-muted-foreground">
                          Tap <MoreVertical className="w-3 h-3 inline mx-1" /> menu, then "Install app" or "Add to Home screen".
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Look for the install icon <Download className="w-3 h-3 inline mx-1" /> in your browser's address bar.
                        </p>
                      )}
                      <Link to="/install" className="block">
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          See detailed instructions
                        </Button>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>
              )
            )}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            )}
            <Link to="/news">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Newspaper className="w-4 h-4 mr-2" />
                News
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCalculator}
              className="text-muted-foreground hover:text-foreground"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </Button>
            <Button
              size="sm"
              onClick={onOpenChat}
              className="accent-gradient text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    link.isPage ? (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 text-left font-medium rounded-lg transition-colors text-foreground hover:bg-muted/50"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        key={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`px-4 py-3 text-left font-medium rounded-lg transition-colors ${
                          isActive(link.href)
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {link.label}
                      </button>
                    )
                  ))}
                </div>

                {/* Mobile CTAs */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {/* Mobile Install Button - Always show unless installed */}
                  {!isInstalled && (
                    isInstallable ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          promptInstall();
                          setIsOpen(false);
                        }}
                        className="justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install App
                      </Button>
                    ) : (
                      <Link to="/install" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="justify-start w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install App
                        </Button>
                      </Link>
                    )
                  )}
                  {mounted && (
                    <Button
                      variant="outline"
                      onClick={toggleTheme}
                      className="justify-start"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4 mr-2" />
                      ) : (
                        <Moon className="w-4 h-4 mr-2" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      onOpenCalculator();
                      setIsOpen(false);
                    }}
                    className="justify-start"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Tax Calculator
                  </Button>
                  <Button
                    onClick={() => {
                      onOpenChat();
                      setIsOpen(false);
                    }}
                    className="justify-start accent-gradient text-primary-foreground"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Tax AI
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

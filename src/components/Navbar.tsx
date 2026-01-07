import { useState, useEffect } from "react";
import { Menu, Calculator, MessageCircle, Sparkles, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

interface NavbarProps {
  onOpenChat: () => void;
  onOpenCalculator: () => void;
}

const navLinks = [
  { href: "#exemptions", label: "Exemptions" },
  { href: "#comparison", label: "Old vs New" },
  { href: "#calendar", label: "Tax Calendar" },
  { href: "#faq", label: "FAQs" },
];

const Navbar = ({ onOpenChat, onOpenCalculator }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, setTheme } = useTheme();

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

  const scrollToSection = (href: string) => {
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
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              <span className="text-primary">TaxBot</span>NG
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
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
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className={`px-4 py-3 text-left font-medium rounded-lg transition-colors ${
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                {/* Mobile CTAs */}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
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

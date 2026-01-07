import { useState, useEffect } from "react";
import { MessageCircle, Calculator, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface StickyActionBarProps {
  onOpenChat: () => void;
  onOpenCalculator: () => void;
}

const StickyActionBar = ({ onOpenChat, onOpenCalculator }: StickyActionBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Desktop: Fixed to top when scrolled */}
      <div
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="w-full glass border-b border-border shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">
              <span className="text-primary">Green</span>Tax
            </h2>
            <div className="flex items-center gap-3">
              {mounted && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-9 h-9 p-0"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                size="sm"
                className="accent-gradient text-primary-foreground"
                onClick={onOpenChat}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Bot
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5"
                onClick={onOpenCalculator}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculator
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Fixed to bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border shadow-lg safe-area-bottom">
        <div className="flex items-center gap-2 p-3">
          {mounted && (
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className="w-10 h-10 flex-shrink-0"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          )}
          <Button
            className="flex-1 accent-gradient text-primary-foreground"
            onClick={onOpenChat}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Bot
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-primary/30 hover:bg-primary/5"
            onClick={onOpenCalculator}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculator
          </Button>
        </div>
      </div>
    </>
  );
};

export default StickyActionBar;

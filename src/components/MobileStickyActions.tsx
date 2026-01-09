import { Calculator, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileStickyActionsProps {
  onOpenChat: () => void;
  onOpenCalculator: () => void;
}

export default function MobileStickyActions({
  onOpenChat,
  onOpenCalculator,
}: MobileStickyActionsProps) {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 safe-area-bottom animate-slide-up">
      <div className="bg-background/85 backdrop-blur-lg border-t border-border">
        <div className="max-w-7xl mx-auto px-4 pt-3 pb-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onOpenChat}
              className="w-full accent-gradient text-primary-foreground"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask TaxAI
            </Button>
            <Button
              onClick={onOpenCalculator}
              variant="outline"
              className="w-full border-primary/30"
              size="lg"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Tax Calculator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

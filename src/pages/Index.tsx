import { useState } from "react";
import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import TaxCalculator from "@/components/TaxCalculator";
import TaxChatBot from "@/components/TaxChatBot";
import StickyActionBar from "@/components/StickyActionBar";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onScrollToFAQ={scrollToFAQ}
      />
      <FAQSection />
      <Footer />
      
      <StickyActionBar 
        onOpenChat={() => setIsChatOpen(true)} 
        onOpenCalculator={() => setIsCalculatorOpen(true)} 
      />
      
      <TaxChatBot 
        open={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
      
      <TaxCalculator 
        open={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
};

export default Index;

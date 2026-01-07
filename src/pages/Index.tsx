import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MobileStickyActions from "@/components/MobileStickyActions";
import TaxExemptionSection from "@/components/TaxExemptionSection";
import TaxComparisonSection from "@/components/TaxComparisonSection";
import TaxCalendarSection from "@/components/TaxCalendarSection";
import FAQSection from "@/components/FAQSection";
import TaxCalculator from "@/components/TaxCalculator";
import TaxChatBot from "@/components/TaxChatBot";
import Footer from "@/components/Footer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)} 
        onOpenCalculator={() => setIsCalculatorOpen(true)} 
      />
      <Hero 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onScrollToFAQ={scrollToFAQ}
      />
      <div id="exemptions">
        <TaxExemptionSection />
      </div>
      <div id="comparison">
        <TaxComparisonSection />
      </div>
      <div id="calendar">
        <TaxCalendarSection />
      </div>
      <div id="faq">
        <FAQSection onOpenChat={() => setIsChatOpen(true)} />
      </div>
      <Footer />

      <MobileStickyActions
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

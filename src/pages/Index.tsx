import { useState } from "react";
import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import TaxCalculator from "@/components/TaxCalculator";
import TaxChatBot from "@/components/TaxChatBot";
import ChatButton from "@/components/ChatButton";
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
      
      <ChatButton onClick={() => setIsChatOpen(true)} />
      
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

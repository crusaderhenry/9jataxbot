import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MobileStickyActions from "@/components/MobileStickyActions";
import TaxExemptionSection from "@/components/TaxExemptionSection";
import TaxCalendarSection from "@/components/TaxCalendarSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { useModal } from "@/contexts/ModalContext";

const Index = () => {
  const { openChat, openCalculator } = useModal();

  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <Navbar 
        onOpenChat={openChat} 
        onOpenCalculator={openCalculator} 
      />
      <Hero 
        onOpenChat={openChat}
        onOpenCalculator={openCalculator}
        onScrollToFAQ={scrollToFAQ}
      />
      <div id="exemptions">
        <TaxExemptionSection />
      </div>
      <div id="calendar">
        <TaxCalendarSection />
      </div>
      <div id="faq">
        <FAQSection onOpenChat={openChat} />
      </div>
      <Footer />

      <MobileStickyActions
        onOpenChat={openChat}
        onOpenCalculator={openCalculator}
      />
    </div>
  );
};

export default Index;

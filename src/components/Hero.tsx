import { MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] hero-gradient flex flex-col items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
      {/* Glow effect overlay */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      
      {/* Badge */}
      <div className="animate-fade-in relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/20 bg-foreground/5 backdrop-blur-sm">
          <FileText className="w-4 h-4 text-foreground/80" />
          <span className="text-sm font-medium text-foreground/90">
            Based on Official Bills HB 1756-1759 | Effective Jan 1, 2026
          </span>
        </div>
      </div>

      {/* Main heading */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="animate-fade-in text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight text-shadow-soft" style={{ animationDelay: '0.1s' }}>
          TaxSphere
        </h1>
        <h2 className="animate-fade-in text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-shadow-soft" style={{ animationDelay: '0.2s' }}>
          Nigeria's 2025 Tax Reforms, Simply Explained.
        </h2>
        <p className="animate-fade-in text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto" style={{ animationDelay: '0.3s' }}>
          Clear answers based on the official Bills. No rumors.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.4s' }}>
          <Button variant="hero-outline" size="lg" className="min-w-[180px]">
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask the Tax Bot
          </Button>
          <Button variant="hero-solid" size="lg" className="min-w-[180px]" onClick={scrollToFAQ}>
            <FileText className="w-5 h-5 mr-2" />
            Quick FAQs
          </Button>
        </div>
      </div>

      {/* Feature badges */}
      <div className="animate-fade-in relative z-10 mt-16 flex flex-wrap items-center justify-center gap-8 text-foreground/80" style={{ animationDelay: '0.5s' }}>
        <FeatureBadge text="Educational Tool" />
        <FeatureBadge text="AI-Powered Answers" />
        <FeatureBadge text="Based on Official Bills" />
      </div>

      {/* Curved divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L1440 120L1440 60C1440 60 1200 0 720 0C240 0 0 60 0 60L0 120Z" fill="hsl(0 0% 100%)" />
        </svg>
      </div>
    </section>
  );
};

const FeatureBadge = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Hero;

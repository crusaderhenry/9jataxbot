import { Calculator, MessageCircle, Calendar, ArrowRight, Sparkles, Scale, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onOpenChat: () => void;
  onOpenCalculator: () => void;
  onScrollToFAQ: () => void;
}

const Hero = ({ onOpenChat, onOpenCalculator, onScrollToFAQ }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] bg-background flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient for dark mode */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Badge */}
      <div className="animate-fade-up relative z-10 mb-8" style={{ animationDelay: '0.1s' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Nigeria's 2025 Tax Reforms | Effective Jan 1, 2026
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="animate-fade-up font-display text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight" style={{ animationDelay: '0.2s' }}>
          <span className="text-primary">Green</span>Tax
        </h1>
        <p className="animate-fade-up text-xl md:text-2xl text-foreground/80 mb-4 font-display" style={{ animationDelay: '0.3s' }}>
          Understand Nigeria's New Tax Laws
        </p>
        <p className="animate-fade-up text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
          Get clear answers about the 2025 tax reforms. Calculate your taxes, chat with our AI assistant, and explore FAQs—all based on official Bills HB 1756-1759.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-12" style={{ animationDelay: '0.5s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] accent-gradient hover:opacity-90 transition-opacity text-primary-foreground shadow-lg"
            onClick={onOpenChat}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask the Tax Bot
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full sm:w-auto min-w-[200px] border-primary/30 hover:bg-primary/5"
            onClick={onOpenCalculator}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Tax Calculator
          </Button>
        </div>

        {/* Quick link */}
        <button 
          onClick={onScrollToFAQ}
          className="animate-fade-up inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          style={{ animationDelay: '0.6s' }}
        >
          <FileText className="w-4 h-4" />
          <span>Browse FAQs</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Feature cards */}
      <div className="animate-fade-up relative z-10 mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto w-full px-4" style={{ animationDelay: '0.7s' }}>
        <FeatureCard 
          icon={<Mic className="w-5 h-5" />}
          title="Voice & Text AI"
          description="Chat or speak with our tax assistant"
        />
        <FeatureCard 
          icon={<Calculator className="w-5 h-5" />}
          title="Tax Calculator"
          description="Estimate taxes under new brackets"
        />
        <FeatureCard 
          icon={<Scale className="w-5 h-5" />}
          title="Old vs New Regime"
          description="Compare tax reforms side by side"
        />
        <FeatureCard 
          icon={<Calendar className="w-5 h-5" />}
          title="2026 Deadlines"
          description="Key filing dates & reminders"
        />
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="glass rounded-2xl p-5 text-center hover:shadow-lg transition-shadow">
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
      {icon}
    </div>
    <h3 className="font-display font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Hero;

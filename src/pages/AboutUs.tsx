import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Users, Shield, Lightbulb, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useModal } from "@/contexts/ModalContext";

const AboutUs = () => {
  const { openChat, openCalculator } = useModal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenChat={openChat} onOpenCalculator={openCalculator} />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            About <span className="text-primary">Naija</span>TaxAI
          </h1>
          <p className="text-muted-foreground mb-8">
            Empowering Nigerians with accessible tax knowledge
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Mission Section */}
            <section className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground m-0">
                  Our Mission
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed m-0">
                NaijaTaxAI was created to democratize access to tax knowledge in Nigeria. We believe every Nigerian—whether a salaried worker, small business owner, or entrepreneur—deserves to understand how the country's tax system affects them. Our AI-powered platform translates complex tax legislation into clear, actionable insights.
              </p>
            </section>

            {/* Why We Built This */}
            <section className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground m-0">
                  Why We Built This
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nigeria's 2025 Tax Reform Acts represent the most significant overhaul of the country's tax system in decades. With four major bills (HB 1756-1759) introducing sweeping changes—from new personal income tax thresholds to corporate tax exemptions and VAT modifications—we saw a critical need for an accessible resource.
              </p>
              <p className="text-muted-foreground leading-relaxed m-0">
                Rather than requiring people to sift through hundreds of pages of legislation, we created NaijaTaxAI to provide instant, accurate answers to tax questions, calculate tax obligations under the new rules, and help Nigerians stay compliant.
              </p>
            </section>

            {/* What We Offer */}
            <section className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground m-0">
                  What We Offer
                </h2>
              </div>
              <ul className="text-muted-foreground space-y-3 m-0 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">AI Tax Assistant:</strong> Get instant answers to your tax questions in plain language, powered by advanced AI trained on Nigeria's tax laws.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Tax Calculator:</strong> Calculate your personal income tax, business taxes, and see how the new reforms affect your bottom line.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Comprehensive FAQs:</strong> Browse curated answers to the most common questions about Nigeria's 2025 tax reforms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Tax Calendar:</strong> Never miss a deadline with our 2026 tax filing calendar.</span>
                </li>
              </ul>
            </section>

            {/* Our Commitment */}
            <section className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground m-0">
                  Our Commitment
                </h2>
              </div>
              <ul className="text-muted-foreground space-y-3 m-0 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Accuracy:</strong> All information is based on official Nigerian tax legislation and Bills HB 1756-1759.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Accessibility:</strong> Free to use, available 24/7, and works on any device.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Privacy:</strong> We minimize data collection and never sell your information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span><strong className="text-foreground">Continuous Improvement:</strong> We regularly update our platform as new guidance is released.</span>
                </li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section className="border-t border-border pt-6 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground m-0">
                  Built with ❤️ for Nigeria
                </p>
              </div>
              <p className="text-sm text-muted-foreground italic m-0">
                NaijaTaxAI is an educational tool designed to help Nigerians understand tax concepts. It does not provide legal, financial, or professional tax advice. For specific situations, please consult a qualified tax professional or the Nigeria Revenue Service (NRS).
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

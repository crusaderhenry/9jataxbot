import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useModal } from "@/contexts/ModalContext";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 9, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using NaijaTaxAI ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors, users, and others who access the Service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                NaijaTaxAI provides:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>An AI-powered tax information assistant for Nigerian tax matters</li>
                <li>Tax calculators for personal and business income</li>
                <li>Educational content about Nigeria's 2025 Tax Reform Acts (HB 1756-1759)</li>
                <li>Frequently asked questions and tax calendar information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                3. Educational Purpose Only
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">IMPORTANT DISCLAIMER:</strong> NaijaTaxAI is strictly an educational tool. The Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Does NOT provide legal, financial, tax, or professional advice</li>
                <li>Does NOT create a professional-client relationship</li>
                <li>Does NOT guarantee the accuracy, completeness, or timeliness of information</li>
                <li>Should NOT be relied upon as a substitute for consultation with qualified tax professionals, accountants, or legal advisors</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Tax laws are subject to change and interpretation. For specific tax situations, consult a qualified tax professional or the Nigeria Revenue Service (NRS) directly.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                4. User Responsibilities
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service only for lawful purposes and in compliance with Nigerian law</li>
                <li>Not rely solely on the Service for tax compliance decisions</li>
                <li>Verify all tax calculations and information with official sources before filing</li>
                <li>Not attempt to disrupt, overload, or interfere with the Service</li>
                <li>Not use automated systems to access the Service in a manner that exceeds reasonable use</li>
                <li>Not input false, misleading, or malicious content into the AI assistant</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                5. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Service—including but not limited to text, graphics, logos, icons, images, audio clips, and software—are the property of NaijaTaxAI or its licensors and are protected by Nigerian and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To the maximum extent permitted by Nigerian law:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>NaijaTaxAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service</li>
                <li>We are not responsible for any penalties, fines, or losses incurred as a result of tax decisions made based on information from the Service</li>
                <li>Our total liability for any claims arising from the Service shall not exceed the amount you paid to use the Service (if any)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                7. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties regarding the accuracy, reliability, or completeness of any information provided through the Service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                8. Indemnification
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless NaijaTaxAI, its operators, affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                9. Service Modifications
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                10. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may revise these Terms of Service at any time. Changes will be effective immediately upon posting to this page with an updated "Last updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                11. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Nigeria.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                12. Severability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                13. Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                By using NaijaTaxAI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenChat={() => {}} onOpenCalculator={() => {}} />
      
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 8, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to NaijaTaxAI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of any information you provide while using our Nigerian tax information service. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                NaijaTaxAI is designed to minimize data collection. We may collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Chat Interactions:</strong> Questions and queries you submit to our AI tax assistant for processing and response generation.</li>
                <li><strong className="text-foreground">Calculator Inputs:</strong> Income and tax-related figures you enter into our tax calculator (processed locally in your browser).</li>
                <li><strong className="text-foreground">Technical Data:</strong> Anonymous usage data such as browser type, device information, and general location for service improvement.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We do not require user accounts or personal registration to use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                3. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The information we collect is used to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate responses to your tax-related questions</li>
                <li>Process tax calculations based on Nigerian tax laws</li>
                <li>Improve our AI assistant's accuracy and helpfulness</li>
                <li>Maintain and enhance our service performance</li>
                <li>Ensure the security and integrity of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                4. Data Storage and Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your information. Chat interactions are processed through secure, encrypted connections. Calculator computations are performed locally in your browser and are not transmitted to our servers. We use industry-standard security protocols to protect any data that is transmitted.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                5. Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for AI processing and analytics. These services are bound by their own privacy policies and are selected for their commitment to data protection. We do not sell, trade, or otherwise transfer your information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                6. Cookies and Local Storage
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NaijaTaxAI uses local storage to save your theme preferences (light/dark mode) and support Progressive Web App (PWA) functionality. These are essential for providing a consistent user experience and do not track personal information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                7. Nigeria Data Protection Regulation (NDPR)
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We comply with the Nigeria Data Protection Regulation (NDPR) 2019 and the Nigeria Data Protection Act 2023. As a data controller, we ensure that any personal data processed is done lawfully, fairly, and transparently. You have the right to access, rectify, or request deletion of any personal data we may hold about you.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                8. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NaijaTaxAI is not directed at individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                9. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                10. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please reach out to us through our website. We are committed to addressing any concerns you may have about your privacy.
              </p>
            </section>

            <section className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground italic">
                This Privacy Policy is provided for informational purposes. NaijaTaxAI is an educational tool and does not provide legal, financial, or professional tax advice. For specific legal guidance regarding data protection, please consult a qualified legal professional.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

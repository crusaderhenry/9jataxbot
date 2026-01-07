import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqData = {
  general: [
    {
      question: "So, what is this 'Nigeria Revenue Service' (NRS)?",
      answer: "Think of the NRS as the modern, streamlined version of the FIRS. Instead of having different agencies chasing you for different taxes, the NRS is now the single, unified authority. It's designed to stop the \"multiple agency\" harassment and make everything work under one roof."
    },
    {
      question: "I heard they scrapped a lot of taxes. Is that actually true?",
      answer: "Yes, they really did clear the clutter. Old confusing taxes like the Education Tax, IT Levy, and Police Trust Fund tax are gone. They have been replaced by one single Development Levy (4% of profit), which makes calculating what you owe much simpler."
    },
    {
      question: "What exactly is this 'Development Levy'?",
      answer: "It's a consolidated contribution. Instead of paying small fees here and there for student loans, IT, or science funding, companies now pay just this one levy. It simplifies the paperwork and funds things like the Student Loan Scheme directly."
    },
    {
      question: "Do I really need a Tax ID just to operate my bank account?",
      answer: "Yes. Just like your BVN or NIN is for identity, the Tax ID is now mandatory for banking. It connects your financial life to the tax system to ensure everyone is in the loop and compliant."
    },
    {
      question: "What is the 'Tax Ombudsman'?",
      answer: "Think of this office as your \"referee.\" If a tax officer treats you unfairly or tries to bully you, you don't have to just take it. You can report them to the Ombudsman, an independent body created specifically to protect your rights without you needing a lawyer."
    },
    {
      question: "When does all this start working?",
      answer: "The general effective date is January 1, 2026 (following the signing into law in June 2025). However, big changes take time, so there are \"transitional provisions\" to let businesses and individuals adjust gradually without getting into trouble."
    }
  ],
  salary: [
    {
      question: "Will I pay less PAYE tax now?",
      answer: "For most salary earners, yes! The new graduated rates are more favorable, especially for lower and middle-income earners. The tax-free threshold has been increased to help those earning less."
    },
    {
      question: "What reliefs can I claim as a salaried employee?",
      answer: "You can claim the Consolidated Relief Allowance (CRA), which is 20% of your gross income plus ₦200,000. Additionally, contributions to pension schemes remain tax-deductible."
    },
    {
      question: "How do I know if my employer is remitting my taxes?",
      answer: "With your Tax ID linked to your bank account and the new unified system, you can verify your tax status through the NRS portal. Transparency is a key feature of the reform."
    }
  ],
  business: [
    {
      question: "Does my small business need to pay the Development Levy?",
      answer: "Only companies with turnover above a certain threshold pay the full 4% Development Levy. Micro and small businesses have reduced rates or may be exempt entirely."
    },
    {
      question: "What happened to VAT for small businesses?",
      answer: "Small businesses with annual turnover below ₦25 million are now exempt from VAT registration. This removes a significant compliance burden for micro-enterprises."
    },
    {
      question: "How do I register my business for the new tax system?",
      answer: "You'll need to obtain a Tax ID through the NRS portal. The process is being streamlined to be completed online, reducing the need for physical visits to tax offices."
    },
    {
      question: "Are there tax incentives for startups?",
      answer: "Yes! The reform includes provisions for pioneer status and tax holidays for qualifying businesses in priority sectors. Check with the NRS for specific eligibility criteria."
    }
  ]
};

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <section id="faq" className="bg-foreground py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Quick Answers to Common Questions
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto">
            Get instant answers about how the 2025 Tax Reforms may affect you.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/10 p-1 rounded-xl">
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-background/70 rounded-lg transition-all"
            >
              General & The Big Changes
            </TabsTrigger>
            <TabsTrigger 
              value="salary"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-background/70 rounded-lg transition-all"
            >
              Salary Earners & Individuals
            </TabsTrigger>
            <TabsTrigger 
              value="business"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-background/70 rounded-lg transition-all"
            >
              Business Owners (SMEs)
            </TabsTrigger>
          </TabsList>

          {Object.entries(faqData).map(([key, faqs]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-background/5 rounded-xl border-none px-6 data-[state=open]:bg-background/10 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-background hover:no-underline py-5 text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-background/70 pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FAQSection;

import { useState, useMemo } from "react";
import { Search, FileText, Building2, Users, Wallet, Receipt, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = [
  { id: "all", label: "All Topics", icon: <FileText className="w-4 h-4" /> },
  { id: "pit", label: "Personal Income Tax", icon: <Users className="w-4 h-4" /> },
  { id: "cit", label: "Corporate Tax", icon: <Building2 className="w-4 h-4" /> },
  { id: "vat", label: "VAT", icon: <Receipt className="w-4 h-4" /> },
  { id: "relief", label: "Tax Relief", icon: <Wallet className="w-4 h-4" /> },
  { id: "compliance", label: "Compliance", icon: <Scale className="w-4 h-4" /> },
];

const faqs = [
  { id: "1", category: "pit", question: "What are the new Personal Income Tax brackets for 2026?", answer: "Under the 2025 reforms, the PIT structure has been revised to be more progressive. The first ₦800,000 of annual income is now tax-free (up from ₦300,000). Subsequent brackets apply graduated rates from 15% to 25% for the highest earners above ₦50 million annually." },
  { id: "2", category: "pit", question: "How does the new Consolidated Relief Allowance (CRA) work?", answer: "The CRA has been simplified. You now receive an automatic relief of ₦800,000 or 20% of gross income (whichever is higher) plus 20% of earned income." },
  { id: "3", category: "cit", question: "What changes affect small businesses under Corporate Income Tax?", answer: "Small companies (turnover below ₦25 million) remain exempt from CIT. Medium-sized companies (₦25-100 million turnover) now pay 20% instead of the previous 30%." },
  { id: "4", category: "vat", question: "What is the new VAT rate and who is exempt?", answer: "The VAT rate increases to 10% from January 2026. Essential items remain exempt including basic food items, educational materials, and medical supplies." },
  { id: "5", category: "relief", question: "What new tax reliefs are available for individuals?", answer: "New reliefs include: mortgage interest deduction up to ₦2 million annually, pension contributions up to 20% of income, and child education allowance for up to 4 children." },
  { id: "6", category: "compliance", question: "What are the new filing deadlines under the reforms?", answer: "Individual tax returns are now due by March 31st (previously June 30th). Corporate returns remain due within 6 months of financial year-end." },
];

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch = searchQuery === "" || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="faq" className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Find answers about Nigeria's 2025 tax reforms based on official Bills.</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input type="text" placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-xl border-border bg-secondary/50" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-card rounded-xl border border-border px-6">
                <AccordionTrigger className="text-left hover:no-underline py-5"><span className="font-medium text-foreground pr-4">{faq.question}</span></AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 bg-secondary/50 rounded-2xl">
            <p className="text-muted-foreground">No questions found.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="text-primary hover:underline mt-2">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

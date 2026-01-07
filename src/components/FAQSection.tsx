import { useState, useMemo } from "react";
import { Search, FileText, Building2, Users, Wallet, Receipt, Scale, Landmark, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const categories = [
  { id: "all", label: "All Topics", icon: <FileText className="w-4 h-4" /> },
  { id: "pit", label: "Personal Income Tax", icon: <Users className="w-4 h-4" /> },
  { id: "cit", label: "Corporate Tax", icon: <Building2 className="w-4 h-4" /> },
  { id: "vat", label: "VAT", icon: <Receipt className="w-4 h-4" /> },
  { id: "incentives", label: "Incentives", icon: <Wallet className="w-4 h-4" /> },
  { id: "compliance", label: "Compliance", icon: <Scale className="w-4 h-4" /> },
  { id: "governance", label: "Governance", icon: <Landmark className="w-4 h-4" /> },
];

// Real FAQs based on Nigeria's 2025 Tax Reform Acts (HB 1756-1759)
const faqs = [
  // Personal Income Tax
  {
    id: "1",
    category: "pit",
    question: "What is the new tax-free income threshold under the 2025 reforms?",
    answer: "Individuals with taxable income of ₦800,000 or less per year (after relief allowances and exemptions) are now completely exempt from paying personal income tax. This measure reduces the burden on Nigeria's lowest earners and aligns with the national minimum wage."
  },
  {
    id: "2",
    category: "pit",
    question: "What are the new Personal Income Tax (PIT) rates for high earners?",
    answer: "The reforms introduce a more progressive structure with increased marginal tax rates. Those earning ₦50 million and above annually now fall into a higher band, taxed at up to 25%, compared to the previous top rate of 24%."
  },
  {
    id: "3",
    category: "pit",
    question: "How is tax residency defined under the new rules?",
    answer: "An individual is considered tax resident if they spend 183 days or more in Nigeria, maintain a permanent home, or have significant economic or family ties within a tax year. Residents are now taxed on their global (worldwide) income."
  },
  {
    id: "4",
    category: "pit",
    question: "What changed for compensation on loss of employment?",
    answer: "The exemption threshold for compensation related to loss of employment or personal injury has been raised from ₦10 million to ₦50 million, providing better protection during unexpected life events."
  },
  
  // Corporate Tax
  {
    id: "5",
    category: "cit",
    question: "Which companies are exempt from Corporate Income Tax under the reforms?",
    answer: "Small companies with gross turnover ≤ ₦50 million and fixed assets ≤ ₦250 million are fully exempt from Companies Income Tax (CIT), Capital Gains Tax (CGT), and the 4% Development Levy. This supports MSMEs and simplifies compliance."
  },
  {
    id: "6",
    category: "cit",
    question: "What is the new Capital Gains Tax (CGT) rate for companies?",
    answer: "The CGT rate for companies increased from 10% to 30%, aligning it with the standard corporate income tax rate. This eliminates arbitrage between capital and trading income."
  },
  {
    id: "7",
    category: "cit",
    question: "What is the Minimum Effective Tax Rate (ETR)?",
    answer: "Large companies with ₦50 billion+ annual turnover or part of multinational groups earning over €750 million globally must pay a minimum ETR of 15%. If their actual tax is below this rate, a top-up tax is triggered."
  },
  {
    id: "8",
    category: "cit",
    question: "What is the 4% Development Levy?",
    answer: "A new Development Levy of 4% on assessable profits replaces several overlapping taxes including the Tertiary Education Tax, NASENI Levy, IT Levy, and Police Trust Fund levy. This reduces administrative overhead."
  },
  {
    id: "9",
    category: "cit",
    question: "Are indirect offshore share transfers now taxable?",
    answer: "Yes. Gains from disposing shares in non-Nigerian entities that derive substantial value from Nigerian assets are now subject to Nigerian CGT, unless protected by tax treaty provisions."
  },
  
  // VAT
  {
    id: "10",
    category: "vat",
    question: "Did the VAT rate change under the 2025 reforms?",
    answer: "No, the VAT rate remains unchanged at 7.5% despite early discussions about a potential increase."
  },
  {
    id: "11",
    category: "vat",
    question: "What items are now zero-rated for VAT?",
    answer: "Essential goods and services including food items, medical equipment, educational materials, electricity transmission, and non-oil exports are now zero-rated."
  },
  {
    id: "12",
    category: "vat",
    question: "Can businesses now claim input VAT on services and capital assets?",
    answer: "Yes. Businesses can now claim input VAT on both services and capital assets (like fixed asset purchases), a major change from previous laws that only allowed recovery for goods/materials used for production or resale."
  },
  {
    id: "13",
    category: "vat",
    question: "What is mandatory e-invoicing and fiscalisation?",
    answer: "All VAT-registered businesses must now adopt FIRS-sanctioned e-invoicing systems that allow real-time transaction reporting. This significantly improves VAT transparency and reduces evasion."
  },
  
  // Incentives
  {
    id: "14",
    category: "incentives",
    question: "What is the Economic Development Incentive (EDI)?",
    answer: "The EDI replaces the old Pioneer Status tax holiday. Eligible companies receive a 5% annual tax credit for up to 5 years on qualifying capital expenditure, tying tax relief to measurable investment in productive assets."
  },
  {
    id: "15",
    category: "incentives",
    question: "Can unused EDI tax credits be carried forward?",
    answer: "Yes. If companies cannot utilize EDI tax credits within 5 years, they are allowed a carry-forward period of another 5 years. Any unused benefits after that will lapse."
  },
  {
    id: "16",
    category: "incentives",
    question: "What changed for Free Zone and Export Processing Zone companies?",
    answer: "Companies in Free Zones/EPZs remain exempt on exports but face tighter scrutiny when supplying Nigeria's customs territory. Conditions for maintaining exemption status are now stricter and clearly defined."
  },
  
  // Compliance
  {
    id: "17",
    category: "compliance",
    question: "When did the 2025 Tax Reform Acts take effect?",
    answer: "The four Tax Reform Acts (Nigeria Tax Act, Nigeria Tax Administration Act, Nigeria Revenue Service Act, and Joint Revenue Board Act) were signed into law on June 26, 2025, with most provisions effective from January 1, 2026."
  },
  {
    id: "18",
    category: "compliance",
    question: "What digital compliance requirements apply to businesses?",
    answer: "The reforms mandate digital filing, record-keeping, and payment across all major taxes. Businesses must upgrade ERP systems and ensure full digital compliance, with heightened penalties for outdated or inaccurate processes."
  },
  {
    id: "19",
    category: "compliance",
    question: "Can capital allowances be claimed on assets that evaded VAT?",
    answer: "No. Companies can no longer claim capital allowances or operating deductions for assets or services that evaded VAT or import duty. This reinforces procurement compliance."
  },
  {
    id: "20",
    category: "compliance",
    question: "What are the new Stamp Duty rules?",
    answer: "Stamp Duty on agreements and contracts is now fixed at ₦1,000 (no longer ad-valorem at 1%). Agreements valued less than ₦1,000,000, employee contracts, and sale of goods contracts are now exempt."
  },
  
  // Governance
  {
    id: "21",
    category: "governance",
    question: "What is the Nigeria Revenue Service (NRS)?",
    answer: "The NRS replaces the FIRS as the central tax authority, responsible for collecting all federal tax and non-tax revenues. It operates under a more autonomous structure with emphasis on digital infrastructure and coordinated enforcement."
  },
  {
    id: "22",
    category: "governance",
    question: "What is the Tax Ombud Office?",
    answer: "A new Tax Ombud Office along with an upgraded Tax Appeal Tribunal offers structured channels for taxpayer complaints, disputes, and resolution."
  },
  {
    id: "23",
    category: "governance",
    question: "What are the four Acts that make up the 2025 Tax Reforms?",
    answer: "The reforms consist of: 1) Nigeria Tax Act (NTA) - consolidates tax laws, 2) Nigeria Tax Administration Act (NTAA) - administration procedures, 3) Nigeria Revenue Service Establishment Act (NRSA) - establishes NRS, and 4) Joint Revenue Board Establishment Act (JRBA) - coordinates federal/state revenue."
  },
  {
    id: "24",
    category: "governance",
    question: "How are gaming and lottery businesses taxed under the new laws?",
    answer: "The NTA provides for broad taxation of gaming company profits. Gaming includes gambling, wagering, video poker, roulette, craps, bingo, slot machines, drawings, and other games of chance conducted by any person."
  },
];

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        faq.question.toLowerCase().includes(searchLower) || 
        faq.answer.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="faq" className="py-20 px-4 bg-background pb-32 md:pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers about Nigeria's 2025 Tax Reform Acts based on official legislation (HB 1756-1759).
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions... (e.g. VAT rate, small company, income tax)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-secondary/50"
          />
          {searchQuery && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-card rounded-xl border border-border px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 bg-secondary/50 rounded-2xl">
            <p className="text-muted-foreground">No questions found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-primary hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

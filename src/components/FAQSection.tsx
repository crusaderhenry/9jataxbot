import { useState, useMemo } from "react";
import { Search, FileText, Building2, Users, Wallet, Receipt, Scale, Landmark, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface FAQSectionProps {
  onOpenChat: () => void;
}

const categories = [
  { id: "all", label: "All Topics", icon: <FileText className="w-4 h-4" /> },
  { id: "pit", label: "Personal Income Tax", icon: <Users className="w-4 h-4" /> },
  { id: "cit", label: "Corporate Tax", icon: <Building2 className="w-4 h-4" /> },
  { id: "vat", label: "VAT", icon: <Receipt className="w-4 h-4" /> },
  { id: "incentives", label: "Incentives", icon: <Wallet className="w-4 h-4" /> },
  { id: "compliance", label: "Compliance", icon: <Scale className="w-4 h-4" /> },
  { id: "governance", label: "Governance", icon: <Landmark className="w-4 h-4" /> },
];

// Real FAQs based on Nigeria's 2025 Tax Reform Acts (signed June 26, 2025)
// Sources: fiscalreforms.ng (Presidential Committee), Baker Tilly, PwC Nigeria, KPMG
const faqs = [
  // Personal Income Tax
  {
    id: "1",
    category: "pit",
    question: "What is the new tax-free income threshold under the 2025 reforms?",
    answer: "Individuals with taxable income of ₦800,000 or less per year (after relief allowances and exemptions) - translating to about ₦1.2 million gross income - are now completely exempt from paying personal income tax. This measure aligns with the national minimum wage."
  },
  {
    id: "2",
    category: "pit",
    question: "What are the new Personal Income Tax (PIT) rates for high earners?",
    answer: "The reforms introduce a more progressive structure. Those earning ₦50 million and above annually now fall into a higher band, taxed at up to 25%, compared to the previous top rate of 24%. Lower income bands benefit from reduced effective tax rates."
  },
  {
    id: "3",
    category: "pit",
    question: "How is tax residency defined under the new rules?",
    answer: "An individual is considered tax resident if they spend 183 days or more in Nigeria, maintain a permanent home, or have significant economic or family ties within a tax year. Residents are now taxed on their worldwide income."
  },
  {
    id: "4",
    category: "pit",
    question: "What changed for compensation on loss of employment?",
    answer: "The exemption threshold for compensation related to loss of employment or personal injury has been raised from ₦10 million to ₦50 million, providing better protection during unexpected life events."
  },
  {
    id: "5",
    category: "pit",
    question: "What individual tax reliefs are available?",
    answer: "Allowable deductions include: pension contributions to PFA, National Health Insurance, National Housing Fund contributions, interest on owner-occupied housing loans, life insurance premiums, and a new rent relief of 20% of annual rent (up to ₦500,000)."
  },
  
  // Corporate Tax
  {
    id: "6",
    category: "cit",
    question: "Which companies are exempt from Corporate Income Tax?",
    answer: "Small companies with gross turnover ≤ ₦100 million AND fixed assets ≤ ₦250 million are fully exempt from Companies Income Tax (0%), Capital Gains Tax, Development Levy, and withholding tax deduction. They're also exempt from charging/collecting VAT."
  },
  {
    id: "7",
    category: "cit",
    question: "What is the CIT rate for large companies?",
    answer: "Large companies (turnover > ₦100M OR fixed assets > ₦250M) pay 30% CIT on assessable profits, plus 4% Development Levy. The 'medium company' category at 20% has been eliminated - you're now either small (0%) or large (30%)."
  },
  {
    id: "8",
    category: "cit",
    question: "What is the new Capital Gains Tax (CGT) rate for companies?",
    answer: "The CGT rate for companies increased from 10% to 30%, aligning it with the standard corporate income tax rate. This eliminates arbitrage between capital and trading income."
  },
  {
    id: "9",
    category: "cit",
    question: "What is the Minimum Effective Tax Rate (ETR)?",
    answer: "Large companies with ₦50 billion+ annual turnover or part of multinational groups earning over €750 million globally must pay a minimum ETR of 15%. If their actual tax is below this rate, a top-up tax is triggered."
  },
  {
    id: "10",
    category: "cit",
    question: "What is the 4% Development Levy?",
    answer: "A new Development Levy of 4% on assessable profits replaces several overlapping taxes: Tertiary Education Tax (3%), NASENI Levy, IT Levy, and Police Trust Fund levy. Small companies are exempt from this levy."
  },
  {
    id: "11",
    category: "cit",
    question: "What incentives exist for hiring and wages?",
    answer: "Companies get 50% compensation relief (additional deduction) for salary increases, wage awards, or transport subsidies for low-income workers. There's also 50% employment relief for salaries of new employees hired and retained for at least 3 years."
  },
  
  // VAT
  {
    id: "12",
    category: "vat",
    question: "Did the VAT rate change under the 2025 reforms?",
    answer: "No, the VAT rate remains at 7.5%. However, significant changes include expanded zero-rated goods and full input VAT recovery on services and capital assets (previously only goods for production/resale qualified)."
  },
  {
    id: "13",
    category: "vat",
    question: "What items are now zero-rated (0% VAT)?",
    answer: "Zero-rated items include: basic food items, pharmaceutical products, education services/materials, medical/health services, agricultural inputs (fertilizers, seeds, feeds), disability aids, baby products, and sanitary products (towels, pads, tampons)."
  },
  {
    id: "14",
    category: "vat",
    question: "What items are VAT exempt or suspended?",
    answer: "Exempt/suspended items include: rent, land and buildings, shared passenger road transport, electric vehicles and parts, humanitarian supplies, diesel, petrol, and solar power equipment."
  },
  {
    id: "15",
    category: "vat",
    question: "Can businesses now claim input VAT on services and capital assets?",
    answer: "Yes! Businesses can now claim input VAT on both services and capital assets (like equipment purchases), a major change from previous laws that only allowed recovery for goods/materials used for production or resale."
  },
  {
    id: "16",
    category: "vat",
    question: "What is mandatory e-invoicing and fiscalisation?",
    answer: "All VAT-registered businesses must adopt NRS-sanctioned e-invoicing systems that allow real-time transaction reporting. This significantly improves VAT transparency and reduces evasion."
  },
  
  // Incentives
  {
    id: "17",
    category: "incentives",
    question: "What is the Economic Development Incentive (EDI)?",
    answer: "The EDI replaces the old Pioneer Status tax holiday. Eligible companies receive a 5% annual tax credit for up to 5 years on qualifying capital expenditure, tying tax relief to measurable investment in productive assets."
  },
  {
    id: "18",
    category: "incentives",
    question: "Can unused EDI tax credits be carried forward?",
    answer: "Yes. If companies cannot utilize EDI tax credits within 5 years, they're allowed a carry-forward period of another 5 years. Any unused benefits after that will lapse."
  },
  {
    id: "19",
    category: "incentives",
    question: "What tax benefits exist for agricultural businesses?",
    answer: "Agricultural businesses (crop production, livestock, dairy) enjoy a 5-year CIT tax holiday. Additionally, 0% VAT applies to agricultural inputs including fertilizers, seeds, seedlings, feeds, and live animals."
  },
  {
    id: "20",
    category: "incentives",
    question: "What about startup and venture capital incentives?",
    answer: "Eligible 'labeled' startups are exempt from CIT. Gains from investment in labeled startups by venture capitalists, private equity funds, accelerators, or incubators are also tax-exempt."
  },
  
  // Compliance
  {
    id: "21",
    category: "compliance",
    question: "When did the 2025 Tax Reform Acts take effect?",
    answer: "The four Tax Reform Acts were signed into law on June 26, 2025. Most provisions take effect from January 1, 2026, giving businesses time to prepare for compliance."
  },
  {
    id: "22",
    category: "compliance",
    question: "What digital compliance requirements apply to businesses?",
    answer: "The reforms mandate digital filing, record-keeping, and payment across all major taxes. Businesses must upgrade ERP systems and ensure full digital compliance, with heightened penalties for outdated or inaccurate processes."
  },
  {
    id: "23",
    category: "compliance",
    question: "Can capital allowances be claimed on assets that evaded VAT?",
    answer: "No. Companies can no longer claim capital allowances or operating deductions for assets or services that evaded VAT or import duty. This reinforces procurement compliance."
  },
  {
    id: "24",
    category: "compliance",
    question: "What are the new Stamp Duty rules?",
    answer: "Stamp Duty on agreements/contracts is now fixed at ₦1,000 (no longer ad-valorem at 1%). Exempt: agreements valued <₦1,000,000, employee contracts, sale of goods contracts, transfers <₦10,000, salary payments, and share transfers."
  },
  
  // Governance
  {
    id: "25",
    category: "governance",
    question: "What is the Nigeria Revenue Service (NRS)?",
    answer: "The NRS replaces the FIRS as the central tax authority, responsible for collecting all federal tax and non-tax revenues. It operates under a more autonomous structure with emphasis on digital infrastructure and coordinated enforcement."
  },
  {
    id: "26",
    category: "governance",
    question: "What is the Tax Ombud Office?",
    answer: "A new Tax Ombud Office along with an upgraded Tax Appeal Tribunal offers structured channels for taxpayer complaints, disputes, and resolution - giving taxpayers better protection."
  },
  {
    id: "27",
    category: "governance",
    question: "What are the four Acts that make up the 2025 Tax Reforms?",
    answer: "The reforms consist of: 1) Nigeria Tax Act (NTA) - consolidates tax laws, 2) Nigeria Tax Administration Act (NTAA) - administration procedures, 3) Nigeria Revenue Service Establishment Act (NRSA) - establishes NRS, 4) Joint Revenue Board Establishment Act (JRBA) - coordinates federal/state revenue."
  },
  {
    id: "28",
    category: "governance",
    question: "How are gaming and lottery businesses taxed?",
    answer: "The NTA provides for broad taxation of gaming company profits. Gaming includes gambling, wagering, video poker, roulette, craps, bingo, slot machines, drawings, and other games of chance conducted by any person."
  },
];

const FAQSection = ({ onOpenChat }: FAQSectionProps) => {
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
          <div className="text-center py-12 bg-secondary/50 rounded-2xl space-y-4">
            <p className="text-muted-foreground">No questions found matching "{searchQuery}"</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-primary hover:underline"
              >
                Clear filters
              </button>
              <span className="hidden sm:inline text-muted-foreground">or</span>
              <Button
                onClick={onOpenChat}
                className="accent-gradient text-primary-foreground"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask TaxAI
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

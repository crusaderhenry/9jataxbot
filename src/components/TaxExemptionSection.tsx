import { ShieldCheck, Building2, Package, Users, Globe, Car, Home, Briefcase, CreditCard } from "lucide-react";

// Updated with verified data from fiscalreforms.ng (Presidential Committee) and Baker Tilly (Aug 2025)
const exemptCategories = [
  {
    title: "Small Companies",
    description: "Gross turnover ≤ ₦100M AND fixed assets ≤ ₦250M",
    exemptions: ["0% CIT", "0% CGT", "0% Dev Levy", "No WHT deduction", "VAT exempt"],
    icon: Building2,
  },
  {
    title: "Low-Income Earners",
    description: "Annual taxable income ≤ ₦800,000 (gross ~₦1.2M)",
    exemptions: ["0% Personal Income Tax", "No PAYE"],
    icon: Users,
  },
  {
    title: "Essential Goods (0% VAT)",
    description: "Zero-rated for VAT under NTA 2025",
    exemptions: ["Basic food items", "Medical/pharma", "Education materials", "Baby products", "Sanitary products"],
    icon: Package,
  },
  {
    title: "Agriculture",
    description: "Crop production, livestock, dairy businesses",
    exemptions: ["5-year CIT holiday", "0% VAT on inputs", "Fertilizers/feeds exempt"],
    icon: Briefcase,
  },
  {
    title: "Personal CGT Exemptions",
    description: "Capital gains exempt from tax",
    exemptions: ["Owner-occupied house", "2 private vehicles/year", "Shares <₦150M/year"],
    icon: Home,
  },
  {
    title: "Export & Free Zones",
    description: "Non-oil exports and Free Zone operations",
    exemptions: ["0% VAT on exports", "CGT exempt (conditions)", "Free Zone incentives"],
    icon: Globe,
  },
  {
    title: "Transport & Energy",
    description: "Essential mobility and power",
    exemptions: ["Shared passenger transport", "Electric vehicles", "Solar equipment", "Diesel/petrol (suspended)"],
    icon: Car,
  },
  {
    title: "Stamp Duty Exemptions",
    description: "Electronic transfers and documents",
    exemptions: ["Transfers <₦10,000", "Salary payments", "Intra-bank transfers", "Share transfers"],
    icon: CreditCard,
  },
];

const TaxExemptionSection = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Tax Exemption Categories
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Under the 2025 Tax Reform Acts, these categories qualify for full or partial tax exemptions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exemptCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-4 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground text-base">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {category.exemptions.map((exemption, i) => (
                        <span
                          key={i}
                          className="inline-flex px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full"
                        >
                          {exemption}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TaxExemptionSection;

import { ShieldCheck, Building2, Package, Users, Globe } from "lucide-react";

const exemptCategories = [
  {
    title: "Small Companies",
    description: "Gross turnover ≤ ₦50m and fixed assets ≤ ₦250m",
    exemptions: ["CIT", "CGT", "4% Dev Levy"],
    icon: Building2,
  },
  {
    title: "Essential Goods & Services",
    description: "Zero-rated for VAT purposes",
    exemptions: ["Food items", "Medical supplies", "Educational materials"],
    icon: Package,
  },
  {
    title: "Low-Income Earners",
    description: "Annual income ≤ ₦800,000 after reliefs",
    exemptions: ["Personal Income Tax"],
    icon: Users,
  },
  {
    title: "Export Activities",
    description: "Non-oil exports and Free Zone operations",
    exemptions: ["VAT on exports", "CGT (conditions apply)"],
    icon: Globe,
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

        <div className="grid gap-4 sm:grid-cols-2">
          {exemptCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-foreground text-lg">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {category.exemptions.map((exemption, i) => (
                        <span
                          key={i}
                          className="inline-flex px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
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

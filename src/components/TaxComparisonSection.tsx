import { useState } from "react";
import { ArrowLeftRight, TrendingDown, TrendingUp, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const pitComparison = {
  old: [
    { bracket: "First ₦300,000", rate: "7%" },
    { bracket: "Next ₦300,000", rate: "11%" },
    { bracket: "Next ₦500,000", rate: "15%" },
    { bracket: "Next ₦500,000", rate: "19%" },
    { bracket: "Next ₦1,600,000", rate: "21%" },
    { bracket: "Above ₦3,200,000", rate: "24%" },
  ],
  new: [
    { bracket: "First ₦800,000", rate: "0% (Tax-free)", highlight: true },
    { bracket: "₦800,001 - ₦1,600,000", rate: "15%" },
    { bracket: "₦1,600,001 - ₦3,200,000", rate: "19%" },
    { bracket: "₦3,200,001 - ₦6,400,000", rate: "21%" },
    { bracket: "₦6,400,001 - ₦50,000,000", rate: "24%" },
    { bracket: "Above ₦50,000,000", rate: "25%" },
  ],
};

const vatComparison = {
  old: { rate: "7.5%", inputRecovery: "Limited to goods only" },
  new: { rate: "7.5%", inputRecovery: "Full recovery on services & capital assets", highlight: true },
};

const citComparison = {
  old: [
    { type: "Small companies (< ₦25m)", rate: "0%" },
    { type: "Medium companies (₦25m - ₦100m)", rate: "20%" },
    { type: "Large companies (> ₦100m)", rate: "30%" },
  ],
  new: [
    { type: "Small companies (≤ ₦50m turnover, ≤ ₦250m assets)", rate: "0%", highlight: true },
    { type: "All other companies", rate: "30%" },
    { type: "Minimum ETR for large companies (₦50bn+ turnover)", rate: "15% floor", highlight: true },
  ],
};

const keyBenefits = [
  "Tax-free threshold increased from ₦300,000 to ₦800,000 annually",
  "Small company exemption threshold raised to ₦50m turnover",
  "Full VAT input recovery now includes services and capital assets",
  "Simplified tax structure with fewer brackets",
  "New Economic Development Incentive replaces Pioneer Status",
  "Unified 4% Development Levy replaces multiple levies",
];

const TaxComparisonSection = () => {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <ArrowLeftRight className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Old vs New Tax Regime
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compare the key changes between the old tax laws and the 2025 Tax Reform Acts.
          </p>
        </div>

        <Tabs defaultValue="pit" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pit" className="font-medium">Personal Income</TabsTrigger>
            <TabsTrigger value="cit" className="font-medium">Corporate Tax</TabsTrigger>
            <TabsTrigger value="vat" className="font-medium">VAT</TabsTrigger>
          </TabsList>

          <TabsContent value="pit" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Old Regime */}
              <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-foreground">Old Regime</h3>
                </div>
                <div className="space-y-2">
                  {pitComparison.old.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{item.bracket}</span>
                      <span className="font-medium text-foreground">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Regime */}
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-primary">2025 Reform</h3>
                </div>
                <div className="space-y-2">
                  {pitComparison.new.map((item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between text-sm py-2 border-b border-primary/10 last:border-0 ${
                        item.highlight ? "bg-primary/10 -mx-2 px-2 rounded" : ""
                      }`}
                    >
                      <span className="text-muted-foreground">{item.bracket}</span>
                      <span className={`font-medium ${item.highlight ? "text-primary" : "text-foreground"}`}>
                        {item.rate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cit" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Old Regime */}
              <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-foreground">Old Regime</h3>
                </div>
                <div className="space-y-2">
                  {citComparison.old.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{item.type}</span>
                      <span className="font-medium text-foreground">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Regime */}
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-primary">2025 Reform</h3>
                </div>
                <div className="space-y-2">
                  {citComparison.new.map((item, i) => (
                    <div
                      key={i}
                      className={`flex justify-between text-sm py-2 border-b border-primary/10 last:border-0 ${
                        item.highlight ? "bg-primary/10 -mx-2 px-2 rounded" : ""
                      }`}
                    >
                      <span className="text-muted-foreground">{item.type}</span>
                      <span className={`font-medium ${item.highlight ? "text-primary" : "text-foreground"}`}>
                        {item.rate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vat" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Old Regime */}
              <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-foreground">Old Regime</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-border/50">
                    <span className="text-muted-foreground">VAT Rate</span>
                    <span className="font-medium text-foreground">{vatComparison.old.rate}</span>
                  </div>
                  <div className="text-sm py-2">
                    <span className="text-muted-foreground">Input Recovery: </span>
                    <span className="text-foreground">{vatComparison.old.inputRecovery}</span>
                  </div>
                </div>
              </div>

              {/* New Regime */}
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-primary">2025 Reform</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-primary/10">
                    <span className="text-muted-foreground">VAT Rate</span>
                    <span className="font-medium text-foreground">{vatComparison.new.rate}</span>
                  </div>
                  <div className="text-sm py-2 bg-primary/10 -mx-2 px-2 rounded">
                    <span className="text-muted-foreground">Input Recovery: </span>
                    <span className="text-primary font-medium">{vatComparison.new.inputRecovery}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Key Benefits */}
        <div className="mt-10 bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-display font-semibold text-foreground text-lg mb-4">
            Key Benefits of the 2025 Reforms
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {keyBenefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxComparisonSection;

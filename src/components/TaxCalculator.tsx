import { useState } from "react";
import { Calculator, ArrowRight, Info, HelpCircle, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaxCalculatorProps {
  open: boolean;
  onClose: () => void;
}

// 2025 Tax Brackets (based on reforms)
const taxBrackets = [
  { min: 0, max: 800000, rate: 0, description: "Tax-free allowance" },
  { min: 800001, max: 1600000, rate: 0.15, description: "15% bracket" },
  { min: 1600001, max: 3200000, rate: 0.19, description: "19% bracket" },
  { min: 3200001, max: 6400000, rate: 0.21, description: "21% bracket" },
  { min: 6400001, max: 50000000, rate: 0.24, description: "24% bracket" },
  { min: 50000001, max: Infinity, rate: 0.25, description: "25% bracket" },
];

// Tax exempt categories based on 2025 reforms
const exemptCategories = [
  {
    title: "Small Companies",
    description: "Gross turnover ≤ ₦50m and fixed assets ≤ ₦250m",
    exemptions: ["CIT", "CGT", "4% Dev Levy"],
  },
  {
    title: "Essential Goods & Services",
    description: "Zero-rated for VAT purposes",
    exemptions: ["Food items", "Medical supplies", "Educational materials"],
  },
  {
    title: "Low-Income Earners",
    description: "Annual income ≤ ₦800,000 after reliefs",
    exemptions: ["Personal Income Tax"],
  },
  {
    title: "Export Activities",
    description: "Non-oil exports and Free Zone operations",
    exemptions: ["VAT on exports", "CGT (conditions apply)"],
  },
];

const calculateTax = (annualIncome: number): { tax: number; effectiveRate: number; breakdown: { bracket: string; tax: number }[] } => {
  let remainingIncome = annualIncome;
  let totalTax = 0;
  const breakdown: { bracket: string; tax: number }[] = [];

  for (const bracket of taxBrackets) {
    if (remainingIncome <= 0) break;

    const taxableInThisBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min + 1
    );
    
    const taxInBracket = taxableInThisBracket * bracket.rate;
    totalTax += taxInBracket;

    if (taxableInThisBracket > 0 && bracket.rate > 0) {
      breakdown.push({
        bracket: `₦${bracket.min.toLocaleString()} - ₦${bracket.max === Infinity ? '50M+' : bracket.max.toLocaleString()} @ ${bracket.rate * 100}%`,
        tax: taxInBracket,
      });
    } else if (bracket.rate === 0 && taxableInThisBracket > 0) {
      breakdown.push({
        bracket: `First ₦800,000 (Tax-free)`,
        tax: 0,
      });
    }

    remainingIncome -= taxableInThisBracket;
  }

  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

  return { tax: totalTax, effectiveRate, breakdown };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const TaxCalculator = ({ open, onClose }: TaxCalculatorProps) => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [result, setResult] = useState<{ tax: number; effectiveRate: number; breakdown: { bracket: string; tax: number }[] } | null>(null);

  const handleCalculate = () => {
    const monthly = parseFloat(monthlyIncome.replace(/,/g, ''));
    if (isNaN(monthly) || monthly <= 0) return;
    
    const annual = monthly * 12;
    const taxResult = calculateTax(annual);
    setResult(taxResult);
  };

  const handleInputChange = (value: string) => {
    const cleaned = value.replace(/[^0-9,]/g, '');
    setMonthlyIncome(cleaned);
    setResult(null);
  };

  const annualIncome = parseFloat(monthlyIncome.replace(/,/g, '')) * 12 || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-full max-h-full sm:max-w-full sm:max-h-full rounded-none overflow-y-auto" style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Calculator className="w-5 h-5 text-primary" />
              Tax Calculator
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="income" className="text-sm font-medium">
                  Monthly Gross Income (₦)
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your total monthly earnings before any deductions, including basic salary, allowances, bonuses, and other taxable benefits.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="income"
                type="text"
                placeholder="e.g. 500,000"
                value={monthlyIncome}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg h-12"
              />
              {monthlyIncome && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Annual income: {formatCurrency(annualIncome)}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Monthly income × 12 months</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            <Button 
              onClick={handleCalculate} 
              className="w-full accent-gradient text-primary-foreground"
              disabled={!monthlyIncome || parseFloat(monthlyIncome.replace(/,/g, '')) <= 0}
            >
              Calculate Tax
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Results */}
            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <p className="text-sm text-muted-foreground">Annual Tax</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total personal income tax payable for the year based on progressive brackets</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-primary font-display">
                      {formatCurrency(result.tax)}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Monthly Tax</p>
                    <p className="text-2xl font-bold text-foreground font-display">
                      {formatCurrency(result.tax / 12)}
                    </p>
                  </div>
                </div>

                {/* Effective rate */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The actual percentage of your income paid as tax. This is lower than the marginal rate due to progressive brackets.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-lg font-semibold">{result.effectiveRate.toFixed(2)}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full accent-gradient rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(result.effectiveRate * 4, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Tax Breakdown</p>
                  {result.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{item.bracket}</span>
                      <span className="font-medium">{formatCurrency(item.tax)}</span>
                    </div>
                  ))}
                </div>

                {/* Net income */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Estimated Annual Net Income</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your income after personal income tax. Other deductions (pension, NHF, etc.) not included.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xl font-bold text-primary font-display">
                      {formatCurrency(annualIncome - result.tax)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly: {formatCurrency((annualIncome - result.tax) / 12)}
                  </p>
                </div>
              </div>
            )}

            {/* Tax Exemption Categories */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Tax Exemption Categories</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {exemptCategories.map((category, index) => (
                  <div key={index} className="bg-secondary/50 rounded-xl p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm">{category.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {category.exemptions.map((exemption, i) => (
                            <span key={i} className="inline-flex px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              {exemption}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                This calculator provides estimates based on the 2025 tax reform brackets. 
                Actual tax may vary based on individual circumstances, reliefs, and deductions. 
                Consult a tax professional for accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxCalculator;

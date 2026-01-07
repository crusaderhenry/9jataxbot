import { useState } from "react";
import { Calculator, ArrowRight, Info, HelpCircle, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

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

interface TaxReliefs {
  pensionRate: number; // 0-20%
  mortgageInterest: number; // up to ₦2M annually
  childEducation: number; // number of children (up to 4)
  nhfContribution: boolean; // 2.5% of basic
}

const calculateTax = (
  annualIncome: number,
  reliefs: TaxReliefs
): { 
  tax: number; 
  effectiveRate: number; 
  breakdown: { bracket: string; tax: number }[];
  totalReliefs: number;
  taxableIncome: number;
} => {
  // Calculate reliefs
  const pensionRelief = annualIncome * (reliefs.pensionRate / 100);
  const mortgageRelief = Math.min(reliefs.mortgageInterest, 2000000);
  const childEducationRelief = reliefs.childEducation * 250000; // ₦250,000 per child
  const nhfRelief = reliefs.nhfContribution ? annualIncome * 0.025 : 0;
  
  // Consolidated Relief Allowance (CRA): Higher of ₦800,000 or 20% of gross + 20% of earned income
  const craBase = Math.max(800000, annualIncome * 0.2);
  const craEarned = annualIncome * 0.2;
  const totalCRA = craBase + craEarned;
  
  const totalReliefs = pensionRelief + mortgageRelief + childEducationRelief + nhfRelief + totalCRA;
  const taxableIncome = Math.max(0, annualIncome - totalReliefs);
  
  let remainingIncome = taxableIncome;
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

  return { tax: totalTax, effectiveRate, breakdown, totalReliefs, taxableIncome };
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
  const [reliefs, setReliefs] = useState<TaxReliefs>({
    pensionRate: 8,
    mortgageInterest: 0,
    childEducation: 0,
    nhfContribution: false,
  });
  const [result, setResult] = useState<{ 
    tax: number; 
    effectiveRate: number; 
    breakdown: { bracket: string; tax: number }[];
    totalReliefs: number;
    taxableIncome: number;
  } | null>(null);

  const handleCalculate = () => {
    const monthly = parseFloat(monthlyIncome.replace(/,/g, ''));
    if (isNaN(monthly) || monthly <= 0) return;
    
    const annual = monthly * 12;
    const taxResult = calculateTax(annual, reliefs);
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
        <div className="max-w-2xl mx-auto w-full pb-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Calculator className="w-5 h-5 text-primary" />
              Tax Calculator
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Income Input */}
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
                </div>
              )}
            </div>

            {/* Tax Reliefs Section */}
            <div className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-foreground">Tax Reliefs & Deductions</h3>
              </div>

              {/* Pension Contribution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Pension Contribution</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Contributions to approved pension schemes are tax-deductible up to 20% of your income.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-medium text-primary">{reliefs.pensionRate}%</span>
                </div>
                <Slider
                  value={[reliefs.pensionRate]}
                  onValueChange={(value) => setReliefs({ ...reliefs, pensionRate: value[0] })}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Up to 20% of income is tax-deductible</p>
              </div>

              {/* Mortgage Interest */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Annual Mortgage Interest (₦)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Interest paid on mortgage for owner-occupied residential property. Maximum deduction: ₦2,000,000 per year.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  type="text"
                  placeholder="e.g. 1,000,000"
                  value={reliefs.mortgageInterest > 0 ? reliefs.mortgageInterest.toLocaleString() : ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value.replace(/,/g, '')) || 0;
                    setReliefs({ ...reliefs, mortgageInterest: Math.min(val, 2000000) });
                  }}
                  className="h-10"
                />
                <p className="text-xs text-muted-foreground">Maximum: ₦2,000,000 annually</p>
              </div>

              {/* Child Education */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Children in Education</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Child education allowance of ₦250,000 per child, for up to 4 children.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm font-medium text-primary">{reliefs.childEducation} child{reliefs.childEducation !== 1 ? 'ren' : ''}</span>
                </div>
                <Slider
                  value={[reliefs.childEducation]}
                  onValueChange={(value) => setReliefs({ ...reliefs, childEducation: value[0] })}
                  max={4}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">₦250,000 allowance per child (max 4)</p>
              </div>

              {/* NHF Contribution */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">NHF Contribution (2.5%)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>National Housing Fund contribution at 2.5% of basic salary is tax-deductible.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  checked={reliefs.nhfContribution}
                  onCheckedChange={(checked) => setReliefs({ ...reliefs, nhfContribution: checked })}
                />
              </div>
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
                          <p>Total personal income tax payable for the year after reliefs</p>
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

                {/* Reliefs summary */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Reliefs Applied</span>
                    <span className="text-lg font-semibold text-primary">{formatCurrency(result.totalReliefs)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Taxable Income</span>
                    <span className="font-medium text-foreground">{formatCurrency(result.taxableIncome)}</span>
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
                          <p>The actual percentage of your gross income paid as tax after all reliefs.</p>
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
                {result.breakdown.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Tax Breakdown</p>
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{item.bracket}</span>
                        <span className="font-medium">{formatCurrency(item.tax)}</span>
                      </div>
                    ))}
                  </div>
                )}

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
                          <p>Your gross income minus tax. Pension/NHF contributions deducted separately by employer.</p>
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

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                This calculator provides estimates based on the 2025 tax reform brackets and includes CRA (Consolidated Relief Allowance). 
                Actual tax may vary based on individual circumstances. Consult a tax professional for accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxCalculator;

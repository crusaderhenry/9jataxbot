import { useState } from "react";
import { Calculator, ArrowRight, Info, HelpCircle, RotateCcw, User, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TaxCalculatorProps {
  open: boolean;
  onClose: () => void;
}

type EntityType = 'personal' | 'business' | 'company';

// 2025 Tax Brackets (Personal Income Tax - for Personal & Business Name)
const taxBrackets = [
  { min: 0, max: 800000, rate: 0, description: "Tax-free allowance" },
  { min: 800001, max: 1600000, rate: 0.15, description: "15% bracket" },
  { min: 1600001, max: 3200000, rate: 0.19, description: "19% bracket" },
  { min: 3200001, max: 6400000, rate: 0.21, description: "21% bracket" },
  { min: 6400001, max: 50000000, rate: 0.24, description: "24% bracket" },
  { min: 50000001, max: Infinity, rate: 0.25, description: "25% bracket" },
];

// 2025 Nigeria Tax Act: Development Levy replaces Tertiary Education Tax
// Small companies (Turnover ≤ ₦100M) are exempt from CIT, CGT, and Development Levy
const DEVELOPMENT_LEVY_RATE = 0.04; // 4% for large companies only

const calculatePersonalTax = (annualIncome: number): { 
  tax: number; 
  effectiveRate: number; 
  breakdown: { bracket: string; tax: number }[];
} => {
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

// 2025 Nigeria Tax Act: Small = Turnover ≤ ₦100M (exempt), Large = Turnover > ₦100M (30% CIT + 4% Dev Levy)
const calculateCompanyTax = (turnover: number, profit: number): {
  tier: 'small' | 'large';
  citRate: number;
  cit: number;
  developmentLevy: number;
  totalTax: number;
  effectiveRate: number;
} => {
  let tier: 'small' | 'large';
  let citRate: number;

  // Small company: Turnover ≤ ₦100M - exempt from CIT, CGT, and Development Levy
  // Large company: Turnover > ₦100M - 30% CIT + 4% Development Levy
  if (turnover <= 100_000_000) {
    tier = 'small';
    citRate = 0;
  } else {
    tier = 'large';
    citRate = 0.30;
  }

  const cit = profit * citRate;
  // Development Levy only applies to large companies
  const developmentLevy = tier === 'large' ? profit * DEVELOPMENT_LEVY_RATE : 0;
  const totalTax = cit + developmentLevy;
  const effectiveRate = profit > 0 ? (totalTax / profit) * 100 : 0;

  return { tier, citRate, cit, developmentLevy, totalTax, effectiveRate };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatInputValue = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  return numericValue ? Number(numericValue).toLocaleString('en-NG') : '';
};

const parseInputValue = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};

const TaxCalculator = ({ open, onClose }: TaxCalculatorProps) => {
  const [entityType, setEntityType] = useState<EntityType>('personal');
  
  // Personal inputs
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [personalResult, setPersonalResult] = useState<{ 
    tax: number; 
    effectiveRate: number; 
    breakdown: { bracket: string; tax: number }[];
  } | null>(null);

  // Business Name inputs
  const [annualProfit, setAnnualProfit] = useState<string>("");
  const [businessResult, setBusinessResult] = useState<{ 
    tax: number; 
    effectiveRate: number; 
    breakdown: { bracket: string; tax: number }[];
  } | null>(null);

  // Limited Company inputs
  const [annualTurnover, setAnnualTurnover] = useState<string>("");
  const [taxableProfit, setTaxableProfit] = useState<string>("");
  const [companyResult, setCompanyResult] = useState<{
    tier: 'small' | 'large';
    citRate: number;
    cit: number;
    developmentLevy: number;
    totalTax: number;
    effectiveRate: number;
  } | null>(null);

  const handleCalculatePersonal = () => {
    const monthly = parseInputValue(monthlyIncome);
    if (monthly <= 0) return;
    const annual = monthly * 12;
    setPersonalResult(calculatePersonalTax(annual));
  };

  const handleCalculateBusiness = () => {
    const profit = parseInputValue(annualProfit);
    if (profit <= 0) return;
    setBusinessResult(calculatePersonalTax(profit));
  };

  const handleCalculateCompany = () => {
    const turnover = parseInputValue(annualTurnover);
    const profit = parseInputValue(taxableProfit);
    if (turnover <= 0 || profit <= 0) return;
    setCompanyResult(calculateCompanyTax(turnover, profit));
  };

  const handleReset = () => {
    if (entityType === 'personal') {
      setMonthlyIncome("");
      setPersonalResult(null);
    } else if (entityType === 'business') {
      setAnnualProfit("");
      setBusinessResult(null);
    } else {
      setAnnualTurnover("");
      setTaxableProfit("");
      setCompanyResult(null);
    }
  };

  const personalAnnualIncome = parseInputValue(monthlyIncome) * 12;
  const businessProfitValue = parseInputValue(annualProfit);
  const companyTurnoverValue = parseInputValue(annualTurnover);
  const companyProfitValue = parseInputValue(taxableProfit);

  const getTierBadge = (tier: 'small' | 'large') => {
    const config = {
      small: { label: 'Small Company (0% CIT)', variant: 'secondary' as const },
      large: { label: 'Large Company (30% CIT + 4% Dev Levy)', variant: 'destructive' as const },
    };
    return config[tier];
  };

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
            <Tabs value={entityType} onValueChange={(v) => setEntityType(v as EntityType)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <User className="w-4 h-4 hidden sm:block" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Briefcase className="w-4 h-4 hidden sm:block" />
                  Business Name
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Building2 className="w-4 h-4 hidden sm:block" />
                  Limited Co.
                </TabsTrigger>
              </TabsList>

              {/* Personal Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="personal-income" className="text-sm font-medium">
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
                    id="personal-income"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 500,000"
                    value={monthlyIncome}
                    onChange={(e) => { setMonthlyIncome(formatInputValue(e.target.value)); setPersonalResult(null); }}
                    className="text-lg h-12"
                  />
                  {monthlyIncome && (
                    <div className="text-sm text-muted-foreground">
                      Annual income: {formatCurrency(personalAnnualIncome)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCalculatePersonal} 
                    className="flex-1 accent-gradient text-primary-foreground"
                    disabled={!monthlyIncome || parseInputValue(monthlyIncome) <= 0}
                  >
                    Calculate Tax
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={!monthlyIncome && !personalResult}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {personalResult && (
                  <TaxResultDisplay 
                    result={personalResult} 
                    annualIncome={personalAnnualIncome}
                    entityType="personal"
                  />
                )}
              </TabsContent>

              {/* Business Name Tab */}
              <TabsContent value="business" className="space-y-6 mt-6">
                <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    A Business Name is not a separate legal entity. Profits are taxed as <strong>Personal Income Tax</strong> in the owner's hands.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="business-profit" className="text-sm font-medium">
                      Annual Business Profit (₦)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Your total annual business profit after deducting allowable business expenses from revenue.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="business-profit"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 5,000,000"
                    value={annualProfit}
                    onChange={(e) => { setAnnualProfit(formatInputValue(e.target.value)); setBusinessResult(null); }}
                    className="text-lg h-12"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCalculateBusiness} 
                    className="flex-1 accent-gradient text-primary-foreground"
                    disabled={!annualProfit || parseInputValue(annualProfit) <= 0}
                  >
                    Calculate Tax
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={!annualProfit && !businessResult}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {businessResult && (
                  <TaxResultDisplay 
                    result={businessResult} 
                    annualIncome={businessProfitValue}
                    entityType="business"
                  />
                )}
              </TabsContent>

              {/* Limited Company Tab */}
              <TabsContent value="company" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="company-turnover" className="text-sm font-medium">
                        Annual Gross Turnover (₦)
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Total revenue/sales for the year. This determines your company size tier and applicable CIT rate.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="company-turnover"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 50,000,000"
                      value={annualTurnover}
                      onChange={(e) => { setAnnualTurnover(formatInputValue(e.target.value)); setCompanyResult(null); }}
                      className="text-lg h-12"
                    />
                    {annualTurnover && (
                      <div className="flex items-center gap-2">
                        <Badge variant={companyTurnoverValue <= 100_000_000 ? 'secondary' : 'destructive'}>
                          {companyTurnoverValue <= 100_000_000 
                            ? 'Small Company (0% CIT)' 
                            : 'Large Company (30% CIT + 4% Dev Levy)'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="company-profit" className="text-sm font-medium">
                        Taxable Profit (₦)
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Assessable profit after all allowable deductions. This is the base for calculating Company Income Tax and Development Levy.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="company-profit"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 10,000,000"
                      value={taxableProfit}
                      onChange={(e) => { setTaxableProfit(formatInputValue(e.target.value)); setCompanyResult(null); }}
                      className="text-lg h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCalculateCompany} 
                    className="flex-1 accent-gradient text-primary-foreground"
                    disabled={!annualTurnover || !taxableProfit || companyTurnoverValue <= 0 || companyProfitValue <= 0}
                  >
                    Calculate Tax
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={!annualTurnover && !taxableProfit && !companyResult}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {companyResult && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Badge {...getTierBadge(companyResult.tier)}>
                        {getTierBadge(companyResult.tier).label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        CIT Rate: {(companyResult.citRate * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-primary/10 rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Tax Liability</p>
                        <p className="text-2xl font-bold text-primary font-display">
                          {formatCurrency(companyResult.totalTax)}
                        </p>
                      </div>
                      <div className="bg-secondary rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Effective Rate</p>
                        <p className="text-2xl font-bold text-foreground font-display">
                          {companyResult.effectiveRate.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Tax Breakdown</p>
                      <div className="flex items-center justify-between text-sm py-2 border-b border-border">
                        <span className="text-muted-foreground">Company Income Tax ({(companyResult.citRate * 100).toFixed(0)}%)</span>
                        <span className="font-medium">{formatCurrency(companyResult.cit)}</span>
                      </div>
                      {companyResult.tier === 'large' && (
                        <div className="flex items-center justify-between text-sm py-2 border-b border-border">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Development Levy (4%)</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Large companies pay 4% of assessable profit as Development Levy (replaced Tertiary Education Tax)</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span className="font-medium">{formatCurrency(companyResult.developmentLevy)}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Net Profit After Tax</span>
                        <span className="text-xl font-bold text-primary font-display">
                          {formatCurrency(companyProfitValue - companyResult.totalTax)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                This calculator provides estimates based on 2025 tax rates. 
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

// Shared result display component for Personal & Business Name
const TaxResultDisplay = ({ 
  result, 
  annualIncome,
  entityType 
}: { 
  result: { tax: number; effectiveRate: number; breakdown: { bracket: string; tax: number }[] };
  annualIncome: number;
  entityType: 'personal' | 'business';
}) => (
  <div className="space-y-4 animate-fade-in">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-primary/10 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <p className="text-sm text-muted-foreground">Annual Tax</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Total personal income tax payable for the year</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-2xl font-bold text-primary font-display">
          {formatCurrency(result.tax)}
        </p>
      </div>
      <div className="bg-secondary rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          {entityType === 'personal' ? 'Monthly Tax' : 'Quarterly Tax'}
        </p>
        <p className="text-2xl font-bold text-foreground font-display">
          {formatCurrency(entityType === 'personal' ? result.tax / 12 : result.tax / 4)}
        </p>
      </div>
    </div>

    <div className="bg-muted/50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>The actual percentage of your income paid as tax due to progressive brackets.</p>
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

    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-medium">
            {entityType === 'personal' ? 'Estimated Annual Net Income' : 'Net Profit After Tax'}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{entityType === 'personal' 
                ? 'Your income after personal income tax. Other deductions not included.' 
                : 'Business profit remaining after paying personal income tax.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-xl font-bold text-primary font-display">
          {formatCurrency(annualIncome - result.tax)}
        </span>
      </div>
      {entityType === 'personal' && (
        <p className="text-sm text-muted-foreground mt-1">
          Monthly: {formatCurrency((annualIncome - result.tax) / 12)}
        </p>
      )}
    </div>
  </div>
);

export default TaxCalculator;

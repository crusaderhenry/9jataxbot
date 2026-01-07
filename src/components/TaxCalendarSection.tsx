import { Calendar, Bell, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const taxDeadlines = [
  {
    date: "January 31, 2026",
    title: "PAYE Monthly Returns",
    description: "Submit PAYE returns for December 2025 and remit taxes deducted",
    category: "PAYE",
    urgent: false,
  },
  {
    date: "February 28, 2026",
    title: "Annual PAYE Returns",
    description: "File annual PAYE returns for the 2025 tax year",
    category: "PAYE",
    urgent: false,
  },
  {
    date: "March 31, 2026",
    title: "Personal Income Tax Returns",
    description: "Individual taxpayers must file their annual returns for 2025",
    category: "PIT",
    urgent: true,
  },
  {
    date: "March 31, 2026",
    title: "First VAT Quarterly Return",
    description: "File VAT returns for Q1 2026 (January - March)",
    category: "VAT",
    urgent: true,
  },
  {
    date: "June 30, 2026",
    title: "Company Income Tax Returns",
    description: "Companies with December year-end must file CIT returns",
    category: "CIT",
    urgent: false,
  },
  {
    date: "June 30, 2026",
    title: "Second VAT Quarterly Return",
    description: "File VAT returns for Q2 2026 (April - June)",
    category: "VAT",
    urgent: false,
  },
  {
    date: "July 31, 2026",
    title: "Capital Gains Tax Returns",
    description: "File CGT returns for asset disposals in the previous year",
    category: "CGT",
    urgent: false,
  },
  {
    date: "September 30, 2026",
    title: "Third VAT Quarterly Return",
    description: "File VAT returns for Q3 2026 (July - September)",
    category: "VAT",
    urgent: false,
  },
  {
    date: "December 31, 2026",
    title: "Fourth VAT Quarterly Return",
    description: "File VAT returns for Q4 2026 (October - December)",
    category: "VAT",
    urgent: false,
  },
  {
    date: "Monthly (21st)",
    title: "VAT Monthly Returns",
    description: "Monthly VAT returns due by the 21st of the following month",
    category: "VAT",
    urgent: false,
  },
  {
    date: "Monthly (10th)",
    title: "PAYE Remittance",
    description: "Remit PAYE taxes deducted by the 10th of the following month",
    category: "PAYE",
    urgent: false,
  },
];

const categoryColors: Record<string, string> = {
  PIT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  CIT: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  VAT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PAYE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CGT: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const TaxCalendarSection = () => {
  // Separate monthly recurring from specific dates
  const specificDates = taxDeadlines.filter((d) => !d.date.startsWith("Monthly"));
  const recurringDates = taxDeadlines.filter((d) => d.date.startsWith("Monthly"));

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              2026 Tax Calendar
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Key filing deadlines under the 2025 Tax Reform Acts. Mark these dates to stay compliant.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <Badge key={cat} variant="outline" className={`${color} border`}>
              {cat}
            </Badge>
          ))}
        </div>

        {/* Specific Dates Timeline */}
        <div className="space-y-4 mb-10">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Key Deadlines
          </h3>
          <div className="grid gap-3">
            {specificDates.map((deadline, index) => (
              <div
                key={index}
                className={`bg-card rounded-xl p-4 border transition-shadow hover:shadow-md ${
                  deadline.urgent ? "border-primary/50 bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-24 flex-shrink-0">
                      <p className="text-sm font-medium text-primary">{deadline.date.split(",")[0]}</p>
                      <p className="text-xs text-muted-foreground">{deadline.date.split(", ")[1]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">{deadline.title}</h4>
                        <Badge variant="outline" className={`${categoryColors[deadline.category]} border text-xs`}>
                          {deadline.category}
                        </Badge>
                        {deadline.urgent && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{deadline.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Deadlines */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Monthly Recurring Deadlines
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {recurringDates.map((deadline, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {deadline.date.match(/\d+/)?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-foreground text-sm">{deadline.title}</h4>
                      <Badge variant="outline" className={`${categoryColors[deadline.category]} border text-xs`}>
                        {deadline.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{deadline.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-muted/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            These deadlines are based on the 2025 Tax Reform Acts. Specific deadlines may vary based on your 
            company's financial year-end or registration date. Consult with a tax professional for personalized guidance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TaxCalendarSection;

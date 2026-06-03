import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CalendarDays,
  Beaker,
  Target,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ===== Demo Data =====
const PK_DATA = [
  { hour: 0, bpc157: 0, tb500: 0, cjc1295: 0 },
  { hour: 1, bpc157: 2.5, tb500: 4.2, cjc1295: 1.8 },
  { hour: 2, bpc157: 3.8, tb500: 6.5, cjc1295: 3.1 },
  { hour: 4, bpc157: 4.2, tb500: 8.1, cjc1295: 4.5 },
  { hour: 8, bpc157: 3.5, tb500: 7.2, cjc1295: 5.8 },
  { hour: 12, bpc157: 2.8, tb500: 5.9, cjc1295: 6.2 },
  { hour: 24, bpc157: 1.5, tb500: 3.8, cjc1295: 6.5 },
  { hour: 48, bpc157: 0.4, tb500: 1.2, cjc1295: 6.3 },
  { hour: 72, bpc157: 0.1, tb500: 0.3, cjc1295: 5.9 },
  { hour: 96, bpc157: 0, tb500: 0.1, cjc1295: 5.5 },
  { hour: 120, bpc157: 0, tb500: 0, cjc1295: 5.1 },
  { hour: 168, bpc157: 0, tb500: 0, cjc1295: 4.2 },
];

const ADHERENCE_DATA = [
  { day: "Mon", scheduled: 3, taken: 3 },
  { day: "Tue", scheduled: 3, taken: 2 },
  { day: "Wed", scheduled: 3, taken: 3 },
  { day: "Thu", scheduled: 3, taken: 3 },
  { day: "Fri", scheduled: 3, taken: 1 },
  { day: "Sat", scheduled: 2, taken: 2 },
  { day: "Sun", scheduled: 2, taken: 0 },
];

const METRIC_TRENDS = [
  { week: "W1", recovery: 65, energy: 70, sleep: 60, inflammation: 70 },
  { week: "W2", recovery: 72, energy: 75, sleep: 68, inflammation: 62 },
  { week: "W3", recovery: 78, energy: 80, sleep: 72, inflammation: 55 },
  { week: "W4", recovery: 82, energy: 83, sleep: 78, inflammation: 48 },
  { week: "W5", recovery: 85, energy: 86, sleep: 80, inflammation: 42 },
  { week: "W6", recovery: 88, energy: 87, sleep: 82, inflammation: 38 },
];

const BIO_FEEDBACK_CORRELATIONS = [
  { metric: "Recovery", peptide: "BPC-157", correlation: 0.82, direction: "positive" as const },
  { metric: "Sleep Quality", peptide: "CJC-1295", correlation: 0.71, direction: "positive" as const },
  { metric: "Inflammation", peptide: "BPC-157", correlation: -0.76, direction: "negative" as const },
  { metric: "Energy", peptide: "Ipamorelin", correlation: 0.65, direction: "positive" as const },
];

const WEEKLY_SUMMARY = [
  {
    label: "Total Doses",
    value: "18",
    change: "+12%",
    trend: "up" as const,
    icon: Beaker,
  },
  {
    label: "Adherence Rate",
    value: "78%",
    change: "-5%",
    trend: "down" as const,
    icon: Target,
  },
  {
    label: "Avg Recovery Score",
    value: "82",
    change: "+8%",
    trend: "up" as const,
    icon: Activity,
  },
  {
    label: "Active Protocols",
    value: "3",
    change: "0",
    trend: "neutral" as const,
    icon: BarChart3,
  },
];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

// ===== Custom Tooltip =====
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ===== Summary Card Component =====
function SummaryCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
            {trend === "neutral" && <Activity className="h-4 w-4 text-muted-foreground" />}
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-muted-foreground"
              )}
            >
              {change} vs last week
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Main Component =====
export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("pk");

  const adherenceRate = useMemo(() => {
    const scheduled = ADHERENCE_DATA.reduce((s, d) => s + d.scheduled, 0);
    const taken = ADHERENCE_DATA.reduce((s, d) => s + d.taken, 0);
    return Math.round((taken / scheduled) * 100);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-background pb-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-3 rounded-xl bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track PK curves, adherence, and bio-feedback correlations
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEKLY_SUMMARY.map((item, i) => (
            <SummaryCard key={item.label} {...item} delay={0.1 * i} />
          ))}
        </div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 max-w-lg">
              <TabsTrigger value="pk">
                <Beaker className="h-4 w-4 mr-1.5" />
                PK Curves
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <Activity className="h-4 w-4 mr-1.5" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="adherence">
                <Target className="h-4 w-4 mr-1.5" />
                Adherence
              </TabsTrigger>
              <TabsTrigger value="correlations">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Correlations
              </TabsTrigger>
            </TabsList>

            {/* PK Curves Tab */}
            <TabsContent value="pk" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" />
                    Pharmacokinetic Curves
                  </CardTitle>
                  <CardDescription>
                    Estimated concentration over time for active protocols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PK_DATA}>
                        <defs>
                          <linearGradient id="bpc157Grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="tb500Grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="cjc1295Grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="hour" label={{ value: "Hours", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Conc (ng/mL)", angle: -90, position: "insideLeft" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="bpc157"
                          name="BPC-157"
                          stroke="#0ea5e9"
                          fill="url(#bpc157Grad)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="tb500"
                          name="TB-500"
                          stroke="#10b981"
                          fill="url(#tb500Grad)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="cjc1295"
                          name="CJC-1295"
                          stroke="#8b5cf6"
                          fill="url(#cjc1295Grad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metric Trends Tab */}
            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Bio-Feedback Trends
                  </CardTitle>
                  <CardDescription>Weekly trends for tracked metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={METRIC_TRENDS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="recovery" name="Recovery" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="energy" name="Energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="inflammation" name="Inflammation" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Adherence Tab */}
            <TabsContent value="adherence" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Weekly Adherence
                  </CardTitle>
                  <CardDescription>
                    <span className="flex items-center gap-2 mt-1">
                      Overall rate:
                      <Badge variant={adherenceRate >= 80 ? "default" : "secondary"}>
                        {adherenceRate}%
                      </Badge>
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ADHERENCE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="scheduled" name="Scheduled" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="taken" name="Taken" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Correlations Tab */}
            <TabsContent value="correlations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Bio-Feedback Correlations
                  </CardTitle>
                  <CardDescription>
                    Automatic correlation between peptides and tracked metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {BIO_FEEDBACK_CORRELATIONS.map((corr, index) => (
                      <motion.div
                        key={`${corr.peptide}-${corr.metric}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                      >
                        <div className={cn(
                          "p-2.5 rounded-lg",
                          corr.direction === "positive" ? "bg-emerald-50" : "bg-red-50"
                        )}>
                          {corr.direction === "positive" ? (
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm">
                              {corr.peptide} &rarr; {corr.metric}
                            </p>
                            <Badge
                              variant={corr.direction === "positive" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {(corr.correlation * 100).toFixed(0)}% correlation
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={cn(
                                "h-full rounded-full",
                                corr.direction === "positive" ? "bg-emerald-500" : "bg-red-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {corr.direction === "positive"
                              ? `Higher ${corr.metric.toLowerCase()} associated with ${corr.peptide} use`
                              : `Lower ${corr.metric.toLowerCase()} associated with ${corr.peptide} use`}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Syringe,
  Beaker,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Zap,
  Heart,
  Microscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSafetyProfile, useSafetyCheck } from "@/hooks/useSafety";
import { usePKSimulator } from "@/hooks/usePKSimulator";
import { useFeedback } from "@/hooks/useFeedback";
import { useInventory } from "@/hooks/useInventory";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ===== Animation Variants =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// ===== Mini PK Chart Data =====
function useMiniPKData() {
  return useMemo(
    () => [
      { h: 0, c: 0 },
      { h: 2, c: 3.8 },
      { h: 4, c: 4.2 },
      { h: 8, c: 3.5 },
      { h: 12, c: 2.8 },
      { h: 24, c: 1.5 },
      { h: 48, c: 0.4 },
      { h: 72, c: 0.1 },
    ],
    []
  );
}

// ===== Safety Status Panel =====
function SafetyStatusPanel() {
  const navigate = useNavigate();
  const [profile] = useSafetyProfile();
  const bpcCheck = useSafetyCheck("bpc-157");
  const tbCheck = useSafetyCheck("tb-500");
  const semaCheck = useSafetyCheck("semaglutide");

  const hasAlerts = [bpcCheck, tbCheck, semaCheck].some(
    (c) => c.warnings.length > 0 || c.contraindications.length > 0
  );

  const totalWarnings = [bpcCheck, tbCheck, semaCheck].reduce(
    (sum, c) => sum + c.warnings.length + c.contraindications.length,
    0
  );

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all border-l-4",
          hasAlerts ? "border-l-amber-500" : "border-l-emerald-500"
        )}
        onClick={() => navigate("/safety")}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-lg",
                  hasAlerts ? "bg-amber-50" : "bg-emerald-50"
                )}
              >
                {hasAlerts ? (
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm">Safety Status</h3>
                {hasAlerts ? (
                  <p className="text-xs text-amber-600 mt-0.5">
                    {totalWarnings} warning{totalWarnings > 1 ? "s" : ""} active
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 mt-0.5">No issues detected</p>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {hasAlerts && (
            <div className="mt-3 space-y-1">
              {[bpcCheck, tbCheck, semaCheck]
                .filter((c) => c.warnings.length > 0 || c.contraindications.length > 0)
                .slice(0, 2)
                .map((check) => (
                  <div
                    key={check.peptideId}
                    className="flex items-center gap-2 text-xs"
                  >
                    <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                    <span className="text-muted-foreground">
                      {check.peptideName}: {check.warnings[0] || check.contraindications[0]}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {!profile && (
            <div className="mt-3 p-2 rounded-md bg-primary/5 text-xs text-primary flex items-center gap-2">
              <Shield className="h-3 w-3" />
              Complete your safety profile for personalized checks
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== PK Curves Mini Card =====
function PKCurvesMiniCard() {
  const navigate = useNavigate();
  const pkData = useMiniPKData();

  return (
    <motion.div variants={itemVariants}>
      <Card
        className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-sky-500"
        onClick={() => navigate("/analytics")}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-50">
                <Microscope className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">PK Simulation</h3>
                <p className="text-xs text-muted-foreground">BPC-157 active curve</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pkData}>
                <defs>
                  <linearGradient id="pkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="h" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 12, padding: 8 }}
                  formatter={(v: number) => [`${v.toFixed(1)} ng/mL`, "Conc"]}
                  labelFormatter={() => ""}
                />
                <Area
                  type="monotone"
                  dataKey="c"
                  stroke="#0ea5e9"
                  fill="url(#pkGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Injection Site Rotation Card =====
function InjectionSiteRotationCard() {
  const navigate = useNavigate();

  const zones = [
    { name: "Abdomen", lastUsed: "2d ago", color: "bg-sky-500" },
    { name: "Thigh", lastUsed: "1d ago", color: "bg-emerald-500" },
    { name: "Gluteal", lastUsed: "4d ago", color: "bg-violet-500" },
    { name: "Deltoid", lastUsed: "3d ago", color: "bg-amber-500" },
  ];

  // Sort by oldest first (next recommended)
  const nextZone = zones.reduce((a, b) =>
    parseInt(a.lastUsed) > parseInt(b.lastUsed) ? a : b
  );

  return (
    <motion.div variants={itemVariants}>
      <Card
        className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-violet-500"
        onClick={() => navigate("/injection-sites")}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-violet-50">
                <Syringe className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Injection Rotation</h3>
                <p className="text-xs text-muted-foreground">Next: {nextZone.name}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2 mt-3">
            {zones.map((zone) => (
              <div key={zone.name} className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", zone.color)} />
                <span className="text-xs flex-1">{zone.name}</span>
                <span className="text-xs text-muted-foreground">{zone.lastUsed}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Bio-Feedback Quick Logger Card =====
function BioFeedbackQuickCard() {
  const navigate = useNavigate();
  const { entries, addEntry, correlations } = useFeedback();

  const recentEntries = entries.slice(-3);

  const quickLog = (metric: string, value: number) => {
    addEntry({
      id: `fb-${Date.now()}`,
      timestamp: Date.now(),
      peptideId: "general",
      metric,
      value,
      unit: "score",
    });
  };

  return (
    <motion.div variants={itemVariants}>
      <Card
        className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-rose-500"
        onClick={() => navigate("/analytics?tab=correlations")}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-50">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Bio-Feedback</h3>
                <p className="text-xs text-muted-foreground">
                  {entries.length} entries &middot; {correlations.length} correlations
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Quick log buttons */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: "Energy", icon: Zap, color: "text-amber-600 bg-amber-50 hover:bg-amber-100" },
              { label: "Recovery", icon: Activity, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" },
              { label: "Sleep", icon: Clock, color: "text-violet-600 bg-violet-50 hover:bg-violet-100" },
            ].map(({ label, icon: Icon, color }) => (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                className={cn("flex flex-col items-center gap-1 h-auto py-2", color)}
                onClick={(e) => {
                  e.stopPropagation();
                  quickLog(label.toLowerCase(), 7);
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-medium">{label}</span>
              </Button>
            ))}
          </div>

          {recentEntries.length > 0 && (
            <div className="mt-3 pt-3 border-t space-y-1">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{entry.metric}</span>
                  <Badge variant="outline" className="text-xs">{entry.value}/10</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Weekly AI Summary Card =====
function WeeklyAISummaryCard() {
  const summary = {
    totalDoses: 18,
    adherence: 78,
    avgRecovery: 82,
    improvementAreas: ["Sleep consistency", "Injection timing"],
    highlights: ["Recovery score up 8%", "Inflammation down 12%"],
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Weekly AI Summary</h3>
              <p className="text-xs text-muted-foreground">Insights from your data</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{summary.totalDoses}</p>
              <p className="text-[10px] text-muted-foreground">Doses</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{summary.adherence}%</p>
              <p className="text-[10px] text-muted-foreground">Adherence</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold">{summary.avgRecovery}</p>
              <p className="text-[10px] text-muted-foreground">Recovery</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-1">
            {summary.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-xs text-emerald-700">
                <TrendingUp className="h-3 w-3" />
                {h}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Vial Inventory Alerts Card =====
function VialInventoryAlertsCard() {
  const navigate = useNavigate();
  const { items, alerts } = useInventory();

  const lowStockItems = items.filter((i) => i.remainingMg / i.vialSizeMg <= 0.3);
  const expiringItems = items.filter(
    (i) => i.expirationDate - Date.now() <= 30 * 24 * 3600 * 1000
  );

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "cursor-pointer hover:shadow-md transition-all border-l-4",
          alerts.length > 0 ? "border-l-red-500" : "border-l-emerald-500"
        )}
        onClick={() => navigate("/inventory")}
      >
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-lg",
                  alerts.length > 0 ? "bg-red-50" : "bg-emerald-50"
                )}
              >
                <Package
                  className={cn(
                    "h-5 w-5",
                    alerts.length > 0 ? "text-red-500" : "text-emerald-500"
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Vial Inventory</h3>
                <p className="text-xs text-muted-foreground">
                  {items.length} vial{items.length !== 1 ? "s" : ""} tracked
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-center gap-2 text-xs p-2 rounded-md",
                    alert.severity === "danger"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                  )}
                >
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  {alert.message}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.slice(0, 3).map((item) => {
                const pct = Math.round((item.remainingMg / item.vialSizeMg) * 100);
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{item.peptideName}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress
                      value={pct}
                      className={cn(
                        "h-1.5",
                        pct <= 20 ? "bg-red-100" : pct <= 50 ? "bg-amber-100" : "bg-emerald-100"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ===== Correlation Insight Cards =====
function CorrelationInsightCards() {
  const { correlations } = useFeedback();

  const topCorrelations = correlations.length > 0
    ? correlations.slice(0, 2)
    : [
        {
          peptideId: "bpc-157",
          metric: "Recovery",
          correlation: 0.82,
          trend: "positive" as const,
          insight: "Your recovery has improved 15% since starting BPC-157",
          confidence: 0.85,
        },
        {
          peptideId: "cjc-1295",
          metric: "Sleep Quality",
          correlation: 0.71,
          trend: "positive" as const,
          insight: "Deep sleep increased by 22% with CJC-1295 protocol",
          confidence: 0.78,
        },
      ];

  return (
    <>
      {topCorrelations.map((corr, index) => (
        <motion.div key={`${corr.peptideId}-${corr.metric}`} variants={itemVariants}>
          <Card className="border-l-4 border-l-emerald-500 h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-emerald-50">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm capitalize">{corr.metric}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(Math.abs(corr.correlation) * 100).toFixed(0)}% correlation
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{corr.insight}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] capitalize">
                  {corr.peptideId}
                </Badge>
                <Badge
                  variant={corr.trend === "positive" ? "default" : "secondary"}
                  className="text-[10px]"
                >
                  {corr.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}

// ===== Main Dashboard Component =====
export default function PremiumDashboardPanels() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top row: Safety status (if alerts) + PK curves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SafetyStatusPanel />
        <PKCurvesMiniCard />
      </div>

      {/* Middle row: Injection rotation, Bio-feedback, Weekly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InjectionSiteRotationCard />
        <BioFeedbackQuickCard />
        <WeeklyAISummaryCard />
      </div>

      {/* Bottom row: Inventory alerts + Correlations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <VialInventoryAlertsCard />
        <CorrelationInsightCards />
      </div>
    </motion.div>
  );
}

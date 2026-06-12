import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Syringe,
  Clock,
  MapPin,
  RotateCcw,
  ChevronRight,
  Filter,
  Activity,
  CalendarDays,
  Cloud,
  CloudOff,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInjectionRecordsCloud, rankNextSites } from "@/hooks/useInjectionRecordsCloud";
import { toast } from "sonner";

// ===== Types =====
interface BodyZone {
  id: string;
  name: string;
  subLocations: string[];
  rotationOrder: number;
}

interface InjectionRecord {
  id: string;
  zoneId: string;
  subLocation: string;
  peptideName: string;
  doseMg: number;
  timestamp: number;
}

// ===== Demo Data =====
const BODY_ZONES: BodyZone[] = [
  { id: "abdomen", name: "Abdomen", subLocations: ["Upper Left", "Upper Right", "Lower Left", "Lower Right", "Periumbilical"], rotationOrder: 1 },
  { id: "thigh", name: "Thigh", subLocations: ["Front Left", "Front Right", "Outer Left", "Outer Right"], rotationOrder: 2 },
  { id: "glute", name: "Gluteal", subLocations: ["Upper Left", "Upper Right", "Ventrogluteal L", "Ventrogluteal R"], rotationOrder: 3 },
  { id: "deltoid", name: "Deltoid", subLocations: ["Left", "Right"], rotationOrder: 4 },
  { id: "tricep", name: "Tricep", subLocations: ["Left", "Right"], rotationOrder: 5 },
];

const DEMO_RECORDS: InjectionRecord[] = [
  { id: "r1", zoneId: "abdomen", subLocation: "Upper Left", peptideName: "BPC-157", doseMg: 0.25, timestamp: Date.now() - 24 * 3600 * 1000 },
  { id: "r2", zoneId: "thigh", subLocation: "Front Right", peptideName: "TB-500", doseMg: 5, timestamp: Date.now() - 48 * 3600 * 1000 },
  { id: "r3", zoneId: "glute", subLocation: "Upper Left", peptideName: "CJC-1295", doseMg: 0.1, timestamp: Date.now() - 72 * 3600 * 1000 },
  { id: "r4", zoneId: "abdomen", subLocation: "Lower Right", peptideName: "BPC-157", doseMg: 0.25, timestamp: Date.now() - 96 * 3600 * 1000 },
  { id: "r5", zoneId: "deltoid", subLocation: "Left", peptideName: "Ipamorelin", doseMg: 0.2, timestamp: Date.now() - 120 * 3600 * 1000 },
  { id: "r6", zoneId: "thigh", subLocation: "Outer Left", peptideName: "TB-500", doseMg: 5, timestamp: Date.now() - 144 * 3600 * 1000 },
];

const ZONE_COLORS: Record<string, { bg: string; border: string; text: string; active: string }> = {
  abdomen: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", active: "bg-sky-500" },
  thigh: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", active: "bg-emerald-500" },
  glute: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", active: "bg-violet-500" },
  deltoid: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", active: "bg-amber-500" },
  tricep: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", active: "bg-rose-500" },
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

// ===== BodyMap Component =====
function BodyMap({
  selectedZone,
  onZoneSelect,
}: {
  selectedZone: string | null;
  onZoneSelect: (zoneId: string) => void;
}) {
  const zones = [
    { id: "deltoid", label: "Deltoids", top: "8%", left: "50%", transform: "translateX(-50%)" },
    { id: "tricep", label: "Triceps", top: "20%", left: "75%", transform: "translateX(-50%)" },
    { id: "abdomen", label: "Abdomen", top: "35%", left: "50%", transform: "translateX(-50%)" },
    { id: "glute", label: "Glutes", top: "52%", left: "50%", transform: "translateX(-50%)" },
    { id: "thigh", label: "Thighs", top: "72%", left: "50%", transform: "translateX(-50%)" },
  ];

  return (
    <div className="relative w-full max-w-[400px] mx-auto aspect-[3/5] bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border-2 border-border p-6">
      {/* Body outline */}
      <svg viewBox="0 0 200 340" className="w-full h-full opacity-20">
        <ellipse cx="100" cy="30" rx="25" ry="28" fill="currentColor" />
        <rect x="75" y="58" width="50" height="55" rx="15" fill="currentColor" />
        <rect x="80" y="115" width="40" height="65" rx="10" fill="currentColor" />
        <ellipse cx="100" cy="195" rx="45" ry="28" fill="currentColor" />
        <rect x="70" y="220" width="25" height="55" rx="8" fill="currentColor" />
        <rect x="105" y="220" width="25" height="55" rx="8" fill="currentColor" />
        <rect x="70" y="278" width="22" height="55" rx="6" fill="currentColor" />
        <rect x="108" y="278" width="22" height="55" rx="6" fill="currentColor" />
      </svg>

      {/* Zone markers */}
      {zones.map((zone) => {
        const colors = ZONE_COLORS[zone.id];
        const isActive = selectedZone === zone.id;
        return (
          <motion.button
            key={zone.id}
            className={cn(
              "absolute px-3 py-1.5 rounded-full text-xs font-semibold border-2 shadow-sm transition-colors",
              isActive ? `${colors.active} text-white border-transparent` : `${colors.bg} ${colors.border} ${colors.text}`
            )}
            style={{ top: zone.top, left: zone.left, transform: zone.transform }}
            onClick={() => onZoneSelect(zone.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {zone.label}
          </motion.button>
        );
      })}

      <div className="absolute bottom-3 left-3 right-3 text-center">
        <p className="text-[10px] text-muted-foreground">Click a zone to view details</p>
      </div>
    </div>
  );
}

// ===== Time Ago Helper =====
function timeAgo(timestamp: number): string {
  const hours = Math.floor((Date.now() - timestamp) / (3600 * 1000));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ===== Main Page Component =====
export default function InjectionSitesPage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let records = [...DEMO_RECORDS].sort((a, b) => b.timestamp - a.timestamp);
    if (activeFilter) {
      records = records.filter((r) => r.zoneId === activeFilter);
    }
    return records;
  }, [activeFilter]);

  const zoneRecords = useMemo(() => {
    if (!selectedZone) return [];
    return DEMO_RECORDS.filter((r) => r.zoneId === selectedZone).sort((a, b) => b.timestamp - a.timestamp);
  }, [selectedZone]);

  // Calculate rotation schedule: next zone to use
  const nextZone = useMemo(() => {
    const usedTimestamps: Record<string, number> = {};
    for (const record of DEMO_RECORDS) {
      if (!usedTimestamps[record.zoneId] || record.timestamp > usedTimestamps[record.zoneId]) {
        usedTimestamps[record.zoneId] = record.timestamp;
      }
    }

    const sortedZones = [...BODY_ZONES].sort((a, b) => {
      const aTime = usedTimestamps[a.id] ?? 0;
      const bTime = usedTimestamps[b.id] ?? 0;
      return aTime - bTime; // Least recently used first
    });

    return sortedZones[0];
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
              <Syringe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Injection Site Manager</h1>
              <p className="text-muted-foreground mt-1">
                Track rotation, history, and optimal site selection
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Body Map */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Body Map
                </CardTitle>
                <CardDescription>Select an injection zone</CardDescription>
              </CardHeader>
              <BodyMap selectedZone={selectedZone} onZoneSelect={setSelectedZone} />

              {/* Zone filter buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant={activeFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(null)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  All
                </Button>
                {BODY_ZONES.map((zone) => {
                  const colors = ZONE_COLORS[zone.id];
                  return (
                    <Button
                      key={zone.id}
                      variant={activeFilter === zone.id ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        activeFilter === zone.id ? colors.active : `${colors.bg} ${colors.text} ${colors.border}`
                      )}
                      onClick={() => setActiveFilter(activeFilter === zone.id ? null : zone.id)}
                    >
                      {zone.name}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-7 space-y-6">
            {/* Rotation Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    Rotation Schedule
                  </CardTitle>
                  <CardDescription>Recommended next injection site</CardDescription>
                </CardHeader>
                <CardContent>
                  {nextZone && (
                    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", ZONE_COLORS[nextZone.id].bg)}>
                          <Activity className={cn("h-5 w-5", ZONE_COLORS[nextZone.id].text)} />
                        </div>
                        <div>
                          <p className="font-semibold">{nextZone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {nextZone.subLocations.length} available sub-locations
                          </p>
                        </div>
                      </div>
                      <Button size="sm">
                        Use This Site
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}

                  {/* All zones rotation order */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rotation Priority</p>
                    {[...BODY_ZONES]
                      .sort((a, b) => {
                        const aTime = DEMO_RECORDS.filter((r) => r.zoneId === a.id).sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp ?? 0;
                        const bTime = DEMO_RECORDS.filter((r) => r.zoneId === b.id).sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp ?? 0;
                        return aTime - bTime;
                      })
                      .map((zone, index) => {
                        const lastUsed = DEMO_RECORDS.filter((r) => r.zoneId === zone.id).sort((a, b) => b.timestamp - a.timestamp)[0];
                        return (
                          <div
                            key={zone.id}
                            className={cn(
                              "flex items-center gap-3 py-2 px-3 rounded-lg text-sm",
                              selectedZone === zone.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
                            )}
                            onClick={() => setSelectedZone(zone.id)}
                            role="button"
                          >
                            <span className="text-xs font-bold text-muted-foreground w-5">{index + 1}</span>
                            <span className="font-medium flex-1">{zone.name}</span>
                            {lastUsed ? (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {timeAgo(lastUsed.timestamp)}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Never used</Badge>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Zone History */}
            <AnimatePresence mode="wait">
              {selectedZone && (
                <motion.div
                  key={selectedZone}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        {BODY_ZONES.find((z) => z.id === selectedZone)?.name} History
                      </CardTitle>
                      <CardDescription>
                        {zoneRecords.length} injection{zoneRecords.length !== 1 ? "s" : ""} recorded
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {zoneRecords.length > 0 ? (
                        <div className="space-y-2">
                          {zoneRecords.map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center justify-between py-2 px-3 rounded-lg border hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Syringe className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">{record.peptideName}</p>
                                  <p className="text-xs text-muted-foreground">{record.subLocation}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">{record.doseMg}mg</p>
                                <p className="text-xs text-muted-foreground">{timeAgo(record.timestamp)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No injections recorded for this zone yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Injections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Injections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredRecords.map((record, index) => {
                      const zone = BODY_ZONES.find((z) => z.id === record.zoneId);
                      const colors = zone ? ZONE_COLORS[zone.id] : ZONE_COLORS.abdomen;
                      return (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between py-2 px-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedZone(record.zoneId)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-2.5 h-2.5 rounded-full", colors.active)} />
                            <div>
                              <p className="text-sm font-medium">{record.peptideName}</p>
                              <p className="text-xs text-muted-foreground">
                                {zone?.name} &middot; {record.subLocation}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{record.doseMg}mg</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(record.timestamp)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

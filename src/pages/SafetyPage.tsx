import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, Pill, Heart, Baby, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSafetyProfile, useSafetyCheck } from "@/hooks/useSafety";
import { UserSafetyProfile } from "@/types";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

const DEMO_PEPTIDES = [
  { id: "bpc-157", name: "BPC-157" },
  { id: "tb-500", name: "TB-500" },
  { id: "cjc-1295", name: "CJC-1295" },
  { id: "ipamorelin", name: "Ipamorelin" },
  { id: "semaglutide", name: "Semaglutide" },
  { id: "melanotan-ii", name: "Melanotan II" },
];

function SafetyCheckCard({ peptideId, peptideName }: { peptideId: string; peptideName: string }) {
  const result = useSafetyCheck(peptideId);

  const statusConfig = {
    safe: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
    caution: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    contraindicated: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
    unknown: { icon: Activity, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border-l-4", config.border, "hover:shadow-md transition-shadow")}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <StatusIcon className={cn("h-5 w-5", config.color)} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{peptideName}</h4>
                <Badge
                  variant={result.status === "safe" ? "default" : result.status === "caution" ? "secondary" : "destructive"}
                  className="mt-1 text-xs capitalize"
                >
                  {result.status}
                </Badge>
              </div>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700 flex items-start gap-1">
                  <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                  {w}
                </p>
              ))}
            </div>
          )}

          {result.contraindications.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.contraindications.map((c, i) => (
                <p key={i} className="text-xs text-red-700 flex items-start gap-1">
                  <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  {c}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SafetyPage() {
  const [profile, setProfile] = useSafetyProfile();

  const [formState, setFormState] = useState<Partial<UserSafetyProfile>>({
    age: profile?.age ?? 30,
    isPregnant: profile?.isPregnant ?? false,
    medications: profile?.medications ?? [],
    conditions: profile?.conditions ?? [],
    allergies: profile?.allergies ?? [],
  });

  const [medInput, setMedInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");

  const handleSaveProfile = () => {
    const updated: UserSafetyProfile = {
      id: profile?.id ?? `user-safety-${Date.now()}`,
      age: formState.age ?? 30,
      isPregnant: formState.isPregnant ?? false,
      medications: formState.medications ?? [],
      conditions: formState.conditions ?? [],
      allergies: formState.allergies ?? [],
      lastUpdated: Date.now(),
    };
    setProfile(updated);
  };

  const addToList = (field: "medications" | "conditions" | "allergies", value: string) => {
    if (!value.trim()) return;
    setFormState((prev) => ({
      ...prev,
      [field]: [...(prev[field] ?? []), value.trim()],
    }));
  };

  const removeFromList = (field: "medications" | "conditions" | "allergies", index: number) => {
    setFormState((prev) => ({
      ...prev,
      [field]: (prev[field] ?? []).filter((_, i) => i !== index),
    }));
  };

  // Count active alerts
  const activeAlerts = DEMO_PEPTIDES.filter((p) => {
    // This would be a real check in production
    return false;
  });

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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Safety Center</h1>
              <p className="text-muted-foreground mt-1">
                Manage your safety profile and check peptide interactions
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Active Alerts Banner */}
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-amber-300 bg-amber-50/50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-amber-800">
                  You have {activeAlerts.length} active safety alert{activeAlerts.length > 1 ? "s" : ""}.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Safety Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  User Safety Profile
                </CardTitle>
                <CardDescription>
                  Your health information is stored locally on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Age
                  </label>
                  <Input
                    type="number"
                    value={formState.age}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, age: parseInt(e.target.value) || 0 }))
                    }
                    min={0}
                    max={120}
                    className="max-w-[120px]"
                  />
                </div>

                {/* Pregnancy */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Baby className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Pregnancy</p>
                      <p className="text-xs text-muted-foreground">Currently pregnant or trying to conceive</p>
                    </div>
                  </div>
                  <Switch
                    checked={formState.isPregnant}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({ ...prev, isPregnant: checked }))
                    }
                  />
                </div>

                {/* Medications */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    Current Medications
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      placeholder="Add medication..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addToList("medications", medInput);
                          setMedInput("");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("medications", medInput);
                        setMedInput("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formState.medications ?? []).map((med, i) => (
                      <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-destructive/20" onClick={() => removeFromList("medications", i)}>
                        {med} <span className="ml-1 text-xs">&times;</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical Conditions</label>
                  <div className="flex gap-2">
                    <Input
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      placeholder="Add condition..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addToList("conditions", conditionInput);
                          setConditionInput("");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("conditions", conditionInput);
                        setConditionInput("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formState.conditions ?? []).map((cond, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-destructive/20" onClick={() => removeFromList("conditions", i)}>
                        {cond} <span className="ml-1 text-xs">&times;</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allergies</label>
                  <div className="flex gap-2">
                    <Input
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      placeholder="Add allergy..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addToList("allergies", allergyInput);
                          setAllergyInput("");
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList("allergies", allergyInput);
                        setAllergyInput("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formState.allergies ?? []).map((allergy, i) => (
                      <Badge key={i} variant="destructive" className="cursor-pointer opacity-80 hover:opacity-100" onClick={() => removeFromList("allergies", i)}>
                        {allergy} <span className="ml-1 text-xs">&times;</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={handleSaveProfile}>
                  <Shield className="h-4 w-4 mr-2" />
                  Save Safety Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interaction Checker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Interaction Checker
                </CardTitle>
                <CardDescription>
                  Safety status for peptides based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_PEPTIDES.map((peptide, index) => (
                    <motion.div
                      key={peptide.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <SafetyCheckCard peptideId={peptide.id} peptideName={peptide.name} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contraindication Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Contraindication Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 shrink-0">&bull;</span>
                      Most research peptides are contraindicated during pregnancy and in individuals with active cancer.
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5 shrink-0">&bull;</span>
                      GLP-1 agonists (Semaglutide, Tirzepatide) require caution with sulfonylureas and insulin.
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5 shrink-0">&bull;</span>
                      PT-141 should be avoided with cardiovascular conditions and nitrates.
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 shrink-0">&bull;</span>
                      Always consult with a healthcare provider before starting any peptide protocol.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

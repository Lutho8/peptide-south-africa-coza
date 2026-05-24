import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { COUNTRY_CODES } from "@/data/countryCodes";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [dial, setDial] = useState("+49");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const e164 = `${dial}${phone.replace(/\D/g, "")}`;

  const sendCode = async () => {
    if (!agreed) return toast.error("Please confirm the research-use acknowledgment.");
    if (phone.replace(/\D/g, "").length < 6) return toast.error("Enter a valid phone number.");
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: e164 });
    setSending(false);
    if (error) {
      toast.error(error.message.includes("provider") || error.message.includes("not enabled")
        ? "SMS provider not yet configured. Try Google or Apple sign-in below."
        : error.message);
      return;
    }
    toast.success(`Code sent to ${e164}`);
    setStep("otp");
  };

  const verify = async (token: string) => {
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ phone: e164, token, type: "sms" });
    setVerifying(false);
    if (error) { toast.error(error.message); setCode(""); return; }
    toast.success("Signed in");
    try {
      await supabase.from("profiles").update({
        research_use_acknowledged_at: new Date().toISOString(),
      } as never).eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");
    } catch { /* ignore – column may not exist yet */ }
    navigate("/", { replace: true });
  };

  const oauth = async (provider: "google" | "apple") => {
    if (!agreed) return toast.error("Please confirm the research-use acknowledgment first.");
    const { error } = await lovable.auth.signInWithOAuth(provider, {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 shadow-2xl backdrop-blur-xl bg-card/80">
          <CardHeader className="space-y-2">
            {step === "otp" && (
              <button
                onClick={() => { setStep("phone"); setCode(""); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition w-fit"
              >
                <ArrowLeft className="h-3 w-3" /> Change number
              </button>
            )}
            <CardTitle className="text-2xl font-bold">
              {step === "phone" ? "Login with phone number" : "Enter verification code"}
            </CardTitle>
            <CardDescription className="leading-relaxed">
              {step === "phone"
                ? "Due to regulatory changes in this industry, we now require an account login to access product information and continue browsing."
                : `We sent a 6-digit code to ${e164}. Enter it below to continue.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Phone <span className="text-destructive">*(Required)</span>
                    </label>
                    <div className="flex gap-2">
                      <Select value={dial} onValueChange={setDial}>
                        <SelectTrigger className="w-[120px] min-h-[44px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((c) => (
                            <SelectItem key={c.iso} value={c.dial}>
                              <span className="mr-2">{c.flag}</span>{c.iso} {c.dial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="1624747159"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 min-h-[44px] text-base bg-muted/40"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={sendCode}
                    disabled={sending || !agreed}
                    className="w-full min-h-[48px] text-base font-semibold"
                    style={{ backgroundColor: "#3B82F6" }}
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Code"}
                  </Button>

                  <label className="flex gap-3 items-start cursor-pointer text-xs leading-relaxed text-muted-foreground">
                    <Checkbox
                      checked={agreed}
                      onCheckedChange={(v) => setAgreed(v === true)}
                      className="mt-0.5"
                    />
                    <span>
                      I confirm that I am a qualified researcher or institutional professional, that
                      all products discussed are strictly for lawful Research Use Only (not for human
                      or animal use, clinical, diagnostic, or therapeutic purposes), and that I accept
                      full responsibility for compliance with all applicable laws and regulations. I
                      assume all risks associated with handling research materials and agree to hold
                      the company harmless.
                    </span>
                  </label>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => oauth("google")} className="min-h-[44px]">
                      Google
                    </Button>
                    <Button variant="outline" onClick={() => oauth("apple")} className="min-h-[44px]">
                      Apple
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-5 flex flex-col items-center"
                >
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(v) => {
                      setCode(v);
                      if (v.length === 6) verify(v);
                    }}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {verifying && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  <button
                    onClick={sendCode}
                    disabled={sending}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "Resend code"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          For research use only. Not FDA approved.
        </p>
      </motion.div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { useAuth } from "@/contexts/AuthContext";

const SHOP_URL = "https://www.ridethetide.site";

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(222_47%_11%)] via-background to-[hsl(217_33%_17%)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl text-center"
      >
        <div className="mb-8 flex justify-center">
          <AnimatedLogo size="lg" showText={false} />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          Track Your Protocol.{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
            See What's Actually Working.
          </span>
        </h1>

        <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          The only free peptide tracker built for South African researchers. Dose logging,
          bloodwork integration, monthly expert Q&amp;As.{" "}
          <span className="text-foreground font-semibold">No paywalls. Ever.</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl shadow-primary/25 hover:opacity-95"
            >
              Start Tracking Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href={SHOP_URL}>
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-primary text-white shadow-xl shadow-orange-500/30 hover:opacity-95 hover:scale-[1.02] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Peptides
            </Button>
          </a>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Built in Cape Town 🇿🇦 · For research use only · Not FDA approved.
        </p>
      </motion.div>
    </div>
  );
}

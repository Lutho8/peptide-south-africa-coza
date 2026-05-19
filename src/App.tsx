import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { startCycleNotificationChecker, stopCycleNotificationChecker } from "@/services/cycleNotifications";
import { Loader2 } from "lucide-react";

// Lazy load all route pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FreeCourse = lazy(() => import("./pages/FreeCourse"));
const COAVerification = lazy(() => import("./pages/COAVerification"));
const LiveQnA = lazy(() => import("./pages/LiveQnA"));
const PeptideEntityPage = lazy(() => import("./pages/PeptideEntityPage"));
const CategoryHubPage = lazy(() => import("./pages/CategoryHubPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const BloodworkPage = lazy(() => import("./pages/BloodworkPage"));
const TodayRemindersScreen = lazy(() => import("./screens/TodayRemindersScreen"));
const CycleManagementScreen = lazy(() => import("./screens/CycleManagementScreen"));
const SEODashboard = lazy(() => import("./pages/admin/SEODashboard"));
const SEOVerifyPage = lazy(() => import("./pages/admin/SEOVerifyPage"));

// Initialize i18n
import '@/i18n';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    startCycleNotificationChecker();
    return () => stopCycleNotificationChecker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/free-course" element={<FreeCourse />} />
                <Route path="/coa-verification" element={<COAVerification />} />
                <Route path="/live-qna" element={<LiveQnA />} />
                <Route path="/peptides/:slug" element={<PeptideEntityPage />} />
                <Route path="/categories/:slug" element={<CategoryHubPage />} />
                <Route path="/guides/:slug" element={<GuidePage />} />
                <Route path="/bloodwork" element={<BloodworkPage />} />
                <Route path="/reminders/today" element={<TodayRemindersScreen />} />
                <Route path="/cycles" element={<CycleManagementScreen />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/admin/seo" element={<SEODashboard />} />
                <Route path="/admin/seo/verify" element={<SEOVerifyPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

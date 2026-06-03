import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

// ---- Lazy loaded: Existing routes ----
const Index = lazy(() => import("./pages/Index"));
const Welcome = lazy(() => import("./pages/Welcome"));
const PeptideEntityPage = lazy(() => import("./pages/PeptideEntityPage"));
const CategoryHubPage = lazy(() => import("./pages/CategoryHubPage"));
const GuidePage = lazy(() => import("./pages/GuidePage"));
const BloodworkPage = lazy(() => import("./pages/BloodworkPage"));
const FreeCourse = lazy(() => import("./pages/FreeCourse"));
const COAVerification = lazy(() => import("./pages/COAVerification"));
const LiveQnA = lazy(() => import("./pages/LiveQnA"));
const TodayRemindersScreen = lazy(() => import("./pages/TodayRemindersScreen"));
const CycleManagementScreen = lazy(() => import("./pages/CycleManagementScreen"));
const BlogIndexPage = lazy(() => import("./pages/BlogIndexPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// ---- Lazy loaded: NEW premium routes ----
const SafetyCenter = lazy(() => import("./pages/SafetyPage"));
const InjectionSites = lazy(() => import("./pages/InjectionSitesPage"));
const Analytics = lazy(() => import("./pages/AnalyticsPage"));
const Inventory = lazy(() => import("./pages/InventoryPage"));

// ---- Loading fallback ----
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// ---- React Query client ----
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ===== App =====
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ---- EXISTING ROUTES (kept exactly as they are) ---- */}
              <Route path="/" element={<Index />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/peptides/:slug" element={<PeptideEntityPage />} />
              <Route path="/categories/:slug" element={<CategoryHubPage />} />
              <Route path="/guides/:slug" element={<GuidePage />} />
              <Route path="/bloodwork" element={<BloodworkPage />} />
              <Route path="/free-course" element={<FreeCourse />} />
              <Route path="/coa-verification" element={<COAVerification />} />
              <Route path="/live-qna" element={<LiveQnA />} />
              <Route path="/reminders/today" element={<TodayRemindersScreen />} />
              <Route path="/cycles" element={<CycleManagementScreen />} />
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* ---- NEW PREMIUM ROUTES ---- */}
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/injection-sites" element={<InjectionSites />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
